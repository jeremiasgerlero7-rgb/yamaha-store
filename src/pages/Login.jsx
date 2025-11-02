import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Award, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      toast.success('¡Inicio de sesión exitoso!');

      setTimeout(() => {
        // Redirigir según rol
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Manejar login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('🟢 1. Google credential response:', credentialResponse);
    setLoading(true);
    setError('');

    try {
      //console.log('🟢 2. Llamando loginWithGoogle...');
      const data = await loginWithGoogle(credentialResponse.credential);

      toast.success(`¡Bienvenido ${data.user.name}!`);

      //console.log('🟢 4. Redirigiendo a:', data.user.role === 'admin' ? '/admin' : '/');

      // Usar window.location en lugar de navigate
      const destination = data.user.role === 'admin' ? '/admin' : '/';
      window.location.href = destination;

    } catch (error) {
      //console.error('❌ Error en handleGoogleSuccess:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      //console.log('🟢 5. Finalizando, setLoading(false)');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Error de Google OAuth');
    setError('Error al iniciar sesión con Google. Intenta nuevamente.');
    toast.error('Error al iniciar sesión con Google');
  };

  return (
    <div className="pt-16 min-h-screen bg-yamaha-dark-900 relative overflow-hidden">
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
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <span className="text-[150px] sm:text-[200px] md:text-[280px] font-black text-white tracking-widest font-yamaha">
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

      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yamaha-blue-500/20 to-yamaha-accent/20 backdrop-blur-sm border-2 border-yamaha-accent/30 rounded-2xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
            >
              <Award className="w-10 h-10 text-yamaha-accent" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                Inicia
              </span>
              <br />
              <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                Sesión
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Ingresa tus credenciales para acceder al sistema
            </motion.p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            className="bg-yamaha-dark-800/50 backdrop-blur-xl border-2 border-yamaha-blue-900/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Glow effect inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yamaha-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yamaha-blue-500/10 rounded-full blur-3xl"></div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Error al iniciar sesión</p>
                  <p className="text-red-200/80">{error}</p>
                </div>
              </motion.div>
            )}

            {/* ⭐ Botón de Google */}
            <div className="mb-6 relative z-10">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yamaha-blue-900/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-yamaha-dark-800/80 px-3 py-1 text-gray-500 rounded-full">
                  O continúa con email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-yamaha-accent" />
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full px-5 py-4 bg-yamaha-dark-700/50 backdrop-blur-sm border-2 border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent focus:ring-2 focus:ring-yamaha-accent/20 transition-all duration-300"
                    placeholder="tumail@gmail.com"
                    required
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-yamaha-accent/0 group-hover:border-yamaha-accent/20 rounded-xl pointer-events-none transition-colors duration-300"
                  ></motion.div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yamaha-accent" />
                  Contraseña
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full px-5 py-4 bg-yamaha-dark-700/50 backdrop-blur-sm border-2 border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent focus:ring-2 focus:ring-yamaha-accent/20 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yamaha-accent transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <motion.div
                    className="absolute inset-0 border-2 border-yamaha-accent/0 group-hover:border-yamaha-accent/20 rounded-xl pointer-events-none transition-colors duration-300"
                  ></motion.div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-accent text-black px-8 py-4 rounded-xl font-bold text-lg overflow-hidden shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-3 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-yamaha-accent-light"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>

              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <span className="text-sm text-gray-400">¿No tenés cuenta?</span>{' '}
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-sm text-yamaha-accent hover:underline transition-colors duration-300"
                >
                  Crear cuenta
                </Link>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yamaha-blue-900/30"></div>
              </div>
            </div>

            {/* Back to Home Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yamaha-accent transition-colors duration-300 group"
              >
                <motion.span
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                >
                  ←
                </motion.span>
                Volver al Sitio Principal
              </Link>
            </motion.div>
          </motion.div>

          {/* Security Note */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Conexión segura y cifrada SSL</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;