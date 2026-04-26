import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart, Medicine } from '../contexts/CartContext';

// Using same mock data logic
const ALL_MEDICINES: Medicine[] = [
  { id: 'med-1', name: 'Paracetamol 500mg', price: 5.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a520ca?w=400&q=80', category: 'Tablet' },
  { id: 'med-2', name: 'Amoxicillin Syrup', price: 12.50, image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80', category: 'Syrup' },
  { id: 'med-3', name: 'Vitamin C 1000mg', price: 8.99, image: 'https://images.unsplash.com/photo-1550572017-edb3f52b6559?w=400&q=80', category: 'Vitamins' },
];

export default function MedicineList() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filtered = categoryName 
    ? ALL_MEDICINES.filter(m => m.category === categoryName)
    : ALL_MEDICINES;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{categoryName || 'Medicines'}</h1>
      </div>

      <div className="p-4 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No medicines found in this category.</p>
        ) : (
          filtered.map(med => (
            <div key={med.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div 
                className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${med.id}`)}
              >
                <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/product/${med.id}`)}>
                <h3 className="font-semibold text-gray-800">{med.name}</h3>
                <p className="text-sm text-gray-500">{med.category}</p>
                <div className="font-bold text-blue-600 mt-1">${med.price.toFixed(2)}</div>
              </div>
              <button 
                onClick={() => addToCart(med)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm active:bg-blue-700"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
