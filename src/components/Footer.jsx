import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Award, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';

const Footer = ({ onOpenLegal, onOpenFAQ }) => {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.instagram.com/jeregerlero_/', label: 'Facebook' },
    { icon: Twitter, href: 'https://www.instagram.com/jeregerlero_/', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/jeregerlero_/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.instagram.com/jeregerlero_/', label: 'Youtube' }
  ];

  const quickLinks = [
    { 
      text: 'Términos y Condiciones', 
      onClick: () => onOpenLegal('terms')
    },
    { 
      text: 'Política de Privacidad', 
      onClick: () => onOpenLegal('privacy')
    },
    { 
      text: 'Preguntas Frecuentes',   
      onClick: () => onOpenFAQ()
    },
    { 
      text: 'Soporte Técnico', 
      href: '/contact' 
    }
  ];

  const features = [
    { icon: Award, text: 'Garantía Oficial' },
    { icon: Zap, text: 'Servicio Rápido' },
    { icon: Shield, text: 'Compra Segura' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-black via-yamaha-dark-900 to-yamaha-dark-800 text-white mt-16 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-yamaha-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-yamaha-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Features Bar */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 pb-12 border-b border-yamaha-blue-900/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex items-center justify-center gap-3 bg-yamaha-dark-800/50 backdrop-blur-sm border border-yamaha-blue-900/30 rounded-xl p-4 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, borderColor: 'rgba(255, 193, 7, 0.5)' }}
              >
                <motion.div
                  className="p-2 rounded-lg bg-yamaha-blue-500/20 text-yamaha-accent"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-gray-300 group-hover:text-yamaha-accent transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/logoYamahaBlanco2.png" 
                alt="Yamaha" 
                className="h-20 mb-6 drop-shadow-[0_0_10px_rgba(255,193,7,0.3)]"
              />
            </motion.div>
            
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Yamaha Motor Corporation - Líder en{' '}
              <span className="text-yamaha-accent font-semibold">innovación y tecnología</span>{' '}
              para vehículos de motor. Descubre nuestra gama completa de 
              productos diseñados para ofrecer el máximo rendimiento.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="p-3 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm border border-yamaha-blue-900/30 text-gray-400 group-hover:text-yamaha-accent group-hover:border-yamaha-accent/50 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-black mb-6 text-white">
              Contacto
              <motion.div 
                className="h-1 w-12 bg-gradient-accent rounded-full mt-2"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
            </h3>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: 'Los Nogales 130\nSan Antonio de Arredondo, Cordoba, Argentina' },
                { icon: Phone, text: '+54 3541-567273' },
                { icon: Mail, text: 'jeremiasgerlero7@gmail.com' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="h-5 w-5 text-yamaha-accent flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors whitespace-pre-line">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-black mb-6 text-white">
              Enlaces Rápidos
              <motion.div 
                className="h-1 w-12 bg-gradient-accent rounded-full mt-2"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                >
                  {link.onClick ? (
                    <motion.button
                      onClick={link.onClick}
                      className="group flex items-center text-gray-400 hover:text-yamaha-accent transition-colors duration-300 text-left w-full"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span
                        className="w-0 h-px bg-yamaha-accent mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"
                      />
                      {link.text}
                    </motion.button>
                  ) : (
                    <motion.a
                      href={link.href}
                      className="group flex items-center text-gray-400 hover:text-yamaha-accent transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span
                        className="w-0 h-px bg-yamaha-accent mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"
                      />
                      {link.text}
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-yamaha-blue-900/30 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.p 
              className="text-gray-400 text-sm text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              © 2024 Jeremias Gerlero. Todos los derechos reservados.
            </motion.p>
            
            <motion.div
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-gray-500">Hecho con</span>
              <motion.span
                className="text-yamaha-accent"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                ❤️
              </motion.span>
              <span className="text-gray-500">para riders</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;