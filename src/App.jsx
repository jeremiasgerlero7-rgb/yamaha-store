import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from './pages/Home';
import Models from './pages/Models';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import Quote from './pages/Quote';
import QuoteInfo from './pages/QuoteInfo';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import FloatingLegalButton from './components/FloatingLegalButton';
import FAQPanel from './components/FAQPanel'; 
import Profile from './pages/Profile';
import { useNetwork } from './hooks/useNetwork';
import { WifiOff, AlertTriangle } from 'lucide-react';
import GestionVentas from './pages/GestionVentas';

// Banner de estado de red
const NetworkBanner = ({ online, isSlowConnection }) => {
  if (online && !isSlowConnection) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      !online ? 'bg-red-600' : 'bg-yellow-600'
    } text-white px-4 py-2 text-center text-xs sm:text-sm shadow-lg animate-slideDown`}>
      <div className="flex items-center justify-center space-x-2">
        {!online ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="font-medium">Sin conexión - Mostrando contenido guardado</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Conexión lenta detectada - Optimizando contenido</span>
          </>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const { online, isSlowConnection } = useNetwork();
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState(null);

  const handleOpenLegal = (section) => {
    setLegalSection(section);
    setIsLegalOpen(true);
  };

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" />
      
      {/* Banner de estado de red */}
      <NetworkBanner online={online} isSlowConnection={isSlowConnection} />
      
      <div className={`min-h-screen flex flex-col ${(!online || isSlowConnection) ? 'pt-10' : ''}`}>
        <Navbar 
          isFAQOpen={isFAQOpen} 
          setIsFAQOpen={setIsFAQOpen} 
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cotizar/:id" element={<Quote />} />
            <Route path="/quoteinfo" element={<QuoteInfo />} />
            <Route path="/profile" element={<Profile />} />
             <Route 
              path="/gestionventas" 
              element={
                <ProtectedRoute>
                  <GestionVentas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer 
          onOpenFAQ={() => setIsFAQOpen(true)}
          onOpenLegal={handleOpenLegal}
        />
        <FloatingLegalButton 
          isOpen={isLegalOpen}
          onClose={() => setIsLegalOpen(false)}
          activeSection={legalSection}
          onSectionChange={setLegalSection}
        />

        <FAQPanel isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      </div>
    </>
  );
}

function App() {
  console.log('Origen actual:', window.location.origin);

  // 🔥 REGISTRAR SERVICE WORKER
  useEffect(() => {
    // Solo registrar en producción (no en desarrollo)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('✅ Service Worker registrado exitosamente:', registration.scope);
            
            // Verificar actualizaciones del SW
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              console.log('🔄 Nueva versión del Service Worker encontrada');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✨ Actualización disponible. Recarga la página para ver los cambios.');
                  // Opcional: Mostrar notificación al usuario
                  if (confirm('Nueva versión disponible. ¿Recargar ahora?')) {
                    window.location.reload();
                  }
                }
              });
            });
          })
          .catch((error) => {
            console.error('❌ Error al registrar Service Worker:', error);
          });
      });

      // Manejar cambios de controlador (nueva versión activa)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;