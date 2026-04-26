import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Fix Leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Geoapify config
const GEOAPIFY_API_KEY = '8fd8b797090b479fa155228614bee82d';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  
  // Maps state
  const [storeLocation] = useState<[number, number]>([28.6129, 77.2295]); // Dummy store
  const [deliveryLocation, setDeliveryLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const unsub = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setOrder(data);
        if (data.location && data.location.lat && data.location.lng) {
          setDeliveryLocation([data.location.lat, data.location.lng]);
        }
      }
    });

    return () => unsub();
  }, [orderId]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!deliveryLocation) return;
      
      const url = `https://api.geoapify.com/v1/routing?waypoints=${storeLocation[0]},${storeLocation[1]}|${deliveryLocation[0]},${deliveryLocation[1]}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates[0];
          // Geoapify returns [lon, lat], leaflet needs [lat, lon]
          const leafletRoute: [number, number][] = coords.map((c: number[]) => [c[1], c[0]]);
          setRoute(leafletRoute);
          
          const distKm = (data.features[0].properties.distance / 1000).toFixed(1);
          setDistance(`${distKm} km`);
        }
      } catch(err) {
        console.error("Route fetching failed", err);
      }
    };

    fetchRoute();
  }, [deliveryLocation, storeLocation]);

  if (!order) return <div className="p-8 text-center">Loading order...</div>;

  const statuses = ['Placed', 'Packed', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status) >= 0 ? statuses.indexOf(order.status) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <div className="bg-white/80 backdrop-blur px-4 py-4 flex items-center shadow-sm absolute top-0 w-full z-[1000]">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-800 bg-white shadow-sm rounded-full mr-2">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white px-3 py-1 rounded-full shadow-sm">
          <h1 className="text-sm font-bold text-gray-800">Track Order</h1>
        </div>
      </div>

      {/* Map Area */}
      <div className="h-[50vh] w-full z-0 relative">
        {deliveryLocation ? (
          <MapContainer 
            center={storeLocation} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
              url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
            />
            <Marker position={storeLocation}>
              <Popup>Store</Popup>
            </Marker>
            <Marker position={deliveryLocation}>
              <Popup>Delivery Address</Popup>
            </Marker>
            {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
          </MapContainer>
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">Map loading...</div>
        )}
      </div>

      {/* Bottom Sheet tracking info */}
      <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex-1 z-10 -mt-6 p-6 relative">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-gray-500 font-medium">Order ID: #{orderId?.slice(0, 8)}</p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {distance ? `Arriving in ${parseInt(distance)*3} mins` : "Calculating..."}
            </h2>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">
            {distance}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mt-8 space-y-6">
          {[
            { label: 'Order Placed', icon: Package, index: 0 },
            { label: 'Packed & Dispatched', icon: Truck, index: 1 },
            { label: 'Delivered', icon: CheckCircle, index: 2 },
          ].map((item, i) => {
            const isActive = i <= currentStatusIndex;
            const isLast = i === 2;
            return (
              <div key={item.label} className="flex relative">
                 {/* Line connection */}
                 {!isLast && (
                    <div className={`absolute left-5 top-10 w-0.5 h-10 ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                 )}
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <item.icon size={20} />
                 </div>
                 <div className="ml-4 flex flex-col justify-center">
                    <h3 className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</h3>
                    {isActive && i === currentStatusIndex && <p className="text-xs text-blue-600 mt-0.5">Current Status</p>}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
