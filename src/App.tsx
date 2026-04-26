import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppLayout } from './components/AppLayout';

// Screens
import Splash from './screens/Splash';
import LoginSignup from './screens/LoginSignup';
import Home from './screens/Home';
import MedicineList from './screens/MedicineList';
import ProductDetail from './screens/ProductDetail';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import PrescriptionUpload from './screens/PrescriptionUpload';
import OrderTracking from './screens/OrderTracking';
import Profile from './screens/Profile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/splash" element={<Splash />} />
            <Route path="/login" element={<LoginSignup />} />
            
            <Route path="/" element={<AppLayout />}>
              <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="category/:categoryName" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
              <Route path="product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="upload-prescription" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />
              <Route path="tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/splash" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

