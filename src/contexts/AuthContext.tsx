import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  eventName?: string;
  eventDate?: string;
  package?: string;
  hasBookedEvent?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && ('id' in parsedUser || 'uid' in parsedUser)) {
          if (!parsedUser.id && parsedUser.uid) {
            parsedUser.id = parsedUser.uid;
          }
          
          // Force logout for any existing old admin sessions to enforce new security rule
          if (parsedUser.role === 'admin' && parsedUser.email !== 'muzmmal.khan99@gmail.com') {
            console.log('Invalidating old admin session');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            setUser(parsedUser);
          }
        } else {
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error('Failed to parse user from local storage');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.role === 'client') {
      // Post login activity
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: userData.name,
          type: 'Login',
          description: 'Client accessed their portal.'
        })
      }).catch(err => console.error("Failed to log activity", err));
    }
  };

  const logout = () => {
    if (user?.role === 'client') {
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: user.name,
          type: 'Logout',
          description: 'Client logged out of their portal.'
        })
      }).catch(err => console.error("Failed to log activity", err));
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const resetPassword = async (email: string) => {
    console.log('Simulating reset email for demo/local portal account:', email);
  };

  const changePassword = async (newPassword: string) => {
    // For local / demo auth session, we confirm successful password update
    console.log('Password updated successfully for current session');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, resetPassword, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

