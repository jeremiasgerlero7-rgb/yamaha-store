import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Package,
  DollarSign,
  Calendar,
  TrendingUp,
  User,
  Bike,
  Trash2,
  Search,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://yamaha-store-backend.onrender.com/api';

const GestionVentas = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('pendiente');
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [stats, setStats] = useState({
    pendientes: 0,
    confirmados: 0,
    cancelados: 0,
    total: 0
  });

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/leads`);
      if (!response.ok) throw new Error('Error al cargar leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las ventas', {
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)',
        },
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/leads/stats/count`);
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Función para REDUCIR stock (cuando se confirma venta)
  const reducirStock = async (productId) => {
    try {
      const productResponse = await fetch(`${API_URL}/products/${productId}`);
      if (!productResponse.ok) throw new Error('Error al obtener producto');

      const product = await productResponse.json();
      const newQuantity = Math.max(0, (product.cantidad || 0) - 1);

      const updateResponse = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          cantidad: newQuantity
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar stock');
      }

      console.log(`✅ Stock reducido: ${product.nombre} - Nueva cantidad: ${newQuantity}`);
      return true;
    } catch (error) {
      console.error('❌ Error al reducir stock:', error);
      return false;
    }
  };

  // Función para AUMENTAR stock (cuando se cancela o marca como pendiente desde confirmado)
  const aumentarStock = async (productId) => {
    try {
      const productResponse = await fetch(`${API_URL}/products/${productId}`);
      if (!productResponse.ok) throw new Error('Error al obtener producto');

      const product = await productResponse.json();
      const newQuantity = (product.cantidad || 0) + 1;

      const updateResponse = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          cantidad: newQuantity
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar stock');
      }

      console.log(`✅ Stock aumentado: ${product.nombre} - Nueva cantidad: ${newQuantity}`);
      return true;
    } catch (error) {
      console.error('❌ Error al aumentar stock:', error);
      return false;
    }
  };

  const actualizarEstado = async (leadId, nuevoEstado, lead) => {
    const loadingToast = toast.loading('Actualizando estado...', {
      style: {
        background: 'rgba(17, 24, 39, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)',
      },
    });

    try {
      const estadoAnterior = lead.estado;

      // LÓGICA DE STOCK:
      // 1. Si se confirma una venta (pendiente/cancelado → confirmado): REDUCIR stock
      if (nuevoEstado === 'confirmado' && estadoAnterior !== 'confirmado' && lead.productId) {
        const stockActualizado = await reducirStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo actualizar el stock del producto');
        }
      }

      // 2. Si se marca como pendiente desde confirmado: AUMENTAR stock (cliente canceló)
      if (nuevoEstado === 'pendiente' && estadoAnterior === 'confirmado' && lead.productId) {
        const stockActualizado = await aumentarStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo devolver el stock del producto');
        }
      }

      // 3. Si se cancela desde confirmado: AUMENTAR stock
      if (nuevoEstado === 'cancelado' && estadoAnterior === 'confirmado' && lead.productId) {
        const stockActualizado = await aumentarStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo devolver el stock del producto');
        }
      }

      // Actualizar el estado del lead
      const response = await fetch(`${API_URL}/leads/${leadId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      await fetchLeads();
      await fetchStats();

      const mensajes = {
        confirmado: '¡Venta confirmada y stock actualizado! 🎉',
        cancelado: estadoAnterior === 'confirmado' 
          ? 'Venta cancelada y stock devuelto ✅' 
          : 'Venta cancelada',
        pendiente: estadoAnterior === 'confirmado'
          ? 'Venta marcada como pendiente y stock devuelto ✅'
          : 'Venta marcada como pendiente'
      };

      toast.success(mensajes[nuevoEstado], {
        id: loadingToast,
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2)',
        },
        duration: 4000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al actualizar el estado', {
        id: loadingToast,
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)',
        },
        duration: 4000,
      });
    }
  };

  const confirmarEliminacion = (lead) => {
    setLeadToDelete(lead);
  };

  const eliminarLead = async () => {
    if (!leadToDelete) return;

    const loadingToast = toast.loading('Eliminando...', {
      style: {
        background: 'rgba(17, 24, 39, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)',
      },
    });

    try {
      const response = await fetch(`${API_URL}/leads/${leadToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      await fetchLeads();
      await fetchStats();
      setLeadToDelete(null);

      toast.success('Lead eliminado correctamente', {
        id: loadingToast,
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2)',
        },
        duration: 4000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar el lead', {
        id: loadingToast,
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)',
        },
        duration: 4000,
      });
    }
  };

  const toggleExpand = (leadId) => {
    setExpandedCards(prev => ({
      ...prev,
      [leadId]: !prev[leadId]
    }));
  };

  const leadsFiltrados = leads
    .filter(lead => lead.estado === filtroActivo)
    .filter(lead =>
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const abrirWhatsApp = (telefono, nombre) => {
    const mensaje = `Hola ${nombre}, te contacto desde Yamaha Store sobre tu cotización.`;
    const url = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yamaha-blue mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            padding: '16px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Modal de confirmación de eliminación */}
      {leadToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">¿Está seguro que quiere eliminar la venta?</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Cliente:</span> {leadToDelete.nombre}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Vehículo:</span> {leadToDelete.vehiculo}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLeadToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarLead}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón volver al panel de admin */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al Panel de Administración</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-yamaha-blue" />
            Gestión de Ventas
          </h1>
          <p className="text-gray-600">Administra tus cotizaciones y ventas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmadas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmados}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Canceladas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cancelados}</p>
              </div>
              <XCircle className="h-12 w-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre del cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yamaha-blue focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              {leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? 's' : ''} encontrado{leadsFiltrados.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filtros - CENTRADOS */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
            <button
              onClick={() => setFiltroActivo('pendiente')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'pendiente'
                  ? 'bg-yellow-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="h-5 w-5" />
              Pendientes
              <span className="bg-white text-yellow-600 px-2 py-1 rounded-full text-xs font-bold">
                {stats.pendientes}
              </span>
            </button>

            <button
              onClick={() => setFiltroActivo('confirmado')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'confirmado'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="h-5 w-5" />
              Confirmadas
              <span className="bg-white text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                {stats.confirmados}
              </span>
            </button>

            <button
              onClick={() => setFiltroActivo('cancelado')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'cancelado'
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <XCircle className="h-5 w-5" />
              Canceladas
              <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                {stats.cancelados}
              </span>
            </button>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="space-y-6">
          {leadsFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : `No hay ventas ${filtroActivo}s`}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No hay leads que coincidan con "${searchTerm}"`
                  : 'Las ventas aparecerán aquí cuando los clientes completen el formulario'
                }
              </p>
            </div>
          ) : (
            leadsFiltrados.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Columna Izquierda - Vehículo */}
                  <div className="lg:col-span-1">
                    <div className="relative rounded-lg overflow-hidden mb-4 group">
                      <img
                        src={lead.vehiculoImagen || 'https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Yamaha'}
                        alt={lead.vehiculo}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Yamaha';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bike className="h-5 w-5 text-yamaha-blue" />
                        <h3 className="text-xl font-bold text-gray-900">{lead.vehiculo || 'Vehículo no especificado'}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          ${lead.vehiculoPrecio?.toLocaleString() || '0'}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(lead._id)}
                        className="w-full flex items-center justify-center gap-2 bg-yamaha-blue text-white px-4 py-3 rounded-lg hover:bg-yamaha-dark transition font-semibold"
                      >
                        {expandedCards[lead._id] ? (
                          <>
                            <ChevronUp className="h-5 w-5" />
                            Ocultar Info
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-5 w-5" />
                            Más Info
                          </>
                        )}
                      </button>

                      {/* Info expandida del vehículo */}
                      {expandedCards[lead._id] && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 animate-fadeIn">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5 text-yamaha-blue" />
                            Especificaciones
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Cilindrada</p>
                              <p className="font-bold text-gray-900">{lead.vehiculoCilindrada || 0} cc</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Velocidad Máx.</p>
                              <p className="font-bold text-gray-900">{lead.vehiculoVelocidadMax || 0} km/h</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Peso</p>
                              <p className="font-bold text-gray-900">{lead.vehiculoPeso || 0} kg</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Categoría</p>
                              <p className="font-bold text-gray-900 capitalize">{lead.vehiculoCategoria || 'N/A'}</p>
                            </div>
                          </div>
                          {lead.vehiculoDescripcion && (
                            <div className="bg-white p-3 rounded-lg mt-3">
                              <p className="text-xs text-gray-600 mb-1">Descripción</p>
                              <p className="text-sm text-gray-700">{lead.vehiculoDescripcion}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha - Información del Cliente */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Header con fecha */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatearFecha(lead.createdAt)}
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        lead.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        lead.estado === 'confirmado' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lead.estado.charAt(0).toUpperCase() + lead.estado.slice(1)}
                      </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-yamaha-blue" />
                        Información del Cliente
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Nombre Completo</p>
                          <p className="font-bold text-gray-900">{lead.nombre}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="h-4 w-4 text-yamaha-blue" />
                            <p className="text-xs text-gray-600">Teléfono</p>
                          </div>
                          <p className="font-bold text-gray-900">{lead.telefono}</p>
                        </div>

                        {lead.email && (
                          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="h-4 w-4 text-yamaha-blue" />
                              <p className="text-xs text-gray-600">Email</p>
                            </div>
                            <p className="font-bold text-gray-900">{lead.email}</p>
                          </div>
                        )}
                      </div>

                      {/* Opciones adicionales */}
                      {(lead.parteDePago || lead.financiacion) && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Opciones seleccionadas:</p>
                          <div className="space-y-2">
                            {lead.parteDePago && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Tiene vehículo para entregar como parte de pago</span>
                              </div>
                            )}
                            {lead.financiacion && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Interesado en financiación</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mensaje */}
                      {lead.mensaje && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-2">Mensaje del cliente:</p>
                          <p className="text-gray-900 italic">"{lead.mensaje}"</p>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <button
                        onClick={() => abrirWhatsApp(lead.telefono, lead.nombre)}
                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold shadow-lg hover:shadow-xl"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </button>

                      {lead.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => actualizarEstado(lead._id, 'confirmado', lead)}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg hover:shadow-xl"
                          >
                            <CheckCircle className="h-5 w-5" />
                            Confirmar
                          </button>

                          <button
                            onClick={() => actualizarEstado(lead._id, 'cancelado', lead)}
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold shadow-lg hover:shadow-xl"
                          >
                            <XCircle className="h-5 w-5" />
                            Cancelar
                          </button>
                        </>
                      )}

                      {lead.estado === 'confirmado' && (
                        <button
                          onClick={() => actualizarEstado(lead._id, 'pendiente', lead)}
                          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold shadow-lg hover:shadow-xl"
                        >
                          <Clock className="h-5 w-5" />
                          Marcar Pendiente
                        </button>
                      )}

                      {lead.estado === 'cancelado' && (
                        <button
                          onClick={() => actualizarEstado(lead._id, 'pendiente', lead)}
                          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold shadow-lg hover:shadow-xl"
                        >
                          <Clock className="h-5 w-5" />
                          Reactivar
                        </button>
                      )}

                      <button
                        onClick={() => confirmarEliminacion(lead)}
                        className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold shadow-lg hover:shadow-xl ml-auto"
                      >
                        <Trash2 className="h-5 w-5" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GestionVentas;