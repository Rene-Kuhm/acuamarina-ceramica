import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => void;
}

// Funciones helper para localStorage
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('auth-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth-user');
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: () => {
    if (typeof window === 'undefined') {
      console.log('⚠️ Initialize llamado en servidor, ignorando...');
      return;
    }

    console.log('🔄 Inicializando authStore...');

    // Leer datos del localStorage
    const storedUser = getStoredUser();
    const accessToken = getStoredToken('accessToken');
    const refreshToken = getStoredToken('refreshToken');

    console.log('📦 Datos en localStorage:', {
      hasUser: !!storedUser,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    // Si hay tokens válidos, restaurar la sesión
    if (accessToken && refreshToken && storedUser) {
      console.log('✅ Restaurando sesión desde localStorage');
      set({
        user: storedUser,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      console.log('❌ No hay sesión válida, limpiando...');
      // Si no hay tokens, limpiar todo
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  login: (user, accessToken, refreshToken) => {
    if (typeof window === 'undefined') {
      console.log('⚠️ Login llamado en servidor, ignorando...');
      return;
    }

    console.log('🔐 Ejecutando login en authStore...', { email: user.email });

    // Guardar en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setStoredUser(user);

    console.log('💾 Tokens guardados en localStorage');

    // Actualizar estado
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });

    console.log('✅ Estado actualizado - isAuthenticated: true');
  },

  logout: () => {
    if (typeof window === 'undefined') return;

    // Limpiar localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth-user');

    // Actualizar estado
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    setStoredUser(updatedUser);

    set({ user: updatedUser });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));
