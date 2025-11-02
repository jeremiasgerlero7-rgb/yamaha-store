import { Users, Award, Globe, Zap, Target, Eye, TrendingUp, Shield, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Comprometidos con la más alta calidad en cada producto que fabricamos.',
      color: 'text-yamaha-accent',
      bgColor: 'bg-yamaha-accent/20'
    },
    {
      icon: Zap,
      title: 'Innovación',
      description: 'Constantemente evolucionando para ofrecer la última tecnología.',
      color: 'text-yamaha-blue-400',
      bgColor: 'bg-yamaha-blue-500/20'
    },
    {
      icon: Users,
      title: 'Pasión',
      description: 'Apasionados por crear experiencias de conducción inolvidables.',
      color: 'text-yamaha-accent',
      bgColor: 'bg-yamaha-accent/20'
    },
    {
      icon: Globe,
      title: 'Sostenibilidad',
      description: 'Trabajando por un futuro más limpio y sostenible.',
      color: 'text-yamaha-blue-400',
      bgColor: 'bg-yamaha-blue-500/20'
    }
  ];

  const stats = [
    { number: '60+', label: 'Años de Historia', icon: TrendingUp, color: 'text-yamaha-accent' },
    { number: '180+', label: 'Países', icon: Globe, color: 'text-yamaha-blue-400' },
    { number: '50M+', label: 'Clientes Satisfechos', icon: Users, color: 'text-yamaha-accent' },
    { number: '100%', label: 'Compromiso', icon: Shield, color: 'text-yamaha-blue-400' }
  ];

  const timeline = [
    { year: '1955', event: 'Fundación de Yamaha Motor', highlight: true },
    { year: '1960', event: 'Primera exportación internacional', highlight: false },
    { year: '1980', event: 'Líder en innovación tecnológica', highlight: false },
    { year: '2000', event: 'Expansión global consolidada', highlight: false },
    { year: '2025', event: 'Presente en más de 180 países', highlight: true }
  ];

  return (
    <div className="pt-16 min-h-screen bg-yamaha-dark-900">
      {/* Hero Section Premium */}
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
            ABOUT
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
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 z-10">
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
              <Sparkles className="w-4 h-4 text-yamaha-accent" />
              <span className="text-sm font-medium text-yamaha-blue-100">
                Sobre Nosotros
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                Yamaha
              </span>
              <br />
              <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                Motor Co.
              </span>
            </h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Más de <span className="text-yamaha-accent font-semibold">60 años</span> de innovación y pasión por la{' '}
              <span className="text-yamaha-accent font-semibold">excelencia</span>.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section Premium */}
      <div className="bg-gradient-to-r from-yamaha-dark-800 via-yamaha-dark-900 to-yamaha-dark-800 border-y border-yamaha-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
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
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-yamaha-accent transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        {/* Company History Premium */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 bg-yamaha-blue-500/20 backdrop-blur-sm border border-yamaha-blue-400/30 rounded-full px-4 py-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Calendar className="w-4 h-4 text-yamaha-accent" />
                <span className="text-sm font-medium text-yamaha-blue-100">
                  Historia
                </span>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                Nuestra{' '}
                <span className="text-yamaha-accent">Historia</span>
              </h2>
              
              <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                Fundada en <span className="text-yamaha-accent font-semibold">1955</span>, Yamaha Motor Co., Ltd. ha sido sinónimo de{' '}
                <span className="text-yamaha-accent font-semibold">innovación y calidad</span> en la industria de vehículos de motor.
              </p>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                Desde nuestra primera motocicleta, la YA-1, hemos estado a la vanguardia del diseño y la 
                tecnología. Hoy somos líder global en motocicletas, vehículos marinos, 
                ATV, UTV y mucho más.
              </p>

              {/* Timeline Mini Premium */}
              <div className="space-y-4">
                {timeline.slice(0, 3).map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`${item.highlight ? 'bg-gradient-accent' : 'bg-yamaha-blue-500'} text-black px-4 py-2 rounded-xl font-black text-sm min-w-[70px] text-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.year}
                    </div>
                    <div className="text-gray-300 font-medium">{item.event}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              className="relative h-96 bg-gradient-to-br from-yamaha-blue-600 via-yamaha-blue-700 to-yamaha-dark-800 rounded-2xl overflow-hidden border border-yamaha-blue-900/30"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white p-8">
                  <motion.div 
                    className="text-7xl sm:text-8xl font-black mb-4 text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    1955
                  </motion.div>
                  <div className="text-3xl font-bold mb-2">Fundación</div>
                  <div className="text-yamaha-blue-200">Yamaha Motor Co.</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yamaha-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mission and Vision Premium */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Misión y{' '}
              <span className="text-yamaha-accent">Visión</span>
            </h2>
            <motion.div 
              className="h-1.5 bg-gradient-accent rounded-full mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            ></motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="relative bg-yamaha-dark-800/50 backdrop-blur-sm p-10 rounded-2xl border border-yamaha-blue-900/30 overflow-hidden group hover:border-yamaha-blue-500/50 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yamaha-blue-500/0 to-yamaha-blue-500/0 group-hover:from-yamaha-blue-500/10 group-hover:to-transparent transition-all duration-500"
              />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="bg-yamaha-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yamaha-blue-400/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="h-8 w-8 text-yamaha-blue-400" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white">
                    Nuestra Misión
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Crear productos que ofrezcan <span className="text-yamaha-accent font-semibold">experiencias únicas y emocionantes</span> a 
                  nuestros clientes, superando sus expectativas en calidad, 
                  rendimiento y diseño.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-yamaha-dark-800/50 backdrop-blur-sm p-10 rounded-2xl border border-yamaha-blue-900/30 overflow-hidden group hover:border-yamaha-accent/50 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yamaha-accent/0 to-yamaha-accent/0 group-hover:from-yamaha-accent/10 group-hover:to-transparent transition-all duration-500"
              />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="bg-yamaha-accent/20 backdrop-blur-sm rounded-2xl p-4 border border-yamaha-accent/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Eye className="h-8 w-8 text-yamaha-accent" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white">
                    Nuestra Visión
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Ser la empresa <span className="text-yamaha-accent font-semibold">líder en movilidad</span> y experiencias recreativas, 
                  innovando constantemente para un futuro más emocionante y sostenible.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Values Premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 bg-yamaha-blue-500/20 backdrop-blur-sm border border-yamaha-blue-400/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-4 h-4 text-yamaha-accent" />
              <span className="text-sm font-medium text-yamaha-blue-100">
                Valores Corporativos
              </span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Nuestros{' '}
              <span className="text-yamaha-accent">Valores</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Los pilares fundamentales que guían cada decisión y acción en Yamaha
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={index} 
                  className="relative bg-yamaha-dark-800/50 backdrop-blur-sm p-8 rounded-2xl border border-yamaha-blue-900/30 text-center group hover:border-yamaha-accent/50 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yamaha-accent/0 to-yamaha-blue-500/0 group-hover:from-yamaha-accent/5 group-hover:to-yamaha-blue-500/5 transition-all duration-500"
                  />
                  
                  <div className="relative">
                    <div className="flex justify-center mb-6">
                      <motion.div 
                        className={`${value.bgColor} backdrop-blur-sm rounded-2xl p-4`}
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`h-10 w-10 ${value.color}`} />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-yamaha-accent transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* CTA Section Premium */}
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
              <Sparkles className="w-16 h-16 text-yamaha-accent mx-auto" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Únete a la{' '}
              <span className="bg-clip-text text-transparent bg-gradient-accent">
                Familia Yamaha
              </span>
            </h2>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
              Descubre por qué <span className="text-yamaha-accent font-semibold">millones de personas</span> en todo el mundo confían en{' '}
              <span className="text-yamaha-accent font-semibold">Yamaha</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
  <motion.button 
    onClick={() => window.location.href = '/models'}
    className="group relative bg-gradient-accent text-black px-10 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-2xl"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      Ver Modelos
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
    onClick={() => window.location.href = '/contact'}
    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-yamaha-accent transition-all duration-300 shadow-xl"
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,193,7,0.4)" }}
    whileTap={{ scale: 0.95 }}
  >
    Contactar
  </motion.button>
</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;