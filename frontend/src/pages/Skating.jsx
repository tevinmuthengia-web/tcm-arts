import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { Compass, Zap, Award, Target, Calendar, HelpCircle } from 'lucide-react';

export default function Skating() {
  const { siteContent, user, setShowAuthModal, setAuthModalTab, showToast } = useApp();
  const [classes, setClasses] = useState([]);

  const fetchSkatingData = async () => {
    try {
      const allClasses = await api.classes.get();
      // Filter skating category
      setClasses(allClasses.filter(c => c.category === 'skating'));
    } catch (err) {
      console.error("Failed to load skating courses:", err);
    }
  };

  useEffect(() => {
    fetchSkatingData();
  }, []);

  const handleBookClass = async (classId, classTitle) => {
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
      showToast("Please register or login to book training slots.", "error");
      return;
    }

    try {
      await api.bookings.create(classId);
      showToast(`Successfully booked ${classTitle}! Check your dashboard.`);
    } catch (err) {
      showToast(err.message || "Failed to book class.", "error");
    }
  };

  const pageTexts = siteContent?.skating || {
    title: "Skating & Slalom Academy",
    description: "Improve your coordination, balance, and neural plasticity through dynamic movement. We specialize in slalom freestyle training, private classes, and active brand activations.",
    servicesIntro: "Whether you want to navigate slalom cones with high precision, join as an annual member, or schedule brand-enhancing skating activations, we provide world-class training."
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
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '16px'
          }}>
            <Compass size={14} color="#6366f1" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>neural flow & motor coordination</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>{pageTexts.title}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
            {pageTexts.description}
          </p>
        </div>
      </section>

      {/* 2. CORE SERVICES OVERVIEW */}
      <section style={{ marginBottom: '80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="grid-2">
            
            {/* Visual Slalom Card */}
            <div className="glass-card glow-skate" style={{
              backgroundImage: 'linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.95)), url("/skating-photo.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px',
              minHeight: '350px'
            }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '16px' }}>
                Slalom Freestyle Training
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Slalom skating is an artful sport that requires maneuvering around a line of equally spaced cones. It is the ultimate exercise for fine motor balance, core stability, and bilateral brain coordination, building instant muscle memory and joint fluidity.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-skate">Balance</span>
                <span className="badge badge-skate">Plasticity</span>
                <span className="badge badge-skate">Focus</span>
              </div>
            </div>

            {/* Services Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
                Our Professional Services
              </h3>
              
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Advertising, Marketing & Activations</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Hire our synchronized slalom skate crew for products launches, live corporate marketing, commercial videos, and high-energy activations.
                  </p>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Annual Club Membership</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Join the TCM Skate community. Get access to our reserved concrete courses, speed training tracks, equipment discounts, and community flow meetups.
                  </p>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  <Target size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Private 1-on-1 Classes</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Tailored coaching sessions catering to your individual learning pace, specializing in speed, jumps, slides, and freestyle flow combos.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COURSES SCHEDULE */}
      <section style={{ marginBottom: '80px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
            🛹 Training Classes & Slots
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '700px' }}>
            {pageTexts.servicesIntro}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {classes.map(c => (
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
            ))}
          </div>
        </div>
      </section>

      {/* 4. ANNUAL MEMBERSHIP PRICING */}
      <section>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Annual Membership</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Become a full member of our active physical collective.</p>
          </div>

          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', border: '2px solid var(--color-skate)', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div className="badge badge-skate" style={{ alignSelf: 'center' }}>Best Value</div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0, color: '#fff' }}>TCM Skating Pass</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '10px 0' }}>
                Ksh {pageTexts.membershipPrice ? Number(pageTexts.membershipPrice).toLocaleString() : '15,000'} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ year</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Unlimited concrete park access, free entry to slalom speed tests, 15% discount on private coach scheduling, and TCM official jersey.
              </p>
              <button 
                onClick={() => showToast("Simulated Membership Sign-up: Thank you for registering for the Annual Skating Pass!")}
                className="btn btn-indigo" 
                style={{ width: '100%', padding: '14px' }}
              >
                Get Annual Pass
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
