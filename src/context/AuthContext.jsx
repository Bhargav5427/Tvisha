import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is an active session in local storage
    const storedUser = localStorage.getItem('tvisha_auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Set up Supabase auth listener if supabase is configured
    const isConfigured = !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const email = session.user.email;
          const role = email === 'admin@tvisha.com' ? 'ADMIN' : 'CUSTOMER';
          const newUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || email.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || '',
            role: role
          };
          setUser(newUser);
          localStorage.setItem('tvisha_auth_user', JSON.stringify(newUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('tvisha_auth_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loginWithGoogle = async (mockRole = null) => {
    const isConfigured = !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    
    if (isConfigured && !mockRole) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (err) {
        console.error('Supabase Google OAuth failed, triggering mock login:', err.message);
        triggerMockLogin(mockRole || 'CUSTOMER');
      }
    } else {
      // Fallback mock login for local development/presentation
      triggerMockLogin(mockRole || 'CUSTOMER');
    }
  };

  const triggerMockLogin = (role) => {
    const mockUser = {
      id: role === 'ADMIN' ? 'admin-123' : 'customer-123',
      email: role === 'ADMIN' ? 'admin@tvisha.com' : 'priya.sharma@example.com',
      name: role === 'ADMIN' ? 'Admin User' : 'Priya Sharma',
      avatar: role === 'ADMIN' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuARJNhs9ezTOL3Uks2H9st5c8W8B3z6sgmrH-wj-SI05tBhEeBjLON8zgB4JztxvXp44FW1MnGFeEn_XQ2Wxw-PRC2CEUqVVSasFeGWH2969vIQsLDcVo-aTlsJs2mKipsQ306tbnmogZT4LGhPgFvXT8AM2VJl1KDVyxeuuEIGXgkrtz-ExPLILKW6UoO4RAmw4YV7JMkRhZaT0NaVTBGV512Fgtx04050MbKikSix_PRbS2ZPAMtEGXMsOcD2WS135TGPQe512vA' 
        : '',
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('tvisha_auth_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    const isConfigured = !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('tvisha_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
