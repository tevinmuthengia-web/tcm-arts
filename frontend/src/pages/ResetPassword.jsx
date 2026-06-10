import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Password reset successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Failed to reset password');
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
          <h2 style={{ marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Enter your new password below.
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
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-gold" 
              style={{ width: '100%' }}
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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