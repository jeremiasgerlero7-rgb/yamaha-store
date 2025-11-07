import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { motion } from 'framer-motion';
import { ChevronDown, Award, Users, Clock, Headphones, Camera, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const API_URL = `${import.meta.env.VITE_API_URL}/products`;

// ⭐ NUEVO: Notificación de bienvenida
const WelcomeNotification = ({ user, onClose, onUploadPhoto }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Solo mostrar si NO es usuario de Google y tiene la marca en localStorage
    const shouldShow = localStorage.getItem('showWelcomeNotification');
    if (user.isGoogleAuth || !shouldShow) {
      setShow(false);
    }
  }, [user]);

  if (!show) return null;

  const handleClose = () => {
    setShow(false);
    localStorage.removeItem('showWelcomeNotification');
    onClose?.();
  };

  return (
    <div className="fixed top-20 right-4 max-w-md bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-6 z-50 animate-slideIn">
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Camera className="text-blue-600" size={24} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user.name}! 👋
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Como no iniciaste sesión con Google, tienes una foto de perfil predeterminada.
            Pero no te preocupes, <strong>puedes personalizarla cuando quieras</strong>.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                handleClose();
                onUploadPhoto?.();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Upload size={16} />
              Subir foto ahora
            </button>

            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
            >
              Más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchProducts();

    // Verificar si debe mostrar la notificación de bienvenida
    const shouldShowWelcome = localStorage.getItem('showWelcomeNotification');
    if (shouldShowWelcome === 'true' && currentUser && !currentUser.isGoogleAuth) {
      setShowWelcome(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoria === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Intentando obtener productos de:', API_URL);
      const res = await fetch(API_URL);

      console.log('📡 Respuesta recibida, status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('📦 Productos recibidos:', data);
      console.log('📊 Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('📏 Cantidad de productos:', data.length);

      if (Array.isArray(data)) {
        setProducts(data);
        console.log('✅ Productos seteados correctamente');
      } else {
        console.error('❌ Los datos NO son un array:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log('🏁 Loading finalizado');
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadPhoto = () => {
    // TODO: Implementar modal para subir foto
    toast.info('Función de subir foto próximamente');
    setShowProfileModal(true);
  };

  return (
    <div className="pt-16 bg-yamaha-dark-900">
      {/* ⭐ NOTIFICACIÓN DE BIENVENIDA */}
      {showWelcome && currentUser && (
        <WelcomeNotification
          user={currentUser}
          onClose={() => setShowWelcome(false)}
          onUploadPhoto={handleUploadPhoto}
        />
      )}

      {/* Hero Banner Premium */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] bg-gradient-to-br from-black via-yamaha-dark-900 to-yamaha-blue-900 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Logo YAMAHA de Fondo con Animación */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <span className="text-[100px] sm:text-[150px] md:text-[200px] lg:text-[280px] font-black text-white tracking-widest font-yamaha">
            YAMAHA
          </span>
        </motion.div>

        {/* Elementos decorativos con glow */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-yamaha-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-yamaha-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center z-10">
          <motion.div
            className="text-white w-full max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge Superior */}
            <motion.div
              className="inline-flex items-center gap-2 bg-yamaha-blue-500/20 backdrop-blur-sm border border-yamaha-blue-400/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Award className="w-4 h-4 text-yamaha-accent" />
              <span className="text-sm font-medium text-yamaha-blue-100">
                Concesionario Oficial Yamaha
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                  Experimenta la
                </span>
                <br />
                <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                  Excelencia en Movimiento
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 text-gray-300 leading-relaxed max-w-2xl font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Descubre vehículos que combinan{' '}
              <span className="text-yamaha-accent font-semibold">ingeniería japonesa</span>,{' '}
              tecnología de vanguardia y diseño excepcional.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                onClick={scrollToProducts}
                className="group relative bg-gradient-accent text-black px-8 py-4 rounded-xl font-bold overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explorar Vehículos
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-yamaha-accent-light"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar Premium */}
      <div className="bg-gradient-to-r from-yamaha-dark-800 via-yamaha-dark-900 to-yamaha-dark-800 border-y border-yamaha-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Award, number: '50+', label: 'Modelos Disponibles', color: 'text-yamaha-accent' },
              { icon: Users, number: '1000+', label: 'Clientes Satisfechos', color: 'text-yamaha-blue-400' },
              { icon: Clock, number: '15', label: 'Años de Experiencia', color: 'text-yamaha-accent' },
              { icon: Headphones, number: '24/7', label: 'Soporte Técnico', color: 'text-yamaha-blue-400' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`inline-block p-3 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm mb-3 ${stat.color}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-yamaha-accent transition-colors">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-yamaha-dark-900 top-16 z-10 backdrop-blur-lg bg-opacity-95">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Línea decorativa centrada */}
        <div className="flex justify-center pb-6">
          <motion.div
            className="relative h-1 w-64 bg-gradient-to-r from-transparent via-yamaha-accent to-transparent rounded-full shadow-[0_0 _15px_rgba(255,193,7,0.5)]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Puntos decorativos en los extremos */}
            <motion.div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yamaha-accent rounded-full shadow-[0_0_10px_rgba(255,193,7,0.8)]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yamaha-accent rounded-full shadow-[0_0_10px_rgba(255,193,7,0.8)]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Brillo central */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yamaha-accent rounded-full blur-sm"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div id="products-section" className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        {/* Header de sección */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              {selectedCategory === 'all' ? 'Colección Completa' :
                selectedCategory === 'moto' ? 'Motocicletas Premium' :
                  selectedCategory === 'utv' ? 'Vehículos Utilitarios' : 'Todo Terreno'}
            </h2>
            <motion.div
              className="h-1.5 bg-gradient-accent rounded-full mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            ></motion.div>
          </motion.div>
          <motion.p
            className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Cada vehículo es una obra maestra de ingeniería
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="animate-pulse"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-yamaha-dark-800 h-72 rounded-2xl mb-4"></div>
                <div className="h-6 bg-yamaha-dark-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-yamaha-dark-800 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-yamaha-dark-800 rounded w-2/3"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-20 bg-yamaha-dark-800 rounded-2xl border border-yamaha-blue-900/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-7xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🏍️
            </motion.div>
            <p className="text-gray-400 text-xl font-semibold mb-2">
              No hay vehículos disponibles
            </p>
            <p className="text-gray-500 text-sm">
              en la categoría {selectedCategory}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;