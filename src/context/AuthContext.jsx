import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // ➜ 1. Lee usuario de localStorage al arrancar
    const saved = localStorage.getItem('yamahaUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ➜ 2. Verifica token y obtiene usuario actualizado
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('yamahaUser', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('yamahaUser');
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN TRADICIONAL
  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');

    // Guarda token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('yamahaUser', JSON.stringify(data.user));
    setCurrentUser(data.user);
    
    return data;
  };

  // 📝 REGISTRO TRADICIONAL
  const register = async (name, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al registrarse');

    // Guarda token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('yamahaUser', JSON.stringify(data.user));
    
    // Marca como primer login para mostrar notificación
    if (data.isNewUser && data.user.provider === 'local') {
      localStorage.setItem('showWelcomeNotification', 'true');
    }
    
    setCurrentUser(data.user);
    
    return data;
  };

  // ⭐ LOGIN/REGISTRO CON GOOGLE
  const loginWithGoogle = async (credential) => {
    console.log('🔵 1. Enviando credential a backend:', credential?.substring(0, 50) + '...');
    
    const res = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    console.log('🔵 2. Response status:', res.status, res.ok);
    
    const data = await res.json();
    console.log('🔵 3. Data recibida del backend:', data);
    
    if (!res.ok) {
      console.error('❌ Error del backend:', data.message);
      throw new Error(data.message || 'Error al iniciar sesión con Google');
    }

    // Guarda token y usuario
    console.log('🔵 4. Guardando en localStorage...');
    localStorage.setItem('token', data.token);
    localStorage.setItem('yamahaUser', JSON.stringify(data.user));
    
    // NO mostrar notificación para usuarios de Google
    localStorage.removeItem('showWelcomeNotification');
    
    console.log('🔵 5. Actualizando currentUser...');
    setCurrentUser(data.user);
    
    console.log('🔵 6. Retornando data:', data);
    return data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('yamahaUser');
    localStorage.removeItem('showWelcomeNotification');
    setCurrentUser(null);
  };

  // 🖼️ ACTUALIZAR FOTO DE PERFIL
  const updateProfilePicture = async (newPictureUrl) => {
    try {
      const updatedUser = {
        ...currentUser,
        profilePicture: newPictureUrl,
        hasCustomAvatar: true,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('yamahaUser', JSON.stringify(updatedUser));
      
      // Aquí podrías hacer una llamada al backend para guardar la foto
      // await fetch('http://localhost:5000/api/auth/update-profile-picture', ...)
      
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfilePicture,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};