import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldX } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [showDenied, setShowDenied] = useState(false);
  
  useEffect(() => {
    if (!loading && currentUser && currentUser.role !== 'admin') {
      setShowDenied(true);
      setTimeout(() => {
        // Redirigir después de 2 segundos
      }, 2000);
    }
  }, [currentUser, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-yamaha-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yamaha-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== 'admin') {
    if (showDenied) {
      return (
        <div className="min-h-screen bg-yamaha-dark-900 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <ShieldX className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Acceso Denegado</h2>
            <p className="text-gray-400">No tienes permisos de administrador</p>
            <p className="text-sm text-gray-500 mt-2">Redirigiendo al inicio...</p>
          </motion.div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;