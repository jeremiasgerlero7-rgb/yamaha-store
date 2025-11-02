import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Configuración de EmailJS
    const serviceId = 'service_8u5ybof'; 
    const templateId = 'template_2kmstk8';
    const publicKey = 'nR8-UgYy3-6SXxWr-'; 

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast.success('¡Mensaje enviado exitosamente! Te responderemos pronto.', {
        duration: 5000,
        icon: '✅',
      });

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error al enviar email:', error);
      toast.error('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Los Nogales 130, San Antonio de Arredondo, Córdoba, Argentina',
      color: 'text-yamaha-accent'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+54 (3541) 567273',
      color: 'text-yamaha-blue-400'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'jeremiasgerlero7@gmail.com',
      color: 'text-yamaha-accent'
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun-Vie: 9:00-18:00\nSáb: 9:00-14:00',
      color: 'text-yamaha-blue-400'
    }
  ];

  return (
    <div className="pt-16 bg-yamaha-dark-900">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-yamaha-dark-900 to-yamaha-blue-900 py-20 sm:py-24 md:py-32 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Glowing orbs */}
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
        />
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
        />

        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-yamaha-blue-500/20 backdrop-blur-sm border border-yamaha-blue-400/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-yamaha-accent" />
              <span className="text-sm font-medium text-yamaha-blue-100">
                Estamos aquí para ayudarte
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                Conecta con
              </span>
              <br />
              <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                Nuestro Equipo
              </span>
            </h1>

            <motion.p 
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Expertos en vehículos Yamaha listos para asesorarte en tu próxima aventura
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-yamaha-dark-800 to-yamaha-dark-900 rounded-2xl p-8 border border-yamaha-blue-900/30 shadow-2xl">
              {/* Form Header */}
              <div className="mb-8">
                <motion.div
                  className="inline-block p-3 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Send className="w-6 h-6 text-yamaha-accent" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-2">
                  Envíanos un mensaje
                </h2>
                <p className="text-gray-400">
                  Completa el formulario y nos pondremos en contacto contigo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-yamaha-blue-200 mb-2 uppercase tracking-wide">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-yamaha-dark-700/50 border border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yamaha-accent focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-yamaha-blue-200 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-yamaha-dark-700/50 border border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yamaha-accent focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-yamaha-blue-200 mb-2 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-yamaha-dark-700/50 border border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yamaha-accent focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="+54 (3451) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-yamaha-blue-200 mb-2 uppercase tracking-wide">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-yamaha-dark-700/50 border border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yamaha-accent focus:border-transparent transition-all backdrop-blur-sm resize-none"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    disabled={isSubmitting}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-gradient-accent text-black py-4 rounded-xl font-bold text-lg overflow-hidden shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {!isSubmitting && (
                    <motion.div
                      className="absolute inset-0 bg-yamaha-accent-light"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div>
              <div className="mb-8">
                <motion.div
                  className="inline-block p-3 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-6 h-6 text-yamaha-blue-400" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-2">
                  Información de contacto
                </h2>
                <p className="text-gray-400">
                  Visítanos o contáctanos por cualquiera de estos medios
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      className="group bg-gradient-to-br from-yamaha-dark-800 to-yamaha-dark-900 rounded-2xl p-6 border border-yamaha-blue-900/30 shadow-xl hover:border-yamaha-accent/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`p-3 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm ${info.color}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1 text-lg group-hover:text-yamaha-accent transition-colors">
                            {info.title}
                          </h3>
                          <p className="text-gray-400 whitespace-pre-line leading-relaxed">
                            {info.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-yamaha-blue-900/30 shadow-2xl"
            >
              <div className="relative h-64 sm:h-80 md:h-96">
                 {/* Google Maps Embed */}
                  <iframe
                    title="Ubicación Yamaha"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.440527700825!2d-64.53462379999999!3d-31.484572999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d6803b2d95f15%3A0xd2474ecf8b45f3b4!2sLos%20Nogales%20130%2C%20X5153%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1761568288002!5m2!1ses-419!2sar"
                   height="100%"
                   width="100%"
                   style={{ border: 0 }}
                   allowFullScreen=""
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   className="w-full h-full"> 
                 </iframe>

                {/* Overlay con info (opcional) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yamaha-dark-900/95 to-transparent p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-white">
                   <div className="p-2 bg-yamaha-accent/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-yamaha-accent" />
                  </div>
                  <div>
                    <p className="font-bold">Concesionario Yamaha</p>
                    <p className="text-sm text-gray-300">San Antonio de Arredondo, Córdoba</p>
                </div>
             </div>
           </div>
          </div>
        </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-yamaha-dark py-20 overflow-hidden border-t border-yamaha-blue-900/30">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              ¿Prefieres{' '}
              <span className="bg-clip-text text-transparent bg-gradient-accent">
                visitarnos en persona
              </span>
              ?
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Visita nuestro showroom y conoce toda la línea de vehículos Yamaha
            </p>
            
            <motion.button 
              onClick={() => window.open('https://www.google.com/maps/place/Los+Nogales+130,+X5153+C%C3%B3rdoba/@-31.4845730,-64.5346238,17z', '_blank')}
              className="group relative bg-gradient-accent text-black px-10 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Ver ubicación en el mapa</span>
              <motion.div
                className="absolute inset-0 bg-yamaha-accent-light"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;