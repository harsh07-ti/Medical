import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Mail, User as UserIcon, Package, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { userProfile, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-blue-600 px-6 pt-10 pb-8 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur text-white text-2xl font-bold">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userProfile?.name || 'User Name'}</h2>
            <p className="text-blue-100 text-sm">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 mt-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <div className="flex items-center p-3 border-b border-gray-100">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-4">
              <UserIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-800">{userProfile?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 border-b border-gray-100">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600 mr-4">
              <Mail size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-gray-800 truncate">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3">
            <div className="bg-green-50 p-2 rounded-lg text-green-600 mr-4">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Saved Address</p>
              <p className="font-semibold text-gray-800 text-sm">{userProfile?.address || 'Not added'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          {/* Mock link to orders */}
          <button className="w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-xl">
            <div className="bg-orange-50 p-2 rounded-lg text-orange-600 mr-4">
              <Package size={20} />
            </div>
            <span className="flex-1 text-left font-semibold text-gray-800">My Orders</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 border border-red-100 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
