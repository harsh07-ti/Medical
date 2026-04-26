import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, Syringe, Heart, Activity } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Medicine } from '../contexts/CartContext';

// Mock data since Firestore is empty
const FEATURED_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol 500mg',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a520ca?w=400&q=80',
    description: 'Pain reliever and a fever reducer.',
    category: 'Tablet'
  },
  {
    id: 'med-2',
    name: 'Amoxicillin Syrup',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
    description: 'Antibiotic used to treat a number of bacterial infections.',
    category: 'Syrup'
  },
  {
    id: 'med-3',
    name: 'Vitamin C 1000mg',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1550572017-edb3f52b6559?w=400&q=80',
    description: 'Daily immunity booster supplement.',
    category: 'Vitamins'
  },
  {
    id: 'med-4',
    name: 'Ibuprofen 400mg',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1550572017-edb3f52b6559?w=400&q=80', // Replace with proper image
    description: 'Nonsteroidal anti-inflammatory drug.',
    category: 'Tablet'
  }
];

const CATEGORIES = [
  { name: 'Tablet', icon: Pill, color: 'bg-blue-100 text-blue-600' },
  { name: 'Syrup', icon: Activity, color: 'bg-purple-100 text-purple-600' },
  { name: 'Vitamins', icon: Heart, color: 'bg-red-100 text-red-600' },
  { name: 'Injection', icon: Syringe, color: 'bg-green-100 text-green-600' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
       // Typically would navigate to search results
       // navigate(`/search?q=${search}`);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      {/* Header / Search */}
      <div className="bg-blue-600 px-4 pt-10 pb-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold text-white mb-4">Find your Medicine</h1>
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 shadow-sm"
            placeholder="Search medicines, health products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="flex-1 px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Categories</h2>
          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/category/${cat.name}`)}
                className="flex flex-col items-center space-y-2"
              >
                <div className={`p-3 rounded-2xl ${cat.color} shadow-sm`}>
                  <cat.icon size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Featured Products</h2>
            <button className="text-sm font-semibold text-blue-600">See All</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {FEATURED_MEDICINES.map((med) => (
              <div key={med.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div 
                  className="bg-gray-100 rounded-xl h-32 mb-3 relative overflow-hidden" 
                  onClick={() => navigate(`/product/${med.id}`)}
                >
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/product/${med.id}`)}>
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{med.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{med.category}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-blue-600">${med.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(med)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-xl leading-none">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
