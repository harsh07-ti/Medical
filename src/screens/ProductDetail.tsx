import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart, Medicine } from '../contexts/CartContext';

// Mock DB
const ALL_MEDICINES: Medicine[] = [
  { id: 'med-1', name: 'Paracetamol 500mg', price: 5.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a520ca?w=400&q=80', description: 'Effective pain reliever and fever reducer.', category: 'Tablet' },
  { id: 'med-2', name: 'Amoxicillin Syrup', price: 12.50, image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80', description: 'Antibiotic used to treat bacterial infections.', category: 'Syrup' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = ALL_MEDICINES.find(m => m.id === id) || ALL_MEDICINES[0];

  const handleAdd = () => {
    addToCart(product, quantity);
    // Optional: show toast
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-gray-800">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Image */}
      <div className="h-72 bg-gray-100 rounded-b-[40px] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="px-6 py-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-sm text-blue-600 font-medium mt-1">{product.category}</p>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 flex gap-4 items-center mb-16">
        <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-gray-600 hover:text-black"
          >
            <Minus size={20} />
          </button>
          <span className="font-bold text-gray-900 w-4 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="text-gray-600 hover:text-black"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 transition-colors"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
