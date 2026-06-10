import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'If an account exists, a reset link has been sent.');
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <h2 style={{ marginBottom: '8px' }}>Forgot Password?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && (
            <div style={{ 
              background: 'rgba(16,185,129,0.1)', 
              border: '1px solid #10b981', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#10b981'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ 
              background: 'rgba(244,63,94,0.1)', 
              border: '1px solid #f43f5e', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#f43f5e'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}