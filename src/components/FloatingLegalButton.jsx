import { useEffect, useState } from 'react';
import { AlertCircle, X, FileText, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingLegalButton = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (activeSection && isOpen) {
      setIsExpanded(false);
    }
  }, [activeSection, isOpen]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      if (onSectionChange) onSectionChange(null);
    }
  };

  const showSection = (section) => {
    if (onSectionChange) onSectionChange(section);
  };

  const closeSection = () => {
    if (onSectionChange) onSectionChange(null);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Botón flotante principal */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              onClick={toggleExpand}
              className="group relative w-14 h-14 bg-gradient-accent rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              initial={{ rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
            >
              <AlertCircle className="w-7 h-7 text-black" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-yamaha-accent/30 blur-xl animate-pulse" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-yamaha-dark-800/95 backdrop-blur-xl border-2 border-yamaha-blue-900/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-yamaha-blue-900/30 bg-yamaha-dark-700/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Información Legal</h3>
                <button
                  onClick={toggleExpand}
                  className="p-1.5 rounded-lg hover:bg-yamaha-dark-600/50 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Opciones */}
              <div className="p-2 space-y-2 min-w-[280px]">
                <motion.button
                  onClick={() => showSection('terms')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-yamaha-dark-700/30 hover:bg-yamaha-dark-700/60 transition-all text-left group"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 rounded-lg bg-yamaha-blue-500/20 group-hover:bg-yamaha-accent/20 transition-colors">
                    <FileText className="w-5 h-5 text-yamaha-blue-400 group-hover:text-yamaha-accent transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Términos y Condiciones</p>
                    <p className="text-xs text-gray-500">Reglas de uso del sitio</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => showSection('privacy')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-yamaha-dark-700/30 hover:bg-yamaha-dark-700/60 transition-all text-left group"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 rounded-lg bg-yamaha-blue-500/20 group-hover:bg-yamaha-accent/20 transition-colors">
                    <Shield className="w-5 h-5 text-yamaha-blue-400 group-hover:text-yamaha-accent transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Políticas de Privacidad</p>
                    <p className="text-xs text-gray-500">Manejo de datos personales</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal de contenido - RESPONSIVE FIX */}
      <AnimatePresence>
        {activeSection && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSection}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal - Ahora 100% responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-4 md:inset-y-8 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-yamaha-dark-900/95 backdrop-blur-xl border-2 border-yamaha-blue-900/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header del modal */}
              <div className="p-4 md:p-6 border-b border-yamaha-blue-900/30 bg-yamaha-dark-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  {activeSection === 'terms' ? (
                    <>
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-yamaha-accent" />
                      <h2 className="text-lg md:text-2xl font-black text-white">Términos y Condiciones</h2>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-yamaha-accent" />
                      <h2 className="text-lg md:text-2xl font-black text-white">Políticas de Privacidad</h2>
                    </>
                  )}
                </div>
                <button
                  onClick={closeSection}
                  className="p-2 rounded-lg hover:bg-yamaha-dark-700/50 transition-colors text-gray-400 hover:text-white flex-shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {activeSection === 'terms' ? (
                  <>
                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">1. Aceptación de los Términos</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Al acceder y utilizar este sitio web de Yamaha Motor Argentina, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">2. Uso del Sitio</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-2 md:mb-3">
                        Este sitio es proporcionado únicamente para fines informativos y comerciales relacionados con los productos Yamaha. Usted se compromete a:
                      </p>
                      <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-1 md:space-y-2 ml-2 md:ml-4">
                        <li>Utilizar el sitio únicamente con fines legales y legítimos</li>
                        <li>No violar ninguna ley local, nacional o internacional</li>
                        <li>No interferir con la seguridad del sitio</li>
                        <li>No transmitir contenido malicioso o dañino</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">3. Propiedad Intelectual</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Todo el contenido de este sitio, incluyendo pero no limitado a textos, gráficos, logos, íconos, imágenes y software, es propiedad de Yamaha Motor Corporation y está protegido por las leyes de derechos de autor y marcas registradas.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">4. Cotizaciones y Compras</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Las cotizaciones realizadas a través de este sitio son indicativas y están sujetas a confirmación. Los precios finales pueden variar según disponibilidad, promociones vigentes y condiciones específicas de cada concesionario autorizado.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">5. Limitación de Responsabilidad</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Yamaha no se hace responsable por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar este sitio web, incluso si Yamaha ha sido advertida de la posibilidad de tales daños.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">6. Modificaciones</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Yamaha se reserva el derecho de modificar estos términos y condiciones en cualquier momento. El uso continuado del sitio después de dichas modificaciones constituye su aceptación de los nuevos términos.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">1. Recopilación de Información</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-2 md:mb-3">
                        Yamaha Motor Argentina recopila información personal cuando usted:
                      </p>
                      <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-1 md:space-y-2 ml-2 md:ml-4">
                        <li>Se registra en nuestro sitio web</li>
                        <li>Solicita cotizaciones de productos</li>
                        <li>Se suscribe a nuestro boletín informativo</li>
                        <li>Participa en encuestas o promociones</li>
                        <li>Se comunica con nuestro servicio al cliente</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">2. Uso de la Información</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-2 md:mb-3">
                        La información recopilada se utiliza para:
                      </p>
                      <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-1 md:space-y-2 ml-2 md:ml-4">
                        <li>Procesar y gestionar sus cotizaciones y pedidos</li>
                        <li>Mejorar nuestros productos y servicios</li>
                        <li>Personalizar su experiencia en nuestro sitio</li>
                        <li>Enviar información sobre productos y promociones (con su consentimiento)</li>
                        <li>Responder a sus consultas y proporcionar soporte</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">3. Protección de Datos</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Implementamos medidas de seguridad apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye revisiones internas de nuestras prácticas de recopilación, almacenamiento y procesamiento de datos.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">4. Compartir Información</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para cumplir con la ley, hacer cumplir nuestras políticas del sitio, o proteger nuestros derechos, propiedad o seguridad.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">5. Cookies</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Utilizamos cookies para mejorar su experiencia de navegación. Las cookies son pequeños archivos que el sitio o su proveedor de servicios transfiere al disco duro de su computadora a través de su navegador web, permitiendo que los sistemas reconozcan su navegador y capturen cierta información.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">6. Sus Derechos</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-2 md:mb-3">
                        Usted tiene derecho a:
                      </p>
                      <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-1 md:space-y-2 ml-2 md:ml-4">
                        <li>Acceder a su información personal</li>
                        <li>Corregir datos inexactos</li>
                        <li>Solicitar la eliminación de sus datos</li>
                        <li>Oponerse al procesamiento de sus datos</li>
                        <li>Retirar su consentimiento en cualquier momento</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-yamaha-accent mb-2 md:mb-3">7. Contacto</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Si tiene preguntas sobre esta política de privacidad, puede contactarnos en: jeremiasgerlero7@gmail.com o llamando al +54 3541-567273.
                      </p>
                    </section>
                  </>
                )}
              </div>

              {/* Footer del modal */}
              <div className="p-3 md:p-4 border-t border-yamaha-blue-900/30 bg-yamaha-dark-800/50 text-center">
                <p className="text-xs md:text-sm text-gray-500">
                  Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingLegalButton;