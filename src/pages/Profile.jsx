import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, User, Mail, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { currentUser, updateProfilePicture } = useAuth();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);

    // ✅ Evitá redirigir durante el renderizado
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // ✅ No renderices nada hasta que esté listo
    if (!currentUser) return null;

    const predefinedAvatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
        'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
        'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/bottts/svg?seed=Max',
        'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
    ];

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no debe superar 5MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUploadCustomImage = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const token = localStorage.getItem('token');
            const API_URL = 'http://localhost:5000';

            const res = await fetch(`${API_URL}/api/auth/upload-profile-picture`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al subir imagen');

            await updateProfilePicture(data.url);
            toast.success('¡Foto de perfil actualizada!');
            setPreviewUrl(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error al subir imagen:', error);
            toast.error(error.message || 'Error al actualizar la foto');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSelectAvatar = async (avatarUrl) => {
        setIsUploading(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = 'http://localhost:5000';

            const res = await fetch(`${API_URL}/api/auth/update-avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatarUrl }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar avatar');

            await updateProfilePicture(avatarUrl);
            toast.success('¡Avatar actualizado!');
            setShowAvatarSelector(false);
        } catch (error) {
            console.error('Error al actualizar avatar:', error);
            toast.error(error.message || 'Error al actualizar el avatar');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelPreview = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    return (
        <div className="pt-16 min-h-screen bg-yamaha-dark-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(13, 71, 161, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                ></div>
            </div>

            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-yamaha-blue-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-yamaha-accent/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-yamaha-accent transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yamaha-blue-200 to-white">
                            Mi
                        </span>
                        <span className="text-yamaha-accent"> Perfil</span>
                    </h1>
                    <p className="text-gray-400">Personaliza tu cuenta y foto de perfil</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Información del usuario */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-yamaha-dark-800/50 backdrop-blur-xl border-2 border-yamaha-blue-900/30 rounded-2xl p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-yamaha-accent" />
                            Información del Usuario
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-yamaha-dark-700/50 rounded-xl border border-yamaha-blue-900/30">
                                    <User className="w-5 h-5 text-yamaha-blue-400" />
                                    <span className="text-white font-medium">{currentUser.name}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-yamaha-dark-700/50 rounded-xl border border-yamaha-blue-900/30">
                                    <Mail className="w-5 h-5 text-yamaha-blue-400" />
                                    <span className="text-white font-medium">{currentUser.email}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Rol</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-yamaha-dark-700/50 rounded-xl border border-yamaha-blue-900/30">
                                    <Shield className="w-5 h-5 text-yamaha-accent" />
                                    <span className="text-white font-medium capitalize">{currentUser.role}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Método de inicio de sesión</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-yamaha-dark-700/50 rounded-xl border border-yamaha-blue-900/30">
                                    <Sparkles className="w-5 h-5 text-yamaha-blue-400" />
                                    <span className="text-white font-medium">
                                        {currentUser.provider === 'google' ? 'Google' : 'Email/Contraseña'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Foto de perfil */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-yamaha-dark-800/50 backdrop-blur-xl border-2 border-yamaha-blue-900/30 rounded-2xl p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-yamaha-accent" />
                            Foto de Perfil
                        </h2>

                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-yamaha-accent"
                                    />
                                ) : currentUser.profilePicture ? (
                                    <img
                                        src={currentUser.profilePicture}
                                        alt={currentUser.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-yamaha-accent/50"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-accent flex items-center justify-center text-black font-bold text-4xl border-4 border-yamaha-accent/50">
                                        {getInitials(currentUser.name)}
                                    </div>
                                )}

                                {!previewUrl && (
                                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-400 mt-3 text-center">
                                {previewUrl ? 'Vista previa de tu nueva foto' : 'Tu foto de perfil actual'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {previewUrl ? (
                                <motion.div
                                    key="preview-actions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <button
                                        onClick={handleUploadCustomImage}
                                        disabled={isUploading}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-accent text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-yamaha-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? (
                                            <>
                                                <motion.div
                                                    className="w-5 h-5 border-3 border-black border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                Subiendo a Cloudinary...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Guardar Foto
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleCancelPreview}
                                        disabled={isUploading}
                                        className="w-full flex items-center justify-center gap-2 bg-yamaha-dark-700/50 text-gray-300 px-6 py-3 rounded-xl font-bold border border-yamaha-blue-900/30 hover:bg-yamaha-dark-700 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancelar
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload-actions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <label className="w-full flex items-center justify-center gap-2 bg-gradient-accent text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-yamaha-accent-light transition-colors cursor-pointer">
                                        <Upload className="w-5 h-5" />
                                        Subir Imagen
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>

                                    <button
                                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                                        disabled={isUploading}
                                        className="w-full flex items-center justify-center gap-2 bg-yamaha-dark-700/50 text-white px-6 py-3 rounded-xl font-bold border border-yamaha-blue-900/30 hover:bg-yamaha-dark-700 transition-colors disabled:opacity-50"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        Elegir Avatar
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Formatos: JPG, PNG, GIF (máx. 5MB)
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {showAvatarSelector && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-yamaha-blue-900/30"
                                >
                                    <p className="text-sm text-gray-400 mb-4">Selecciona un avatar:</p>
                                    <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {predefinedAvatars.map((avatarUrl, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleSelectAvatar(avatarUrl)}
                                                disabled={isUploading}
                                                className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <img
                                                    src={avatarUrl}
                                                    alt={`Avatar ${index + 1}`}
                                                    className="w-full aspect-square rounded-full border-2 border-yamaha-blue-900/30 hover:border-yamaha-accent transition-colors"
                                                />
                                                <div className="absolute inset-0 rounded-full bg-yamaha-accent/0 group-hover:bg-yamaha-accent/20 transition-colors" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;