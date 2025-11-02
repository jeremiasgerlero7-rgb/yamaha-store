// hooks/useNetwork.js
import { useState, useEffect } from 'react';

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    effectiveType: null,
    downlink: null,
    saveData: false
  });

  useEffect(() => {
    // Detectar si está online/offline
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, online: false }));
    };

    // Detectar calidad de conexión
    const updateNetworkStatus = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        setNetworkStatus(prev => ({
          ...prev,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          saveData: connection.saveData
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      connection.addEventListener('change', updateNetworkStatus);
      updateNetworkStatus();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return {
    ...networkStatus,
    isSlowConnection: networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g',
    isFastConnection: networkStatus.effectiveType === '4g'
  };
};