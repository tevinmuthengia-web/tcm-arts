import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FloatingSocials from './components/FloatingSocials';

import Home from './pages/Home';
import FineArts from './pages/FineArts';
import Skating from './pages/Skating';
import Chess from './pages/Chess';
import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

import { api } from './utils/api';

// Create Global Application Context
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [siteContent, setSiteContent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [loading, setLoading] = useState(true);

  // Trigger temporary notification toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch initial content and verify active session token
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const content = await api.content.get();
      setSiteContent(content);
      
      const loggedUser = await api.auth.getCurrentUser();
      if (loggedUser) {
        setUser(loggedUser);
      }
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Update backend siteContent state locally to display dynamic live changes
  const reloadContent = async () => {
    try {
      const content = await api.content.get();
      setSiteContent(content);
    } catch (err) {
      console.error("Failed to sync site copy:", err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0c',
        color: '#d4af37',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(212, 175, 55, 0.1)',
          borderTop: '4px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', letterSpacing: '0.1em', fontWeight: '500' }}>TCM ARTS LOADING...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      siteContent,
      setSiteContent,
      reloadContent,
      showAuthModal,
      setShowAuthModal,
      authModalTab,
      setAuthModalTab,
      showToast,
      toast
    }}>
      <Router>
        <div className="app-container">
          <Navbar />
          
          <main className="main-content">
            {/* Custom Toast Alert */}
            {toast && (
              <div style={{
                position: 'fixed',
                top: '100px',
                right: '30px',
                zIndex: 9999,
                padding: '16px 24px',
                borderRadius: '16px',
                background: 'rgba(20, 20, 25, 0.85)',
                backdropFilter: 'blur(10px)',
                borderLeft: `5px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: "'Inter', sans-serif",
                color: '#fff',
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✨' : '⚠️'}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Success' : 'Attention'}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>{toast.message}</p>
                </div>
                <style>{`
                  @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                  }
                `}</style>
              </div>
            )}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fine-arts" element={<FineArts />} />
              <Route path="/skating" element={<Skating />} />
              <Route path="/chess" element={<Chess />} />
              <Route path="/bookings" element={<Bookings />} />
              
              {/* Member Dashboard Route */}
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/" replace />} 
              />
              
              {/* Admin Console Route */}
              <Route 
                path="/admin" 
                element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" replace />} 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          
          {/* Floating Actions for WhatsApp & Instagram */}
          <FloatingSocials />
          
          {/* Global Auth Overlay Modal */}
          {showAuthModal && <AuthModal />}
        </div>
      </Router>
    </AppContext.Provider>
  );
}
