import { motion } from 'framer-motion';


import { 
  CreditCard, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  Award,
  Sparkles,
  ChevronRight,
  Percent,
  Clock,
  FileText
} from 'lucide-react';

const QuoteInfo = () => {
  const financingOptions = [
    {
      icon: CreditCard,
      title: 'Financiación Tradicional',
      description: 'Créditos prendarios con tasas competitivas del mercado',
      features: [
        'Hasta 60 cuotas fijas',
        'Tasa desde 45% anual',
        'Entrega inmediata del vehículo',
        'Sin gastos de otorgamiento'
      ],
      color: 'text-yamaha-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Planes de Ahorro',
      description: 'Sistema de ahorro previo para adjudicación de tu Yamaha',
      features: [
        'Cuotas accesibles y fijas',
        'Sorteos mensuales',
        'Licitaciones disponibles',
        'Sin interés de financiación'
      ],
      color: 'text-yamaha-accent'
    },
    {
      icon: Shield,
      title: 'Leasing',
      description: 'Ideal para empresas y monotributistas con beneficios fiscales',
      features: [
        'Deducción impositiva del 100%',
        'Sin inmovilización de capital',
        'Opción de compra al finalizar',
        'Flexibilidad en plazos'
      ],
      color: 'text-green-400'
    }
  ];

  const requirements = [
    {
      icon: FileText,
      title: 'Documentación Personal',
      items: ['DNI vigente (frente y dorso)', 'Constancia de CUIL/CUIT', 'Últimos 3 recibos de sueldo']
    },
    {
      icon: DollarSign,
      title: 'Información Financiera',
      items: ['Últimos 3 resúmenes bancarios', 'Declaración jurada de ingresos', 'Comprobante de domicilio']
    },
    {
      icon: CheckCircle,
      title: 'Requisitos Generales',
      items: ['Mayor de 21 años', 'Ingresos demostrables', 'Buen historial crediticio']
    }
  ];

  const benefits = [
    { icon: Clock, text: 'Aprobación en 48hs', color: 'text-yamaha-accent' },
    { icon: Percent, text: 'Tasas competitivas', color: 'text-yamaha-blue-400' },
    { icon: Shield, text: 'Proceso 100% seguro', color: 'text-green-400' },
    { icon: Award, text: 'Asesoramiento personalizado', color: 'text-yamaha-accent' }
  ];

  return (
    <div className="pt-16 bg-yamaha-dark-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-yamaha-dark-900 to-yamaha-blue-900 py-20 sm:py-24 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Glowing orbs */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-yamaha-accent/20 rounded-full blur-3xl"
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
                Financiamiento a tu medida
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                Hacé Realidad
              </span>
              <br />
              <span className="text-yamaha-accent drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                Tu Yamaha
              </span>
            </h1>

            <motion.p 
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Múltiples opciones de financiamiento diseñadas para que puedas llevarte tu vehículo hoy mismo
            </motion.p>

            {/* Benefits Pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-yamaha-dark-800/80 backdrop-blur-sm border border-yamaha-blue-900/30 rounded-full px-4 py-2"
                  >
                    <Icon className={`w-4 h-4 ${benefit.color}`} />
                    <span className="text-sm text-gray-300">{benefit.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Financing Options */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Opciones de{' '}
            <span className="bg-clip-text text-transparent bg-gradient-accent">
              Financiamiento
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elegí el plan que mejor se adapte a tus necesidades y presupuesto
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {financingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-yamaha-dark-800 to-yamaha-dark-900 rounded-2xl p-8 border border-yamaha-blue-900/30 shadow-2xl hover:border-yamaha-accent/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
              >
                <motion.div
                  className={`inline-block p-4 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm mb-6 ${option.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>

                <h3 className="text-2xl font-black text-white mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {option.description}
                </p>

                <div className="space-y-3">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yamaha-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Requisitos para{' '}
              <span className="bg-clip-text text-transparent bg-gradient-accent">
                Solicitar Financiamiento
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Documentación necesaria para iniciar tu solicitud
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => {
              const Icon = req.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-yamaha-dark-800 to-yamaha-dark-900 rounded-2xl p-6 border border-yamaha-blue-900/30 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-yamaha-dark-700/50">
                      <Icon className="w-6 h-6 text-yamaha-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{req.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {req.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-400">
                        <span className="text-yamaha-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Important Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yamaha-blue-900/30 to-yamaha-accent/20 border-l-4 border-yamaha-accent rounded-lg p-6 mb-16"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-yamaha-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Información Importante
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Las tasas de interés y condiciones están sujetas a evaluación crediticia. 
                Los plazos y montos pueden variar según la entidad financiera y el modelo de vehículo seleccionado. 
                Consultá con nuestros asesores para obtener una cotización personalizada adaptada a tu situación financiera.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-yamaha-dark-900 via-black to-yamaha-blue-900 py-20 overflow-hidden border-t border-yamaha-blue-900/30">
        <motion.div
          className="absolute top-0 left-1/2 w-96 h-96 bg-yamaha-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 8,
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
            <motion.div
              className="inline-block p-4 rounded-xl bg-yamaha-dark-700/50 backdrop-blur-sm mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Award className="w-8 h-8 text-yamaha-accent" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              ¿Listo para{' '}
              <span className="bg-clip-text text-transparent bg-gradient-accent">
                tu próxima aventura
              </span>
              ?
            </h2>
            
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Explorá nuestra línea completa de vehículos Yamaha y encontrá el modelo perfecto para vos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => window.location.href = '/models'}
                className="group relative bg-gradient-accent text-black px-10 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Ver Modelos Disponibles
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
                onClick={() => window.open('https://wa.me/5493541567273?text=Hola,%20quiero%20información%20sobre%20financiamiento', '_blank')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-yamaha-accent transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,193,7,0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Consultar por WhatsApp
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuoteInfo;