import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { Palette, Compass, Crown, Calendar, Sparkles, FileText, ShoppingBag, Layers, UserCheck } from 'lucide-react';

export default function Bookings() {
  const { siteContent, user, setShowAuthModal, setAuthModalTab, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('art'); // 'art' | 'skating' | 'chess'
  
  // Classes data state
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Art Commission Form State
  const [medium, setMedium] = useState('Oil on Canvas');
  const [size, setSize] = useState('16x20 inches');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submittingCommission, setSubmittingCommission] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await api.classes.get();
      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes for booking:", err);
      showToast("Could not load class slots. Please try refreshing.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleBookClass = async (classId, classTitle) => {
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
      showToast("Please register or login to book a slot.", "error");
      return;
    }

    try {
      await api.bookings.create(classId);
      showToast(`Successfully registered for ${classTitle}! Check your member dashboard.`);
    } catch (err) {
      showToast(err.message || "Failed to book class.", "error");
    }
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
      showToast("Please login to submit portrait commission requests.", "error");
      return;
    }

    setSubmittingCommission(true);
    try {
      await api.commissions.create({ medium, size, description, targetDate });
      showToast("Art commission request submitted! Our curators will review it shortly.");
      setDescription('');
      setTargetDate('');
    } catch (err) {
      showToast(err.message || "Request failed.", "error");
    } finally {
      setSubmittingCommission(false);
    }
  };

  // Filter classes by category
  const skatingClasses = classes.filter(c => c.category === 'skating');
  const chessClasses = classes.filter(c => c.category === 'chess');

  const baseArtPrice = siteContent?.fineArts?.baseCommissionPrice || 5000;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <section style={{ marginBottom: '50px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} color="#d4af37" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Online Booking Center
            </span>
          </div>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            TCM Booking & Portrait Commissions
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
            Choose a tab below to schedule a session, book into our Mind Sports & Skating academies, or request custom portrait paintings.
          </p>
        </section>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px'
        }}>
          <button 
            onClick={() => setActiveTab('art')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: activeTab === 'art' ? 'rgba(212,175,55,0.08)' : 'transparent',
              color: activeTab === 'art' ? '#d4af37' : 'var(--text-secondary)',
              border: activeTab === 'art' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Palette size={18} /> Portrait Commissions
          </button>
          
          <button 
            onClick={() => setActiveTab('skating')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: activeTab === 'skating' ? 'rgba(99,102,241,0.08)' : 'transparent',
              color: activeTab === 'skating' ? '#6366f1' : 'var(--text-secondary)',
              border: activeTab === 'skating' ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Compass size={18} /> Skating Classes
          </button>
          
          <button 
            onClick={() => setActiveTab('chess')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: activeTab === 'chess' ? 'rgba(16,185,129,0.08)' : 'transparent',
              color: activeTab === 'chess' ? '#10b981' : 'var(--text-secondary)',
              border: activeTab === 'chess' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Crown size={18} /> Chess Classes
          </button>
        </div>

        {/* Non-authenticated banner notice */}
        {!user && (
          <div className="glass-card" style={{
            padding: '20px 30px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px dashed rgba(212,175,55,0.4)',
            backgroundColor: 'rgba(212,175,55,0.02)',
            borderRadius: '16px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserCheck size={24} color="#d4af37" />
              <div>
                <h4 style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>Want to book classes or custom orders?</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>
                  Please login or create a member account first to register your booking details instantly.
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setAuthModalTab('login'); setShowAuthModal(true); }}
              className="btn btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Log In / Register
            </button>
          </div>
        )}

        {/* Tab 1: Art Commissions */}
        {activeTab === 'art' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card glow-art" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Layers size={24} color="#d4af37" />
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                  Order Custom Portraits & Artwork
                </h2>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Commission our talented studio artists for custom graphite sketches, oil canvases, or pastel portraits. 
                Our starting rate is <span style={{ color: '#fff', fontWeight: 700 }}>Ksh {baseArtPrice.toLocaleString()}</span>. 
                Fill out the specifications below, and we will get back to you with pricing details.
              </p>

              <form onSubmit={handleCommissionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Desired Art Medium</label>
                    <select 
                      className="form-control focus-art"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      style={{ appearance: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                      <option value="Oil on Canvas">Oil on Canvas</option>
                      <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                      <option value="Pencil / Pen Sketch">Pencil / Pen Sketch</option>
                      <option value="Watercolor Portrait">Watercolor Portrait</option>
                      <option value="Oil Pastels Visual">Oil Pastels Visual</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dimensions / Size</label>
                    <select 
                      className="form-control focus-art"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option value="8x10 inches">8x10 inches (Small Desk Portrait)</option>
                      <option value="12x16 inches">12x16 inches (Medium Frame)</option>
                      <option value="16x20 inches">16x20 inches (Standard Portrait Size)</option>
                      <option value="24x36 inches">24x36 inches (Large Living Room Canvas)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Artistic Focus</label>
                  <textarea 
                    className="form-control focus-art"
                    rows={4}
                    placeholder="Describe your subject (e.g. landscape background, references, face profile), specific colors or styles..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ maxWidth: '300px' }}>
                  <label className="form-label">Target Completion Date (Optional)</label>
                  <input 
                    type="date" 
                    className="form-control focus-art"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    style={{ color: '#fff' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-gold"
                  disabled={submittingCommission}
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FileText size={16} /> {submittingCommission ? 'Submitting Form...' : 'Submit Commission Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Skating Classes */}
        {activeTab === 'skating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>Loading sessions...</div>
            ) : skatingClasses.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No active Skating sessions available.</div>
            ) : (
              skatingClasses.map(c => (
                <div 
                  key={c.id} 
                  className="glass-card glow-skate" 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(99,102,241,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Compass size={20} color="#6366f1" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{c.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Calendar size={16} />
                      <span>{c.schedule}</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                      Ksh {c.price.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ slot</span>
                    </div>
                    <button 
                      onClick={() => handleBookClass(c.id, c.title)}
                      className="btn btn-indigo"
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      Register Slot
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Chess Classes */}
        {activeTab === 'chess' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>Loading sessions...</div>
            ) : chessClasses.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No active Chess tutoring sessions available.</div>
            ) : (
              chessClasses.map(c => (
                <div 
                  key={c.id} 
                  className="glass-card glow-chess" 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16,185,129,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Crown size={20} color="#10b981" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{c.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Calendar size={16} />
                      <span>{c.schedule}</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                      Ksh {c.price.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ slot</span>
                    </div>
                    <button 
                      onClick={() => handleBookClass(c.id, c.title)}
                      className="btn btn-emerald"
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      Enroll Class
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
