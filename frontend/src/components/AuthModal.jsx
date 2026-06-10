import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { setUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`);
      onClose();
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      showToast(`Welcome to TCM Arts, ${data.user.name}!`);
      onClose();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');
    setResetError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResetMessage(data.message || 'If an account exists, a reset link has been sent. Check the server logs for the link.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setResetMessage('');
          setEmail('');
        }, 5000);
      } else {
        setResetError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setResetError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password View
  if (isForgotPassword) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
      }} onClick={onClose}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '450px',
          width: '90%',
          position: 'relative',
          border: '1px solid var(--border-color)'
        }} onClick={e => e.stopPropagation()}>
          
          <button onClick={() => {
            setIsForgotPassword(false);
            setResetMessage('');
            setResetError('');
          }} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <X size={24} />
          </button>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Forgot Password?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {resetMessage && (
            <div style={{ 
              background: 'rgba(16,185,129,0.1)', 
              border: '1px solid #10b981', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#10b981',
              fontSize: '0.85rem'
            }}>
              {resetMessage}
            </div>
          )}

          {resetError && (
            <div style={{ 
              background: 'rgba(244,63,94,0.1)', 
              border: '1px solid #f43f5e', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#f43f5e',
              fontSize: '0.85rem'
            }}>
              {resetError}
            </div>
          )}

          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-gold" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => {
                setIsForgotPassword(false);
                setResetMessage('');
                setResetError('');
              }}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login/Register View
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '450px',
        width: '90%',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              color: activeTab === 'login' ? 'var(--gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'login' ? '2px solid var(--gold)' : 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              flex: 1
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              color: activeTab === 'register' ? 'var(--gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'register' ? '2px solid var(--gold)' : 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              flex: 1
            }}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                style={{ 
                  color: 'var(--gold)', 
                  fontSize: '0.8rem', 
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Forgot Password?
              </button>
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
