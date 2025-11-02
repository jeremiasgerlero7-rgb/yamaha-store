import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { motion } from 'framer-motion';
import { Bike, Truck, Award, Calendar, Sparkles, Grid3x3, List, ChevronRight } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const Models = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoria === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return products.length;
    return products.filter(p => p.categoria === category).length;
  };

  const categoryData = [
    { label: 'Total', category: 'all', icon: Sparkles, color: 'text-yamaha-accent', bgColor: 'bg-yamaha-accent/20' },
    { label: 'Motos', category: 'moto', icon: Bike, color: 'text-yamaha-blue-400', bgColor: 'bg-yamaha-blue-500/20' },
    { label: 'UTV', category: 'utv', icon: Truck, color: 'text-yamaha-accent', bgColor: 'bg-yamaha-accent/20' },
    { label: 'ATV', category: 'atv', icon: Award, color: 'text-yamaha-blue-400', bgColor: 'bg-yamaha-blue-500/20' }
  ];

  return (
    <div className="pt-16 min-h-screen bg-yamaha-dark-900">
      {/* Hero Header Premium */}
      <div className="relative bg-gradient-to-br from-black via-yamaha-dark-900 to-yamaha-blue-900 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Logo YAMAHA de Fondo */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center opacity-5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <span className="text-[120px] sm:text-[180px] md:text-[240px] font-black text-white tracking-widest font-yamaha">
            MODELS
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
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
                Catálogo Completo 2025
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                Nuestros
              </span>
              <br />
              <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                Modelos Premium
              </span>
            </h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-12 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Descubre toda la gama de vehículos diseñados para ofrecerte{' '}
              <span className="text-yamaha-accent font-semibold">la mejor experiencia</span>.
              Calidad, potencia y tecnología japonesa en cada detalle.
            </motion.p>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categoryData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.category}
                    className="group relative bg-yamaha-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yamaha-blue-900/30 hover:border-yamaha-accent/50 transition-all duration-300 overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setSelectedCategory(item.category)}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yamaha-accent/0 to-yamaha-blue-500/0 group-hover:from-yamaha-accent/10 group-hover:to-yamaha-blue-500/10 transition-all duration-500"
                    />
                    
                    <div className="relative">
                      <motion.div
                        className={`inline-block p-3 rounded-xl ${item.bgColor} mb-3`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </motion.div>
                      <div className="text-4xl font-black text-white mb-1 group-hover:text-yamaha-accent transition-colors">
                        {getCategoryCount(item.category)}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter - Sticky */}
      <div className="sticky top-16 z-20 bg-yamaha-dark-900 border-b border-yamaha-blue-900/30 backdrop-blur-lg bg-opacity-95">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        {/* Section Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
                {selectedCategory === 'all' ? 'Colección Completa' : 
                 selectedCategory === 'moto' ? 'Motocicletas Premium' :
                 selectedCategory === 'utv' ? 'Vehículos Utilitarios' : 'Todo Terreno'}
              </h2>
              <div className="flex items-center gap-3">
                <motion.div 
                  className="h-1.5 bg-gradient-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                ></motion.div>
                <p className="text-gray-400 text-lg">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo disponible' : 'modelos disponibles'}
                </p>
              </div>
            </div>  
          </div>
        </motion.div>

        {/* Loading State */}
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
          /* Products Grid */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id} /* ← cambiado a _id para MongoDB */
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

        {/* Empty State */}
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
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No hay vehículos disponibles
            </h3>
            <p className="text-gray-400 text-lg mb-6">
              No encontramos modelos en la categoría{' '}
              <span className="font-semibold text-yamaha-accent">{selectedCategory}</span>
            </p>
            <motion.button 
              onClick={() => setSelectedCategory('all')}
              className="group relative bg-gradient-accent text-black px-8 py-3 rounded-xl font-bold overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver todos los modelos
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA Section Premium */}
      {!loading && filteredProducts.length > 0 && (
        <div className="relative bg-gradient-yamaha-dark py-20 sm:py-24 md:py-32 mt-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,193,7,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-yamaha-accent/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Calendar className="w-16 h-16 text-yamaha-accent mx-auto" />
              </motion.div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                ¿Encontraste tu{' '}
                <span className="bg-clip-text text-transparent bg-gradient-accent">
                  Modelo Ideal
                </span>
                ?
              </h3>
              
              <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
                Agenda una cita con nuestros asesores especializados y descubre todo lo que{' '}
                <span className="text-yamaha-accent font-semibold">Yamaha tiene para ofrecerte</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <motion.button 
                  onClick={() => window.open('https://wa.me/5493541567273?text=Hola,%20me%20interesa%20consultar%20sobre%20los%20vehículos%20Yamaha', '_blank')}
                  className="group relative bg-gradient-accent text-black px-10 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Contactar Asesor
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-yamaha-accent-light"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button 
                  onClick={() => window.location.href = 'quoteinfo'}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-yamaha-accent transition-all duration-300 shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,193,7,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Financiamiento
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Models;