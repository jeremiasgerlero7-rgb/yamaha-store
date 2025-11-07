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

const API_URL = 'https://yamaha-store-backend.onrender.com/api';

const GestionVentas = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('pendiente');
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [toast, setToast] = useState(null);
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/leads`);
      if (!response.ok) throw new Error('Error al cargar leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar las ventas', 'error');
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

      if (!updateResponse.ok) throw new Error('Error al actualizar stock');
      return true;
    } catch (error) {
      console.error('Error al reducir stock:', error);
      return false;
    }
  };

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

      if (!updateResponse.ok) throw new Error('Error al actualizar stock');
      return true;
    } catch (error) {
      console.error('Error al aumentar stock:', error);
      return false;
    }
  };

  const actualizarEstado = async (leadId, nuevoEstado, lead) => {
    showToast('Actualizando estado...', 'loading');

    try {
      const estadoAnterior = lead.estado;

      if (nuevoEstado === 'confirmado' && estadoAnterior !== 'confirmado' && lead.productId) {
        const stockActualizado = await reducirStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo actualizar el stock del producto');
        }
      }

      if (nuevoEstado === 'pendiente' && estadoAnterior === 'confirmado' && lead.productId) {
        const stockActualizado = await aumentarStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo devolver el stock del producto');
        }
      }

      if (nuevoEstado === 'cancelado' && estadoAnterior === 'confirmado' && lead.productId) {
        const stockActualizado = await aumentarStock(lead.productId);
        if (!stockActualizado) {
          throw new Error('No se pudo devolver el stock del producto');
        }
      }

      const response = await fetch(`${API_URL}/leads/${leadId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

      showToast(mensajes[nuevoEstado], 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error al actualizar el estado', 'error');
    }
  };

  const confirmarEliminacion = (lead) => {
    setLeadToDelete(lead);
  };

  const eliminarLead = async () => {
    if (!leadToDelete) return;

    showToast('Eliminando...', 'loading');

    try {
      const response = await fetch(`${API_URL}/leads/${leadToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      await fetchLeads();
      await fetchStats();
      setLeadToDelete(null);

      showToast('Lead eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al eliminar el lead', 'error');
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
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium text-lg">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
            toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
            toast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
            'bg-blue-500/20 border-blue-500/50 text-blue-300'
          }`}>
            <p className="font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {leadToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full border border-red-500/50">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">¿Eliminar esta venta?</h3>
                <p className="text-sm text-gray-400">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">Cliente:</span> {leadToDelete.nombre}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Vehículo:</span> {leadToDelete.vehiculo}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLeadToDelete(null)}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
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
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 mb-6 transition group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al Panel de Administración</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-cyan-400" />
            Gestión de Ventas
          </h1>
          <p className="text-gray-400 text-lg">Administra tus cotizaciones y ventas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-500/30 hover:border-blue-400 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="h-12 w-12 text-blue-400 opacity-40" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-yellow-500/30 hover:border-yellow-400 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-white">{stats.pendientes}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-400 opacity-40" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-emerald-500/30 hover:border-emerald-400 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Confirmadas</p>
                <p className="text-3xl font-bold text-white">{stats.confirmados}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-emerald-400 opacity-40" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-red-500/30 hover:border-red-400 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Canceladas</p>
                <p className="text-3xl font-bold text-white">{stats.cancelados}</p>
              </div>
              <XCircle className="h-12 w-12 text-red-400 opacity-40" />
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre del cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-400 mt-2">
              {leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? 's' : ''} encontrado{leadsFiltrados.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filtros - CENTRADOS */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl p-2 inline-flex gap-2">
            <button
              onClick={() => setFiltroActivo('pendiente')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'pendiente'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50 scale-105'
                  : 'text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Clock className="h-5 w-5" />
              Pendientes
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                filtroActivo === 'pendiente' ? 'bg-white text-yellow-600' : 'bg-slate-700 text-yellow-400'
              }`}>
                {stats.pendientes}
              </span>
            </button>

            <button
              onClick={() => setFiltroActivo('confirmado')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'confirmado'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/50 scale-105'
                  : 'text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <CheckCircle className="h-5 w-5" />
              Confirmadas
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                filtroActivo === 'confirmado' ? 'bg-white text-emerald-600' : 'bg-slate-700 text-emerald-400'
              }`}>
                {stats.confirmados}
              </span>
            </button>

            <button
              onClick={() => setFiltroActivo('cancelado')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                filtroActivo === 'cancelado'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50 scale-105'
                  : 'text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <XCircle className="h-5 w-5" />
              Canceladas
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                filtroActivo === 'cancelado' ? 'bg-white text-red-600' : 'bg-slate-700 text-red-400'
              }`}>
                {stats.cancelados}
              </span>
            </button>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="space-y-6">
          {leadsFiltrados.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl p-12 text-center">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No se encontraron resultados' : `No hay ventas ${filtroActivo}s`}
              </h3>
              <p className="text-gray-400">
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
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Columna Izquierda - Vehículo */}
                  <div className="lg:col-span-1">
                    <div className="relative rounded-lg overflow-hidden mb-4 group border border-slate-700">
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
                        <Bike className="h-5 w-5 text-cyan-400" />
                        <h3 className="text-xl font-bold text-white">{lead.vehiculo || 'Vehículo no especificado'}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                        <span className="text-2xl font-bold text-emerald-400">
                          ${lead.vehiculoPrecio?.toLocaleString() || '0'}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(lead._id)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition font-semibold shadow-lg"
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
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3 animate-fadeIn">
                          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5 text-cyan-400" />
                            Especificaciones
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Cilindrada</p>
                              <p className="font-bold text-white">{lead.vehiculoCilindrada || 0} cc</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Velocidad Máx.</p>
                              <p className="font-bold text-white">{lead.vehiculoVelocidadMax || 0} km/h</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Peso</p>
                              <p className="font-bold text-white">{lead.vehiculoPeso || 0} kg</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Categoría</p>
                              <p className="font-bold text-white capitalize">{lead.vehiculoCategoria || 'N/A'}</p>
                            </div>
                          </div>
                          {lead.vehiculoDescripcion && (
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg mt-3">
                              <p className="text-xs text-gray-400 mb-1">Descripción</p>
                              <p className="text-sm text-gray-300">{lead.vehiculoDescripcion}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha - Información del Cliente */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Header con fecha */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {formatearFecha(lead.createdAt)}
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        lead.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                        lead.estado === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                        'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {lead.estado.charAt(0).toUpperCase() + lead.estado.slice(1)}
                      </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-white text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-cyan-400" />
                        Información del Cliente
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Nombre Completo</p>
                          <p className="font-bold text-white">{lead.nombre}</p>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="h-4 w-4 text-cyan-400" />
                            <p className="text-xs text-gray-400">Teléfono</p>
                          </div>
                          <p className="font-bold text-white">{lead.telefono}</p>
                        </div>

                        {lead.email && (
                          <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg md:col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="h-4 w-4 text-cyan-400" />
                              <p className="text-xs text-gray-400">Email</p>
                            </div>
                            <p className="font-bold text-white">{lead.email}</p>
                          </div>
                        )}
                      </div>

                      {/* Opciones adicionales */}
                      {(lead.parteDePago || lead.financiacion) && (
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-white mb-2">Opciones seleccionadas:</p>
                          <div className="space-y-2">
                            {lead.parteDePago && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                                <span>Tiene vehículo para entregar como parte de pago</span>
                              </div>
                            )}
                            {lead.financiacion && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                                <span>Interesado en financiación</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mensaje */}
                      {lead.mensaje && (
                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg">
                          <p className="text-xs text-gray-400 mb-2">Mensaje del cliente:</p>
                          <p className="text-gray-300 italic">"{lead.mensaje}"</p>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                      <button
                        onClick={() => abrirWhatsApp(lead.telefono, lead.nombre)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-emerald-500 transition font-semibold shadow-lg shadow-green-500/30"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </button>

                      {lead.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => actualizarEstado(lead._id, 'confirmado', lead)}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-emerald-500 hover:to-green-500 transition font-semibold shadow-lg shadow-emerald-500/30"
                          >
                            <CheckCircle className="h-5 w-5" />
                            Confirmar
                          </button>

                          <button
                            onClick={() => actualizarEstado(lead._id, 'cancelado', lead)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-red-500 hover:to-rose-500 transition font-semibold shadow-lg shadow-red-500/30"
                          >
                            <XCircle className="h-5 w-5" />
                            Cancelar
                          </button>
                        </>
                      )}

                      {lead.estado === 'confirmado' && (
                        <button
                          onClick={() => actualizarEstado(lead._id, 'pendiente', lead)}
                          className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-amber-500 transition font-semibold shadow-lg shadow-yellow-500/30"
                        >
                          <Clock className="h-5 w-5" />
                          Marcar Pendiente
                        </button>
                      )}

                      {lead.estado === 'cancelado' && (
                        <button
                          onClick={() => actualizarEstado(lead._id, 'pendiente', lead)}
                          className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-amber-500 transition font-semibold shadow-lg shadow-yellow-500/30"
                        >
                          <Clock className="h-5 w-5" />
                          Reactivar
                        </button>
                      )}

                      <button
                        onClick={() => confirmarEliminacion(lead)}
                        className="flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition font-semibold shadow-lg ml-auto"
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GestionVentas;