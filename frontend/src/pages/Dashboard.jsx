import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { User, Calendar, Brush, Shield, HelpCircle, Compass, Crown } from 'lucide-react';

export default function Dashboard() {
  const { user } = useApp();
  const [bookings, setBookings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const myBookings = await api.bookings.getMy();
      setBookings(myBookings);

      const myCommissions = await api.commissions.getMy();
      setCommissions(myCommissions);
    } catch (err) {
      console.error("Failed to load member profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading dashboard details...
      </div>
    );
  }

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'fine-arts':
        return <span className="badge badge-art">Fine Arts</span>;
      case 'skating':
        return <span className="badge badge-skate">Skating</span>;
      case 'chess':
        return <span className="badge badge-chess">Chess</span>;
      default:
        return <span className="badge badge-gray">{category}</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'fine-arts':
        return <Brush size={18} color="#d4af37" />;
      case 'skating':
        return <Compass size={18} color="#6366f1" />;
      case 'chess':
        return <Crown size={18} color="#10b981" />;
      default:
        return <User size={18} />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* 1. MEMBER USER PROFILE CARD */}
        <section style={{ marginBottom: '40px' }}>
          <div className="glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(22,22,26,0.8), rgba(99,102,241,0.06))',
            padding: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
            }}>
              <User size={32} color="#fff" />
            </div>

            <div style={{ flexGrow: 1 }}>
              <span className="badge badge-gray" style={{ marginBottom: '6px' }}>
                {user?.role === 'admin' ? '🗝️ Administrator' : '✨ Free Member'}
              </span>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>
                {user?.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Registered email: {user?.email}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: '12px 20px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>
                  {bookings.length}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Bookings</div>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
              <div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>
                  {commissions.length}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Portraits</div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }} className="grid-2">
          
          {/* 2. ENROLLED CLASSES TABLE */}
          <section>
            <div className="glass-card" style={{ padding: '30px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Calendar size={22} color="var(--color-skate)" />
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                  Enrolled Classes & Training Slots
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(book => (
                  <div key={book.id} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getCategoryIcon(book.classCategory)}
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{book.classTitle}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{book.schedule}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      {getCategoryBadge(book.classCategory)}
                      <span className="badge badge-gray" style={{ fontSize: '0.65rem', border: 'none', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        {book.status}
                      </span>
                    </div>
                  </div>
                ))}

                {bookings.length === 0 && (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <HelpCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>You haven't booked any classes or slots yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. PORTRAIT COMMISSIONS LIST */}
          <section>
            <div className="glass-card" style={{ padding: '30px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Brush size={22} color="var(--color-art)" />
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                  Custom Portrait Requests
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {commissions.map(comm => (
                  <div key={comm.id} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-art">{comm.medium}</span>
                      <span className="badge badge-gray" style={{
                        fontSize: '0.7rem',
                        backgroundColor: comm.status === 'Pending Review' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                        color: comm.status === 'Pending Review' ? '#f59e0b' : '#10b981',
                        border: 'none'
                      }}>
                        {comm.status}
                      </span>
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>
                      Size: {comm.size}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                      "{comm.description}"
                    </p>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                      Target Date: {comm.targetDate}
                    </div>
                  </div>
                ))}

                {commissions.length === 0 && (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <HelpCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>You haven't requested any portrait commissions yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
