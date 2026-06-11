import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import FineArts from './pages/FineArts';
import Skating from './pages/Skating';
import Chess from './pages/Chess';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Bookings from './pages/Bookings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { api } from './utils/api';

// Create and export the Context (MUST be outside the App function)
export const AppContext = React.createContext(null);

// Export useApp hook (MUST be outside the App function)
export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function App() {
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

  const value = {
    user,
    setUser,
    loading,
    showAuthModal,
    setShowAuthModal,
    authModalTab,
    setAuthModalTab,
    siteContent,
    reloadContent,
    showToast
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="loading-spinner-large"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fine-arts" element={<FineArts />} />
            <Route path="/skating" element={<Skating />} />
            <Route path="/chess" element={<Chess />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
          <Footer />
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
          {toast.message && (
            <div className={`toast toast-${toast.type}`} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100 }}>
              {toast.message}
            </div>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
