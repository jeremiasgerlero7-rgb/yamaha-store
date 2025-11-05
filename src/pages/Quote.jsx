import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Check } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;
const WHATSAPP_NUMBER = '5493541567273'; // Formato internacional

const Quote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    parteDePago: false,
    financiacion: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Producto no encontrado');
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el producto');
      navigate('/models');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.telefono) {
      alert('Por favor completa tu nombre y teléfono');
      return;
    }

    // Guardar lead en la base de datos
    try {
      const response = await fetch('https://yamaha-store-backend.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: '', // No tienes apellido en el formulario, envío vacío
          email: formData.email || '',
          telefono: formData.telefono,
          vehiculo: product.nombre, // El nombre del producto
          mensaje: formData.mensaje || ''
        })
      });

      if (!response.ok) {
        console.error('Error al guardar el lead');
      }
    } catch (error) {
      console.error('Error al guardar lead:', error);
      // No detenemos el flujo, el usuario puede continuar a WhatsApp
    }

    // Construir mensaje para WhatsApp (MANTIENE FUNCIONALIDAD ORIGINAL)
    let mensaje = `Hola! Me interesa cotizar:\n\n`;
    mensaje += `*${product.nombre}*\n`;
    mensaje += `Precio: $${product.precio.toLocaleString()}\n\n`;
    mensaje += `*Mis datos:*\n`;
    mensaje += `Nombre: ${formData.nombre}\n`;
    mensaje += `Teléfono: ${formData.telefono}\n`;
    if (formData.email) mensaje += `Email: ${formData.email}\n`;
    if (formData.parteDePago) mensaje += `\n✅ Tengo moto para dar en parte de pago\n`;
    if (formData.financiacion) mensaje += `✅ Me interesa financiación\n`;
    if (formData.mensaje) mensaje += `\n Mensaje: ${formData.mensaje}\n`;

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Mostrar confirmación
    alert('¡Te estamos redirigiendo a WhatsApp! 📱');
  };

  const handleWhatsAppDirect = () => {
    const mensaje = `Hola! Me interesa el ${product.nombre} por $${product.precio.toLocaleString()}`;
    const encodedMessage = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base">Cargando...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header - RESPONSIVE */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Volver</span>
        </button>

        {/* Grid Principal - RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Columna Izquierda - Producto */}
          <div className="space-y-4 sm:space-y-6">
            {/* Imagen del Producto */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>

            {/* Información del Producto */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {product.nombre}
              </h1>
              
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-yamaha-blue">
                  ${product.precio.toLocaleString()}
                </span>
              </div>

              {/* Especificaciones */}
              <div className="space-y-3 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Especificaciones
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs sm:text-sm text-gray-600">Cilindrada</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {product.cilindrada} cc
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs sm:text-sm text-gray-600">Velocidad Máx.</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {product.velocidadMax} km/h
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs sm:text-sm text-gray-600">Peso</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {product.peso} kg
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs sm:text-sm text-gray-600">Categoría</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base capitalize">
                      {product.categoria}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  {product.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario y Contacto */}
          <div className="space-y-4 sm:space-y-6">
            {/* Formulario - RESPONSIVE */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Solicitar Cotización
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yamaha-blue focus:border-transparent text-sm sm:text-base"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yamaha-blue focus:border-transparent text-sm sm:text-base"
                    placeholder="3541 123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yamaha-blue focus:border-transparent text-sm sm:text-base"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yamaha-blue focus:border-transparent text-sm sm:text-base"
                    placeholder="Escribe tu consulta aquí..."
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <label className="flex items-start sm:items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.parteDePago}
                      onChange={(e) => setFormData({ ...formData, parteDePago: e.target.checked })}
                      className="mt-0.5 sm:mt-0 rounded border-gray-300 text-yamaha-blue focus:ring-yamaha-blue"
                    />
                    <span className="text-sm text-gray-700">
                      Tengo moto para dar en parte de pago
                    </span>
                  </label>

                  <label className="flex items-start sm:items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.financiacion}
                      onChange={(e) => setFormData({ ...formData, financiacion: e.target.checked })}
                      className="mt-0.5 sm:mt-0 rounded border-gray-300 text-yamaha-blue focus:ring-yamaha-blue"
                    />
                    <span className="text-sm text-gray-700">Me interesa financiación</span>
                  </label>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-600 transition font-semibold text-sm sm:text-base shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Info de Contacto - RESPONSIVE */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Información de Contacto
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {/* WhatsApp Directo */}
                <button
                  onClick={handleWhatsAppDirect}
                  className="w-full flex items-center space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">WhatsApp</p>
                    <p className="text-xs sm:text-sm text-gray-600">+54 9 3541 56-7273</p>
                  </div>
                </button>

                {/* Teléfono */}
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-yamaha-blue flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Teléfono</p>
                    <p className="text-xs sm:text-sm text-gray-600">3541 56-7273</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-yamaha-blue flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Email</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      jeremiasgerlero7@gmail.com
                    </p>
                  </div>
                </div>

                {/* Dirección */}
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-yamaha-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Dirección</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Los Nogales 130, San Antonio de Arredondo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;