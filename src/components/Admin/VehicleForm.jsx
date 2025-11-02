import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: vehicle?.nombre || '',
    categoria: vehicle?.categoria || 'moto',
    precio: vehicle?.precio || '',
    cilindrada: vehicle?.cilindrada || '', // ✅ CORREGIDO: ahora lee de vehicle
    velocidadMax: vehicle?.velocidadMax || '', // ✅ CORREGIDO: ahora lee de vehicle
    peso: vehicle?.peso || '', // ✅ CORREGIDO: ahora lee de vehicle
    descripcion: vehicle?.descripcion || '',
    imageUrl: vehicle?.imagen || ''
  });

  const [imagePreview, setImagePreview] = useState(vehicle?.imagen || null);
  const [uploading, setUploading] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(true);

  // Subir archivo a Cloudinary
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'yamaha_products');
    cloudinaryFormData.append('folder', 'yamaha');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dbqapcw0r/image/upload',
        { method: 'POST', body: cloudinaryFormData }
      );

      if (!res.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
      }

      const data = await res.json();
      toast.success('✅ Imagen subida correctamente a Cloudinary');
      console.log('Imagen subida a Cloudinary:', data.secure_url);
      
      const optimizedUrl = data.secure_url.replace('/upload/', '/upload/w_1200,h_800,c_fit,q_auto:best,f_auto/');
      
      setFormData(prev => ({ ...prev, imageUrl: optimizedUrl }));
      setImagePreview(optimizedUrl);
      
      console.log('📋 FormData actualizado:', { ...formData, imageUrl: optimizedUrl });
    } catch (err) {
      console.error('❌ Error subiendo imagen:', err);
      toast.error('Error al subir imagen: ' + err.message);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  }

  function handleImageUrlChange(e) {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log('🔍 FormData antes de enviar:', formData);

    if (!formData.imageUrl) {
      toast.error('Por favor agrega una imagen');
      return;
    }

    console.log('📤 Enviando formulario con datos:', formData);
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <Toaster position="top-right" />
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {vehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="Ej: Yamaha R1"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
            >
              <option value="moto">Moto</option>
              <option value="utv">UTV</option>
              <option value="atv">ATV</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (USD)</label>
            <input
              type="number"
              required
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="15000"
              min="0"
              step="100"
            />
          </div>

          {/* Cilindrada */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cilindrada (C.C)</label>
            <input
              type="number"
              required
              value={formData.cilindrada}
              onChange={(e) => setFormData({ ...formData, cilindrada: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="125"
              min="0"
            />
          </div>

          {/* Velocidad Máxima */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Speed (KM/h)</label>
            <input
              type="number"
              required
              value={formData.velocidadMax}
              onChange={(e) => setFormData({ ...formData, velocidadMax: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="140"
              min="0"
            />
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Peso (Kg)</label>
            <input
              type="number"
              required
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="120"
              min="0"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
              placeholder="Descripción del vehículo..."
            />
          </div>

          {/* Toggle: URL vs Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Vehículo</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUseUrlInput(true)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  useUrlInput
                    ? 'bg-yamaha-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pegar URL
              </button>
              <button
                type="button"
                onClick={() => setUseUrlInput(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !useUrlInput
                    ? 'bg-yamaha-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Subir Archivo
              </button>
            </div>

            {/* Input URL */}
            {useUrlInput && (
              <div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-yamaha-blue focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Pega la URL completa de la imagen</p>
              </div>
            )}

            {/* Input Archivo (Cloudinary) */}
            {!useUrlInput && (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yamaha-blue transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-yamaha-blue border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm text-gray-600">Subiendo a Cloudinary...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Haz clic para subir una imagen</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG hasta 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Preview de la imagen */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa:</label>
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/1a1a1a/FFC107?text=Error+al+cargar';
                  }}
                />
                {formData.imageUrl.includes('cloudinary') && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Cloudinary
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 break-all">
                {formData.imageUrl.substring(0, 80)}...
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-yamaha-blue rounded-md hover:bg-yamaha-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {vehicle ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}