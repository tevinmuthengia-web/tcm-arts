import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { Crown, BookOpen, Trophy, Shield, Calendar, Award } from 'lucide-react';

export default function Chess() {
  const { siteContent, user, setShowAuthModal, setAuthModalTab, showToast } = useApp();
  const [classes, setClasses] = useState([]);

  const fetchChessData = async () => {
    try {
      const allClasses = await api.classes.get();
      // Filter chess category
      setClasses(allClasses.filter(c => c.category === 'chess'));
    } catch (err) {
      console.error("Failed to load chess details:", err);
    }
  };

  useEffect(() => {
    fetchChessData();
  }, []);

  const handleBookClass = async (classId, classTitle) => {
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
      showToast("Please register or login to book chess training.", "error");
      return;
    }

    try {
      await api.bookings.create(classId);
      showToast(`Successfully registered for ${classTitle}! Check your dashboard.`);
    } catch (err) {
      showToast(err.message || "Failed to book class.", "error");
    }
  };

  const pageTexts = siteContent?.chess || {
    title: "Chess & Mind Sports",
    description: "Sharpen your intellect, enhance strategic thinking, and build focus. Join our chess community for private tutoring and casual or competitive board gaming.",
    tutoringIntro: "From mastering opening theories to endgame strategies, our personalized 1-on-1 tutoring sessions cater to beginners, intermediate players, and advanced competitors."
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      
      {/* 1. HEADER */}
      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: '16px'
          }}>
            <Crown size={14} color="#10b981" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intellectual agility & concentration</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>{pageTexts.title}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
            {pageTexts.description}
          </p>
        </div>
      </section>

      {/* 2. CHESS PHILOSOPHY & CLUBS */}
      <section style={{ marginBottom: '80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }} className="grid-2">
            
            {/* Tutoring Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                Cognitive Growth Through Play
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                Chess is more than a game—it's a cerebral framework. By anticipating your opponent's moves, checking geometric board balances, and devising tactics, you train pattern recognition, working memory capacity, and mental discipline.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                {pageTexts.tutoringIntro}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }} className="grid-2">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><BookOpen size={16} /></div>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>Theory & Tactics</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Trophy size={16} /></div>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>Tournament Prep</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Shield size={16} /></div>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>Bespoke Analysis</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Award size={16} /></div>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>All Skill Levels</span>
                </div>
              </div>
            </div>

            {/* Visual Board Game Frame */}
            <div 
              className="glass-card glow-chess"
              style={{
                backgroundImage: 'linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.95)), url("https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Crown size={26} color="#10b981" />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                  Weekly Club Tournaments
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto 20px auto' }}>
                  Join us every Friday evening for blitz matches, rapid evaluations, and social analytics over tea.
                </p>
                <button 
                  onClick={() => showToast("Simulated Registration: Registered for the Friday Blitz Arena!")}
                  className="btn btn-emerald" 
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Join Friday Blitz
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COURSES SCHEDULE */}
      <section style={{ marginBottom: '80px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
            📚 Chess Tutoring & Classes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '700px' }}>
            Personalized learning blocks and active workshops. Secure your slot dynamically.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {classes.map(c => (
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
            ))}
            {classes.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active chess classes available. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CLUB MEMBERSHIP */}
      <section>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Chess Club Membership</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Get standard access to boards, chess clocks, and ranking evaluations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px', margin: '0 auto' }} className="grid-2">
            {/* Casual Board Membership */}
            <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>Casual Player</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                Ksh {pageTexts.casualPrice ? Number(pageTexts.casualPrice).toLocaleString() : '4,000'} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ year</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flexGrow: 1 }}>
                Access to casual boards and clocks inside our gaming space on weekdays. Discounted tea and coffee, and invitations to open blitz nights.
              </p>
              <button 
                onClick={() => showToast("Simulated Casual Sign-up: Registered for the Casual Club Membership!")}
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '10px' }}
              >
                Join Casual Club
              </button>
            </div>

            {/* Competitive Pro Membership */}
            <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid var(--color-chess)' }}>
              <div className="badge badge-chess" style={{ alignSelf: 'flex-start' }}>Highly Strategic</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>Pro Competitor</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                Ksh {pageTexts.proPrice ? Number(pageTexts.proPrice).toLocaleString() : '10,000'} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ year</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flexGrow: 1 }}>
                Full access to all boards, speed chess clocks, official rated rankings tournaments, 20% discount on 1-on-1 private grandmaster masterclass scheduling.
              </p>
              <button 
                onClick={() => showToast("Simulated Pro Sign-up: Registered for the Pro Competitor Membership!")}
                className="btn btn-emerald" 
                style={{ width: '100%', padding: '10px' }}
              >
                Go Pro Competitive
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
