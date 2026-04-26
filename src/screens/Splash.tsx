import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity } from 'lucide-react';

export default function Splash() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (currentUser) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }, 2000); // 2 second delay for splash
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-600 text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="bg-white p-4 rounded-full mb-4">
          <Activity size={48} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">RS MediHub</h1>
        <p className="mt-2 text-blue-100">Your health, delivered right to you.</p>
      </div>
    </div>
  );
}
