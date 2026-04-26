import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full mr-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">My Cart</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                      <p className="font-bold text-blue-600 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg px-2 py-1 w-24">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-600 p-1"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium text-sm text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-600 p-1"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="bg-white p-6 border-t border-gray-100 sticky bottom-0 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="text-gray-500 font-medium">Total amount</span>
            <span className="font-extrabold text-2xl text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
