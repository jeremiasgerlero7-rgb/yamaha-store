import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, DollarSign, TrendingUp, X, Users, Mail, Phone, Bike, ChevronUp, ChevronDown, Settings } from 'lucide-react';

const API_URL = 'https://yamaha-store-backend.onrender.com';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imageUrl: '',
    cilindrada: '',
    velocidadMax: '',
    peso: '',
    cantidad: 0,
    disponible: true
  });

  useEffect(() => {
    fetchProducts();
    fetchLeads();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [products]);

  const showToast = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Error al cargar productos', 'error');
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast('Error al cargar contactos', 'error');
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.precio * (p.cantidad || 0)), 0);
    const lowStock = products.filter(p => (p.cantidad || 0) < 5).length;
    setStats({ totalProducts, totalValue, lowStock });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    showToast(editingProduct ? 'Actualizando producto...' : 'Creando producto...', 'loading');

    try {
      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const dataToSend = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        imageUrl: formData.imageUrl,
        cilindrada: parseFloat(formData.cilindrada) || 0,
        velocidadMax: parseFloat(formData.velocidadMax) || 0,
        peso: parseFloat(formData.peso) || 0,
        cantidad: parseInt(formData.cantidad) || 0,
        disponible: Boolean(formData.disponible)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        showToast(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente', 'success');
        fetchProducts();
        closeModal();
      } else {
        const error = await response.json();
        showToast(error.message || 'Error al guardar producto', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error de conexión con el servidor', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      showToast('Eliminando producto...', 'loading');

      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          showToast('Producto eliminado exitosamente', 'success');
          fetchProducts();
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error al eliminar producto', 'error');
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este contacto?')) {
      showToast('Eliminando contacto...', 'loading');

      try {
        const response = await fetch(`${API_URL}/api/leads/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          showToast('Contacto eliminado exitosamente', 'success');
          fetchLeads();
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        showToast('Error al eliminar contacto', 'error');
      }
    }
  };

  const handleStockChange = async (productId, change) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, (product.cantidad || 0) + change);

    showToast('Actualizando stock...', 'loading');

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          cantidad: newQuantity
        })
      });

      if (response.ok) {
        showToast('Stock actualizado', 'success');
        fetchProducts();
      } else {
        throw new Error('Error al actualizar stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      showToast('Error al actualizar stock', 'error');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio?.toString() || '',
        categoria: product.categoria || '',
        imageUrl: product.imagen || '',
        cilindrada: product.cilindrada?.toString() || '',
        velocidadMax: product.velocidadMax?.toString() || '',
        peso: product.peso?.toString() || '',
        cantidad: product.cantidad || 0,
        disponible: product.disponible !== undefined ? product.disponible : true
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        imageUrl: '',
        cilindrada: '',
        velocidadMax: '',
        peso: '',
        cantidad: 0,
        disponible: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    lead.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.vehiculo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToUsers = () => {
    window.location.href = '/users';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-sm sm:text-base text-gray-600">Gestiona tu inventario y posibles ventas</p>
            </div>

            <div className="border-2 border-cyan-400 rounded-2xl bg-gradient-to-br from-cyan-50 to-transparent p-4 max-w-md">
              <p className="text-sm text-cyan-900">
                <span className="text-lg mr-2">⚠️</span>
                <span className="font-semibold text-cyan-700">Importante:</span> Actualiza el stock manualmente. Las ventas y cotizaciones se gestionan fuera del sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Productos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${activeTab === 'leads'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Posibles Ventas</span>
              <span className="sm:hidden">Ventas</span>
              {leads.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5">
                  {leads.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={navigateToUsers}
            className="pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base text-gray-500 hover:text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Administrar Usuarios</span>
              <span className="sm:hidden">Usuarios</span>
            </div>
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Productos</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Bajo</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Nuevo Producto</span>
                  <span className="sm:hidden">Nuevo</span>
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={product.imagen} alt={product.nombre} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.precio?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStockChange(product._id, -1)}
                              className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${(product.cantidad || 0) < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                              {product.cantidad || 0}
                            </span>
                            <button
                              onClick={() => handleStockChange(product._id, 1)}
                              className="p-1 rounded bg-green-100 hover:bg-green-200 text-green-600 transition"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {product.disponible ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-3 mb-3">
                    <img src={product.imagen} alt={product.nombre} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">{product.nombre}</h3>
                      <p className="text-lg font-bold text-gray-900">${product.precio?.toLocaleString()}</p>
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                        {product.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockChange(product._id, -1)}
                        className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${(product.cantidad || 0) < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {product.cantidad || 0}
                      </span>
                      <button
                        onClick={() => handleStockChange(product._id, 1)}
                        className="p-1.5 rounded bg-green-100 hover:bg-green-200 text-green-600 transition"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Disponible:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {product.disponible ? 'Sí' : 'No'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'leads' && (
          <>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Sección del Producto - Izquierda */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 border-r border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Bike className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900 text-lg">Producto de Interés</h3>
                      </div>
                      
                      {lead.vehiculoImagen && (
                        <img
                          src={lead.vehiculoImagen}
                          alt={lead.vehiculo}
                          className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                          onError={(e) => {
                            e.target.src = 'https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg';
                          }}
                        />
                      )}
                      
                      <h4 className="font-bold text-gray-900 text-xl mb-3">{lead.vehiculo}</h4>
                      
                      <div className="space-y-2">
                        {lead.vehiculoPrecio > 0 && (
                          <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="text-sm text-gray-600">Precio:</span>
                            <span className="text-lg font-bold text-blue-600">
                              ${lead.vehiculoPrecio.toLocaleString()}
                            </span>
                          </div>
                        )}
                        
                        {lead.vehiculoCilindrada > 0 && (
                          <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="text-sm text-gray-600">Cilindrada:</span>
                            <span className="font-semibold text-gray-900">
                              {lead.vehiculoCilindrada} cc
                            </span>
                          </div>
                        )}
                        
                        {lead.vehiculoCategoria && (
                          <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="text-sm text-gray-600">Categoría:</span>
                            <span className="font-semibold text-gray-900">
                              {lead.vehiculoCategoria}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sección de Información del Cliente - Derecha */}
                    <div className="lg:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Información del Cliente</h3>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Nombre completo</p>
                              <p className="text-sm font-semibold text-gray-900">{lead.nombre}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Email</p>
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-sm text-blue-600 hover:underline break-all"
                              >
                                {lead.email || 'No proporcionado'}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
                              <a
                                href={`tel:${lead.telefono}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {lead.telefono}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {lead.ciudad && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-0.5">Ciudad</p>
                              <p className="text-sm font-medium text-gray-900">{lead.ciudad}</p>
                            </div>
                          )}
                          
                          {lead.provincia && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-0.5">Provincia</p>
                              <p className="text-sm font-medium text-gray-900">{lead.provincia}</p>
                            </div>
                          )}
                          
                          {lead.codigoPostal && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-0.5">Código Postal</p>
                              <p className="text-sm font-medium text-gray-900">{lead.codigoPostal}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mensaje del cliente */}
                      {lead.mensaje && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-2 font-semibold">Mensaje del cliente:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{lead.mensaje}</p>
                        </div>
                      )}

                      {/* Fecha de registro */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                          Registrado el {new Date(lead.createdAt).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredLeads.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contactos aún</h3>
                  <p className="text-base text-gray-500">Los clientes que completen el formulario de cotización aparecerán aquí.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Cilindrada (cc)</label>
                  <input
                    type="number"
                    value={formData.cilindrada}
                    onChange={(e) => setFormData({ ...formData, cilindrada: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Velocidad Máx</label>
                  <input
                    type="number"
                    value={formData.velocidadMax}
                    onChange={(e) => setFormData({ ...formData, velocidadMax: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Cantidad en Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Disponible</label>
                  <select
                    value={formData.disponible}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.value === 'true' })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.imageUrl && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Vista Previa</label>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;