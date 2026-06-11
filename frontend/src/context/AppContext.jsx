import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [siteContent, setSiteContent] = useState({});
  const [toast, setToast] = useState({ message: null, type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: 'success' }), 4000);
  };

  const reloadContent = async () => {
    try {
      const content = await api.content.get();
      setSiteContent(content);
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tcm_token');
    if (token) {
      api.auth.me().then(userData => {
        setUser(userData.user);
      }).catch(() => {
        localStorage.removeItem('tcm_token');
        localStorage.removeItem('tcm_user');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    reloadContent();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      loading,
      showAuthModal,
      setShowAuthModal,
      authModalTab,
      setAuthModalTab,
      siteContent,
      reloadContent,
      showToast,
      toast
    }}>
      {children}
    </AppContext.Provider>
  );
};