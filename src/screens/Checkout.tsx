import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState(userProfile?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    if (!address.trim()) {
      setError("Please enter delivery address");
      return;
    }
    
    setLoading(true);
    try {
      // Mock coordinates for Geoapify tracking later
      const mockLat = 28.6139 + (Math.random() * 0.05);
      const mockLng = 77.2090 + (Math.random() * 0.05);

      const orderData = {
        userId: currentUser?.uid,
        items,
        total: totalPrice,
        status: 'Placed',
        address,
        location: { lat: mockLat, lng: mockLng },
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      navigate(`/tracking/${docRef.id}`, { replace: true });
    } catch (err: any) {
      setError("Failed to place order. " + err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Address Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-blue-600" size={20} />
            <h2 className="font-bold text-gray-800">Delivery Address</h2>
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter full delivery address"
          />
        </div>

        {/* Payment options placeholder */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="text-green-600" size={20} />
            <h2 className="font-bold text-gray-800">Payment Method</h2>
          </div>
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-xl flex items-center justify-between">
            <span className="font-medium text-blue-800">Cash on Delivery</span>
            <div className="w-4 h-4 rounded-full bg-blue-600 outline outline-2 outline-offset-2 outline-blue-200"></div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items Total ({items.length})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$2.00</span>
            </div>
            <div className="w-full h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total to Pay</span>
              <span>${(totalPrice + 2).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      <div className="bg-white p-6 border-t border-gray-100 sticky bottom-0">
        <button 
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}
