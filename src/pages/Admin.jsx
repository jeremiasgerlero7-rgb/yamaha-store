import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleTable from '../components/Admin/VehicleTable';
import VehicleForm from '../components/Admin/VehicleForm';
import { Plus, Users, X, Camera, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/products';

// Modal de confirmación personalizado
const DeleteConfirmModal = ({ vehicle, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro que quieres eliminar este vehículo?
          </p>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <img
                src={vehicle.imagen}
                alt={vehicle.nombre}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80?text=Sin+Imagen';
                }}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{vehicle.nombre}</h4>
                <p className="text-sm text-gray-500 capitalize">{vehicle.categoria}</p>
                <p className="text-sm font-medium text-blue-600">
                  ${vehicle.precio?.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// ⭐ NUEVO: Notificación de bienvenida
const WelcomeNotification = ({ user, onClose, onUploadPhoto }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Solo mostrar si NO es usuario de Google y tiene la marca en localStorage
    const shouldShow = localStorage.getItem('showWelcomeNotification');
    if (user.isGoogleAuth || !shouldShow) {
      setShow(false);
    }
  }, [user]);

  if (!show) return null;

  const handleClose = () => {
    setShow(false);
    localStorage.removeItem('showWelcomeNotification');
    onClose?.();
  };

  return (
    <div className="fixed top-20 right-4 max-w-md bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-6 z-50 animate-slideIn">
      <button 
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={20} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Camera className="text-blue-600" size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user.name}! 👋
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Como no iniciaste sesión con Google, tienes una foto de perfil predeterminada. 
            Pero no te preocupes, <strong>puedes personalizarla cuando quieras</strong>.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleClose();
                onUploadPhoto?.();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Upload size={16} />
              Subir foto ahora
            </button>
            
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
            >
              Más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchVehicles();
    
    // Verificar si debe mostrar la notificación de bienvenida
    const shouldShowWelcome = localStorage.getItem('showWelcomeNotification');
    if (shouldShowWelcome === 'true' && currentUser && !currentUser.isGoogleAuth) {
      setShowWelcome(true);
    }
  }, [currentUser]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar vehículos');
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (data) => {
    const loadingToast = toast.loading('Subiendo imagen y creando vehículo...');
    
    try {
      console.log('📦 Datos recibidos del formulario:', data);
      
      const productData = {
        nombre: data.nombre || data.name || '',
        categoria: data.categoria || data.category || 'moto',
        precio: Number(data.precio || data.price || 0),
        descripcion: data.descripcion || data.description || '',
        imagen: data.imageUrl || data.imagen || '',
        cilindrada: data.cilindrada || '',
        velocidadMax: data.velocidadMax || '',
        peso: data.peso || '',
        disponible: true
      };

      console.log('📤 Enviando al backend:', productData);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al guardar');
      }

      const newProduct = await res.json();
      console.log('✅ Vehículo creado exitosamente:', newProduct);

      await fetchVehicles();
      setShowForm(false);
      
      toast.success(`🎉 ${productData.nombre} agregado exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleEditVehicle = async (vehicleData) => {
    const loadingToast = toast.loading('Actualizando vehículo...');
    
    try {
      console.log('✏️ Editando vehículo:', vehicleData);
      
      const productData = {
        nombre: vehicleData.nombre || vehicleData.name || editingVehicle.nombre,
        precio: Number(vehicleData.precio || vehicleData.price || editingVehicle.precio),
        categoria: vehicleData.categoria || vehicleData.category || editingVehicle.categoria,
        descripcion: vehicleData.descripcion || vehicleData.description || editingVehicle.descripcion,
        imagen: vehicleData.imageUrl || vehicleData.imagen || editingVehicle.imagen,
        cilindrada: vehicleData.cilindrada || editingVehicle.cilindrada || '',
        velocidadMax: vehicleData.velocidadMax || editingVehicle.velocidadMax || '',
        peso: vehicleData.peso || editingVehicle.peso || '',
        disponible: vehicleData.disponible !== undefined ? vehicleData.disponible : editingVehicle.disponible
      };

      console.log('📤 Actualizando en backend:', productData);

      const res = await fetch(`${API_URL}/${editingVehicle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al actualizar vehículo');
      }

      const updatedProduct = await res.json();
      console.log('✅ Vehículo actualizado:', updatedProduct);

      await fetchVehicles();
      setEditingVehicle(null);
      setShowForm(false);
      
      toast.success(`✅ ${productData.nombre} actualizado exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      console.error('❌ Error updating vehicle:', error);
      toast.error(`❌ Error al actualizar: ${error.message}`, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (!vehicle) return;
    
    // Mostrar modal de confirmación
    setVehicleToDelete(vehicle);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    const loadingToast = toast.loading('Eliminando vehículo...');
    
    try {
      console.log('🗑️ Eliminando vehículo:', vehicleToDelete._id);
      
      const res = await fetch(`${API_URL}/${vehicleToDelete._id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al eliminar vehículo');
      }

      console.log('✅ Vehículo eliminado');
      
      await fetchVehicles();
      
      toast.success(`🗑️ ${vehicleToDelete.nombre} eliminado exitosamente`, {
        id: loadingToast,
        duration: 4000,
      });
      
      setVehicleToDelete(null);
    } catch (error) {
      console.error('❌ Error deleting vehicle:', error);
      toast.error(`❌ Error al eliminar: ${error.message}`, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const cancelDelete = () => {
    setVehicleToDelete(null);
  };

  const handleUploadPhoto = () => {
    // TODO: Implementar modal para subir foto
    toast.info('Función de subir foto próximamente');
    setShowProfileModal(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Toaster configurado para mostrar notificaciones */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
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
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* ⭐ NOTIFICACIÓN DE BIENVENIDA */}
      {showWelcome && currentUser && (
        <WelcomeNotification
          user={currentUser}
          onClose={() => setShowWelcome(false)}
          onUploadPhoto={handleUploadPhoto}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {vehicleToDelete && (
        <DeleteConfirmModal
          vehicle={vehicleToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/users')}
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Users className="h-5 w-5" />
              <span>Administrar Usuarios</span>
            </button>
            <button
              onClick={() => {
                console.log('🔘 Botón Agregar Vehículo clickeado');
                setEditingVehicle(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Vehículo</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando vehículos...</p>
          </div>
        ) : (
          <VehicleTable
            vehicles={vehicles}
            onEdit={(vehicle) => {
              setEditingVehicle(vehicle);
              setShowForm(true);
            }}
            onDelete={handleDeleteVehicle}
          />
        )}

        {showForm && (
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
            onCancel={() => {
              setShowForm(false);
              setEditingVehicle(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;