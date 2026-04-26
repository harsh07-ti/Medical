import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User, FileText } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const AppLayout = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  // Hide bottom nav on certain screens if needed
  const hideBottomNav = ['/login', '/splash', '/checkout'].includes(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-xl relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {!hideBottomNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4 z-50">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`
            }
          >
            <Home size={24} />
            <span className="text-xs font-medium">Home</span>
          </NavLink>
          
          <NavLink
            to="/upload-prescription"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`
            }
          >
            <FileText size={24} />
            <span className="text-xs font-medium">Upload</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 relative ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`
            }
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Cart</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`
            }
          >
            <User size={24} />
            <span className="text-xs font-medium">Profile</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
};
