import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { Calendar, Clock, Award, Trash2, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsData, commissionsData] = await Promise.all([
        api.bookings.getMy(),
        api.commissions.getMy()
      ]);
      setBookings(bookingsData);
      setCommissions(commissionsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        showToast('Account deleted successfully');
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete account', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Welcome back, {user?.name}!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="grid-2">
          
          {/* Bookings Section */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} /> My Bookings
            </h2>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(booking => (
                  <div key={booking.id} style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{booking.class_title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {booking.schedule}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>
                      Ksh {booking.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commissions Section */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} /> My Commissions
            </h2>
            {commissions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No commission requests yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {commissions.map(comm => (
                  <div key={comm.id} style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{comm.medium} - {comm.size}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Status: <span style={{ color: comm.status === 'Completed' ? '#10b981' : '#f59e0b' }}>{comm.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Section */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger"
            style={{ backgroundColor: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}
          >
            <Trash2 size={16} /> Delete My Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
          zIndex: 1000
        }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle size={24} color="#f43f5e" />
              <h3 style={{ margin: 0, color: '#f43f5e' }}>Delete Account?</h3>
            </div>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              This action cannot be undone. All your bookings and commissions will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                style={{ flex: 1, backgroundColor: '#f43f5e', color: 'white' }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
