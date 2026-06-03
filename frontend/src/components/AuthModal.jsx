import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const { 
    setShowAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    setUser, 
    showToast 
  } = useApp();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalTab === 'register') {
        if (!name || !email || !password) {
          throw new Error('All fields are required.');
        }
        const data = await api.auth.register(name, email, password);
        setUser(data.user);
        showToast(`Welcome to TCM Arts, ${data.user.name}!`);
      } else {
        if (!email || !password) {
          throw new Error('Email and password are required.');
        }
        const data = await api.auth.login(email, password);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`);
      }
      
      setShowAuthModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWdith: '450px',
          maxWidth: '450px',
          margin: '20px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <X size={20} />
        </button>

        {/* Brand Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #d4af37, #6366f1, #10b981)',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Sparkles size={24} color="#000" strokeWidth={2.5} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>TCM Arts Access</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free membership & dynamic panel</p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '24px'
        }}>
          <button 
            onClick={() => { setAuthModalTab('login'); setError(''); }}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: authModalTab === 'login' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: authModalTab === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => { setAuthModalTab('register'); setError(''); }}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: authModalTab === 'register' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: authModalTab === 'register' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {authModalTab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control focus-skate" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control focus-skate" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control focus-skate" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-indigo"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Authenticating...' : authModalTab === 'register' ? 'Register Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
