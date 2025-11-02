import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Home, Car, Info, Mail, Shield, Sparkles, ChevronDown, MessageCircle, Camera } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FAQPanel from './FAQPanel';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavClick = (e, to) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.location.reload();
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/models', label: 'Modelos', icon: Car },
    { to: '/about', label: 'Nosotros', icon: Info },
    { to: '/contact', label: 'Contáctanos', icon: Mail }
  ];

  return (
    <>
      <motion.nav
        className="fixed w-full top-0 z-50 bg-yamaha-dark-900/95 backdrop-blur-lg border-b border-yamaha-blue-900/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yamaha-accent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center py-2 group">
                <motion.img
                  src="/logoYamahaBlanco2.png"
                  alt="Yamaha"
                  className="h-16 w-auto transition-all duration-300"
                  whileHover={{
                    filter: "drop-shadow(0 0 12px rgba(255,193,7,0.6)) drop-shadow(0 0 20px rgba(255,193,7,0.3))",
                    scale: 1.02
                  }}
                />
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      location.pathname === link.to
                        ? 'bg-yamaha-blue text-white'
                        : 'text-gray-300 hover:text-white hover:bg-yamaha-dark-800/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Botón FAQ */}
              <motion.button
                onClick={() => setIsFAQOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-yamaha-dark-800/50 transition relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>FAQ</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yamaha-accent rounded-full animate-pulse"></div>
              </motion.button>

              {currentUser ? (
                <div className="flex items-center space-x-3 ml-4">
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-yamaha-dark-800/50 border border-yamaha-blue-900/30 hover:border-yamaha-accent/30 transition-all group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* ⭐ CAMBIO: Usar profilePicture en lugar de photoURL */}
                      <div className="relative">
                        {currentUser.profilePicture ? (
                          <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-full border-2 border-yamaha-accent/50 object-cover"
                            onError={(e) => {
                              // Fallback si la imagen falla
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center text-black font-bold text-sm border-2 border-yamaha-accent/50"
                          style={{ display: currentUser.profilePicture ? 'none' : 'flex' }}
                        >
                          {getInitials(currentUser.name)}
                        </div>
                        {/* Badge si NO tiene foto personalizada y es usuario local */}
                        {!currentUser.hasCustomAvatar && currentUser.provider === 'local' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-yamaha-dark-900 flex items-center justify-center">
                            <Camera className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-white leading-tight">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-yamaha-accent" />
                          {currentUser.role === 'admin' ? 'Admin' : 'Usuario'}
                        </p>
                      </div>

                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowUserMenu(false)}
                          />
                          
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-yamaha-dark-800/95 backdrop-blur-xl border border-yamaha-blue-900/30 rounded-xl shadow-2xl overflow-hidden z-20"
                          >
                            <div className="px-4 py-3 border-b border-yamaha-blue-900/30 bg-yamaha-dark-700/50">
                              <p className="text-xs text-gray-400">Sesión iniciada como</p>
                              <p className="text-sm text-white font-semibold truncate">{currentUser.email}</p>
                              {currentUser.provider === 'google' && (
                                <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                  Cuenta de Google
                                </p>
                              )}
                            </div>

                            <div className="py-2">
                              {/* ⭐ NUEVO: Opción para cambiar foto de perfil */}
                              <button
                                onClick={() => {
                                  setShowUserMenu(false);
                                  navigate('/profile');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-yamaha-dark-700/50 hover:text-yamaha-accent transition-colors"
                              >
                                <Camera className="w-5 h-5" />
                                <div className="text-left flex-1">
                                  <span className="font-medium block">Mi Perfil</span>
                                  <span className="text-xs text-gray-500">Cambiar foto y más</span>
                                </div>
                              </button>

                              {currentUser.role === 'admin' && (
                                <Link
                                  to="/admin"
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-yamaha-dark-700/50 hover:text-yamaha-accent transition-colors"
                                >
                                  <Shield className="w-5 h-5" />
                                  <span className="font-medium">Panel Admin</span>
                                </Link>
                              )}

                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Cerrar Sesión</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-accent text-black px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-yamaha-accent-light transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Botón FAQ Mobile */}
              <motion.button
                onClick={() => setIsFAQOpen(true)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="h-6 w-6" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-yamaha-accent rounded-full animate-pulse"></div>
              </motion.button>

              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className="fixed top-20 left-0 right-0 z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-yamaha-dark-900/98 backdrop-blur-xl border-b border-yamaha-blue-900/30 shadow-2xl">
                <div className="px-4 py-6 space-y-2">
                  {currentUser && (
                    <motion.div
                      className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-yamaha-dark-800/50 border border-yamaha-blue-900/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {/* ⭐ CAMBIO: Usar profilePicture */}
                      <div className="relative">
                        {currentUser.profilePicture ? (
                          <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name}
                            className="w-12 h-12 rounded-full border-2 border-yamaha-accent/50 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-black font-bold text-lg border-2 border-yamaha-accent/50"
                          style={{ display: currentUser.profilePicture ? 'none' : 'flex' }}
                        >
                          {getInitials(currentUser.name)}
                        </div>
                        {!currentUser.hasCustomAvatar && currentUser.provider === 'local' && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-yamaha-dark-900 flex items-center justify-center">
                            <Camera className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                        <p className="text-xs text-gray-400">{currentUser.email}</p>
                      </div>
                    </motion.div>
                  )}

                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.to}
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-yamaha-dark-800/50 transition-all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="p-2 rounded-lg bg-yamaha-dark-700/50 group-hover:bg-yamaha-blue-500/20 transition-colors">
                            <Icon className="w-5 h-5 text-yamaha-blue-400 group-hover:text-yamaha-accent transition-colors" />
                          </div>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-yamaha-blue-900/50 to-transparent my-4"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4 }}
                  />

                  {currentUser ? (
                    <>
                      {/* ⭐ NUEVO: Botón Mi Perfil en mobile */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-yamaha-accent hover:bg-yamaha-dark-800/50 transition-all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="p-2 rounded-lg bg-yamaha-dark-700/50">
                            <Camera className="w-5 h-5 text-yamaha-blue-400" />
                          </div>
                          <span className="font-medium">Mi Perfil</span>
                        </Link>
                      </motion.div>

                      {currentUser.role === 'admin' && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-accent text-black font-bold shadow-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Shield className="w-5 h-5" />
                            <span>Panel Admin</span>
                          </Link>
                        </motion.div>
                      )}

                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="p-2 rounded-lg bg-yamaha-dark-700/50">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Cerrar Sesión</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-accent text-black font-bold shadow-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Iniciar Sesión</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAQ Panel */}
      <FAQPanel isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </>
  );
};

export default Navbar;