import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Palette, Compass, Crown, User, Settings, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, setUser, setShowAuthModal, setAuthModalTab, showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tcm_token');
    localStorage.removeItem('tcm_user');
    showToast("Logged out successfully.");
    navigate('/');
    setMobileMenuOpen(false);
  };

  const openAuth = (tab) => {
    setAuthModalTab(tab);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }} onClick={() => setMobileMenuOpen(false)}>
          <img 
            src="/tcm-logo.png" 
            alt="TCM Arts Logo" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
              border: '1px solid rgba(212,175,55,0.2)'
            }} 
          />
          <div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.05em' }}>TCM</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: '1.3rem', color: '#d4af37', marginLeft: '4px' }}>ARTS</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link 
            to="/fine-arts" 
            className="nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isActive('/fine-arts') ? '#d4af37' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              background: isActive('/fine-arts') ? 'rgba(212,175,55,0.08)' : 'transparent',
              border: isActive('/fine-arts') ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent'
            }}
          >
            <Palette size={16} /> Fine Arts
          </Link>
          
          <Link 
            to="/skating" 
            className="nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isActive('/skating') ? '#6366f1' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              background: isActive('/skating') ? 'rgba(99,102,241,0.08)' : 'transparent',
              border: isActive('/skating') ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent'
            }}
          >
            <Compass size={16} /> Skating
          </Link>

          <Link 
            to="/chess" 
            className="nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isActive('/chess') ? '#10b981' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              background: isActive('/chess') ? 'rgba(16,185,129,0.08)' : 'transparent',
              border: isActive('/chess') ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent'
            }}
          >
            <Crown size={16} /> Chess
          </Link>

          <Link 
            to="/bookings" 
            className="nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isActive('/bookings') ? '#d4af37' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              background: isActive('/bookings') ? 'rgba(212,175,55,0.08)' : 'transparent',
              border: isActive('/bookings') ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent'
            }}
          >
            <Sparkles size={16} /> Book Now
          </Link>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>

          {/* User Operations */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                to="/dashboard" 
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isActive('/dashboard') ? '#fff' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  background: isActive('/dashboard') ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: '1px solid var(--border-color)'
                }}
              >
                <User size={16} /> Member Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="nav-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isActive('/admin') ? '#d4af37' : '#9e9e9e',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    background: isActive('/admin') ? 'rgba(212,175,55,0.08)' : 'transparent',
                    border: '1px solid rgba(212,175,55,0.2)'
                  }}
                >
                  <Settings size={16} /> Admin Panel
                </Link>
              )}

              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ef4444',
                  background: 'transparent',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => openAuth('login')}
                style={{
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => openAuth('register')}
                className="btn btn-indigo"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.95rem'
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburguer Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'none' /* Will override via stylesheet below */
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          width: '100%',
          background: '#0a0a0c',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 999
        }}>
          <Link to="/fine-arts" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
            <Palette size={18} color="#d4af37" /> Fine Arts
          </Link>
          <Link to="/skating" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
            <Compass size={18} color="#6366f1" /> Skating
          </Link>
          <Link to="/chess" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
            <Crown size={18} color="#10b981" /> Chess
          </Link>
          <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
            <Sparkles size={18} color="#d4af37" /> Book Now
          </Link>
          
          <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />
          
          {user ? (
            <>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={18} /> Admin Panel
                </Link>
              )}
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  color: '#ef4444',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <LogOut size={18} /> Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => openAuth('login')}
                style={{
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  padding: '12px',
                  borderRadius: '10px',
                  width: '100%'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => openAuth('register')}
                className="btn btn-indigo"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  width: '100%'
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      {/* Responsive media style injection */}
      <style>{`
        @media (max-width: 850px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
