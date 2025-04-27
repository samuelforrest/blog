
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authStatus = localStorage.getItem('bloggy_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = async (password: string): Promise<boolean> => {
    if (password === 'bloggy') {
      localStorage.setItem('bloggy_auth', 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    localStorage.removeItem('bloggy_auth');
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
