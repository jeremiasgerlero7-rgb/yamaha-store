import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, X, AlertTriangle, Users as UsersIcon, Shield, UserCheck, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    regularUsers: 0
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const calculateStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    setStats({ totalUsers, admins, regularUsers });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const loadingToast = toast.loading('Creando administrador...');

    try {
      const res = await fetch(`${API_URL}/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast.success(`Administrador ${formData.name} creado exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
      
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(`Error: ${error.message}`, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading('Eliminando usuario...');

    try {
      const res = await fetch(`${API_URL}/${userToDelete._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar usuario');
      }

      toast.success(`${userToDelete.name} eliminado exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario', {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const handleConfirmBulkDelete = async () => {
    const loadingToast = toast.loading('Eliminando usuarios...');

    try {
      const res = await fetch(`${API_URL}/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedUsers }),
      });

      if (!res.ok) {
        throw new Error('Error al eliminar usuarios');
      }

      const result = await res.json();
      
      toast.success(`${result.deletedCount} usuarios eliminados exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
      
      setShowBulkDeleteModal(false);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Error al eliminar usuarios', {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-32 pb-6 px-4 sm:px-6">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#fff',
            fontWeight: '500',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(6, 182, 212, 0.2)',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#06b6d4',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Volver</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Crear Admin</span>
              </button>
            </div>
            
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Administrar Usuarios
            </h1>
            
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDeleteClick}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/50 text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar Seleccionados ({selectedUsers.length})</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Volver al Panel de Administración</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Administrar Usuarios
            </h1>
            <div className="flex space-x-4">
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDeleteClick}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/50 font-medium"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Eliminar ({selectedUsers.length})</span>
                </button>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Crear Administrador</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-cyan-500/20 p-4 sm:p-6 hover:scale-105 hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Usuarios</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-purple-500/20 p-4 sm:p-6 hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Administradores</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-emerald-500/20 p-4 sm:p-6 hover:scale-105 hover:shadow-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Usuarios Regulares</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.regularUsers}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-cyan-500/20 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-400 mt-2">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 text-sm sm:text-base mt-4">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-cyan-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/70 border-b border-cyan-500/20">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-cyan-500/30 bg-slate-700/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className={`${selectedUsers.includes(user._id) ? 'bg-cyan-500/10' : 'hover:bg-slate-700/30'} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="rounded border-cyan-500/30 bg-slate-700/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-400 hover:text-red-300 transition flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  className={`bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-xl p-4 transition-all duration-300 ${
                    selectedUsers.includes(user._id) ? 'border-2 border-cyan-500 shadow-cyan-500/30' : 'border border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="mt-1 rounded border-cyan-500/30 bg-slate-700/50 text-cyan-500 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="w-full mt-2 flex items-center justify-center space-x-2 text-red-400 hover:bg-red-500/10 py-2 rounded-lg transition-all text-sm font-medium border border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 max-w-md w-full p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Crear Administrador
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                    placeholder="juan@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ name: '', email: '', password: '' });
                    }}
                    className="w-full px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm sm:text-base border border-slate-600/50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 font-medium text-sm sm:text-base"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/30 max-w-md w-full p-4 sm:p-6">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-full p-2 shadow-lg shadow-red-500/50">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Confirmar Eliminación
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm sm:text-base text-gray-300 mb-4">
                  ¿Estás seguro que quieres eliminar a:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-sm sm:text-base truncate">
                        {userToDelete.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">
                        {userToDelete.email}
                      </p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      userToDelete.role === 'admin' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {userToDelete.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-3">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="w-full px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm sm:text-base border border-slate-600/50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/50 font-medium text-sm sm:text-base"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/30 max-w-md w-full p-4 sm:p-6">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-full p-2 shadow-lg shadow-red-500/50">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Confirmar Eliminación Masiva
                  </h3>
                </div>
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm sm:text-base text-gray-300 mb-4">
                  ¿Estás seguro que quieres eliminar <strong className="text-white">{selectedUsers.length}</strong> usuarios?
                </p>
                <div className="bg-red-500/10 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                  <p className="text-xs sm:text-sm text-red-300 font-medium">
                    Esta acción eliminará permanentemente {selectedUsers.length} {selectedUsers.length === 1 ? 'usuario' : 'usuarios'} del sistema.
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-3">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="w-full px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm sm:text-base border border-slate-600/50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmBulkDelete}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/50 font-medium text-sm sm:text-base"
                >
                  Eliminar {selectedUsers.length}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;