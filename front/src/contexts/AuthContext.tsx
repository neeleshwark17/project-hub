import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setOrganization: (org: Organization) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and validate it
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with your backend
      // For now, we'll simulate a logged-in user
      const savedUser = localStorage.getItem('user');
      const savedOrg = localStorage.getItem('organization');
      
      if (savedUser && savedOrg) {
        try {
          setUser(JSON.parse(savedUser));
          setOrganization(JSON.parse(savedOrg));
        } catch (error) {
          console.error('Error parsing saved auth data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('organization');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you'd make an API call to authenticate
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
      };

      const mockOrg: Organization = {
        id: '1',
        name: 'Demo Organization',
        slug: 'demo-org',
        contactEmail: 'admin@demo.com',
      };

      // Store auth data
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('organization', JSON.stringify(mockOrg));

      setUser(mockUser);
      setOrganization(mockOrg);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    setUser(null);
    setOrganization(null);
  };

  const updateOrganization = (org: Organization) => {
    setOrganization(org);
    localStorage.setItem('organization', JSON.stringify(org));
  };

  const value: AuthContextType = {
    user,
    organization,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setOrganization: updateOrganization,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
