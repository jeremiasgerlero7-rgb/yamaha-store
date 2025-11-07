import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, DollarSign, TrendingUp, X, ChevronUp, ChevronDown, Settings, ShoppingCart, Upload, Link as LinkIcon } from 'lucide-react';

const API_URL = 'https://yamaha-store-backend.onrender.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes

// Toast Component
const Toast = ({ message, type, onClose, duration = 4000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden min-w-[300px]">
        <div className="p-4 flex items-center gap-3">
          <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
            {icon}
          </div>
          <p className="text-white text-sm flex-1">{message}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 bg-gray-800">
          <div 
            className={`h-full ${bgColor} transition-all ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' o 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'moto',
    imagen: '',
    cilindrada: '',
    velocidadMax: '',
    peso: '',
    cantidad: 0,
    disponible: true
  });

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [products]);

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

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.precio * (p.cantidad || 0)), 0);
    const lowStock = products.filter(p => (p.cantidad || 0) < 5).length;
    setStats({ totalProducts, totalValue, lowStock });
  };

  // Función para subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'yamaha_products'); // Debes crear este preset en Cloudinary
    formData.append('cloud_name', 'tu_cloud_name'); // Reemplaza con tu cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload`, // Reemplaza con tu cloud name
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida', 'error');
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      showToast(`La imagen debe pesar menos de ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 'error');
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imagen: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imagen;

      // Si se seleccionó un archivo, subirlo a Cloudinary
      if (uploadMethod === 'file' && selectedFile) {
        showToast('Subiendo imagen...', 'info');
        imageUrl = await uploadImageToCloudinary(selectedFile);
      }

      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const dataToSend = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        imagen: imageUrl,
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
        showToast(editingProduct ? 'Producto actualizado' : 'Producto creado', 'success');
        fetchProducts();
        closeModal();
      } else {
        const error = await response.json();
        showToast(error.message || 'Error al guardar producto', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error al procesar la imagen o guardar el producto', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          showToast('Producto eliminado', 'success');
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

  const handleStockChange = async (productId, change) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, (product.cantidad || 0) + change);

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
        categoria: product.categoria || 'moto',
        imagen: product.imagen || '',
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
        categoria: 'moto',
        imagen: '',
        cilindrada: '',
        velocidadMax: '',
        peso: '',
        cantidad: 0,
        disponible: true
      });
    }
    setUploadMethod('url');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setUploadMethod('url');
  };

  const filteredProducts = products.filter(product =>
    product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToUsers = () => {
    window.location.href = '/users';
  };

  const navigateToVentas = () => {
    window.location.href = '/GestionVentas';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-6 px-4 sm:px-6">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-sm sm:text-base text-gray-600">Gestiona tu inventario de productos</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            className="pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base text-blue-600 border-b-2 border-blue-600"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Productos</span>
            </div>
          </button>
          <button
            onClick={navigateToVentas}
            className="pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base text-gray-500 hover:text-gray-700"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Gestión de Ventas</span>
              <span className="sm:hidden">Ventas</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
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
                      <img 
                        src={product.imagen || 'https://placehold.co/400x300?text=Sin+Imagen'} 
                        alt={product.nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x300?text=Error';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
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
                <img 
                  src={product.imagen || 'https://placehold.co/400x300?text=Sin+Imagen'} 
                  alt={product.nombre} 
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300?text=Error';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">{product.nombre}</h3>
                  <p className="text-lg font-bold text-gray-900">${product.precio?.toLocaleString()}</p>
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1 uppercase">
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
      </div>

      {/* MODAL ACTUALIZADO CON SUBIDA DE IMÁGENES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 my-8">
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
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Precio * (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="moto">Moto</option>
                    <option value="utv">UTV</option>
                    <option value="atv">ATV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Cilindrada (cc)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cilindrada}
                    onChange={(e) => setFormData({ ...formData, cilindrada: e.target.value })}
                    placeholder="150"
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Vel. Máx (km/h)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.velocidadMax}
                    onChange={(e) => setFormData({ ...formData, velocidadMax: e.target.value })}
                    placeholder="120"
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    placeholder="150.5"
                    className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Disponible
                  </label>
                  <select
                    value={formData.disponible.toString()}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.value === 'true' })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              {/* SECCIÓN DE IMAGEN ACTUALIZADA */}
              <div className="border-t pt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
                  Imagen del Producto
                </label>

                {/* Selector de método de subida */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('url');
                      setSelectedFile(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      uploadMethod === 'url'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('file');
                      setFormData({ ...formData, imagen: '' });
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      uploadMethod === 'file'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Subir Archivo</span>
                  </button>
                </div>

                {/* Input de URL */}
                {uploadMethod === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pega la URL completa desde Cloudinary
                    </p>
                  </div>
                )}

                {/* Input de archivo */}
                {uploadMethod === 'file' && (
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="text-sm font-medium text-gray-700 mb-1">
                          Haz clic para subir una imagen
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, WEBP hasta {MAX_FILE_SIZE / (1024 * 1024)}MB
                        </span>
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                              <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFormData({ ...formData, imagen: '' });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Vista previa */}
                {formData.imagen && (
                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Vista Previa
                    </label>
                    <div className="relative inline-block">
                      <img
                        src={formData.imagen}
                        alt="Preview"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x300?text=Error+al+cargar';
                        }}
                      />
                      {uploadMethod === 'file' && selectedFile && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                          <Upload className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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