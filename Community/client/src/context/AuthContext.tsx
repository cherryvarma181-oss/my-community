import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apsmart_user');
    return saved ? JSON.parse(saved) : {
      id: 'passenger-demo-id',
      email: 'passenger@apsmart.com',
      name: 'Srinivas Passenger',
      role: 'PASSENGER'
    };
  });

  const role = user?.role || 'PASSENGER';

  useEffect(() => {
    if (user) {
      localStorage.setItem('apsmart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('apsmart_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const { token, user: loggedUser } = res.data;
      setAuthToken(token);
      setUser(loggedUser);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const loginAsRole = async (targetRole: UserRole) => {
    let email = 'passenger@apsmart.com';
    let name = 'Srinivas Passenger';

    if (targetRole === 'TRANSPORT_ADMIN') {
      email = 'admin@apsmart.com';
      name = 'APSRTC Transport Admin';
    } else if (targetRole === 'FIELD_SURVEYOR') {
      email = 'surveyor@apsmart.com';
      name = 'Ramu Field Surveyor';
    }

    const success = await login(email, 'password123');
    if (!success) {
      // Fallback local setting if server offline
      setUser({
        id: `${targetRole.toLowerCase()}-id`,
        email,
        name,
        role: targetRole
      });
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      login,
      loginAsRole,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
