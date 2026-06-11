import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
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

// This component uses the context and must be INSIDE the AppProvider
function AppContent() {
  const { user, loading, showAuthModal, setShowAuthModal, authModalTab, showToast, toast } = useApp();

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
    <>
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
      {toast?.message && (
        <div className={`toast toast-${toast.type}`} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100 }}>
          {toast.message}
        </div>
      )}
    </>
  );
}

// Main App component - AppProvider wraps everything
function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;
