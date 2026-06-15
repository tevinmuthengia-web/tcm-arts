import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Palette, Compass, Crown, Sparkles, Brain, ArrowRight, Instagram, MessageCircle } from 'lucide-react';
import { Helmet } from '@vuer-ai/react-helmet-async';

export default function Home() {
  const { siteContent, user } = useApp();
  const hero = siteContent?.hero || {
    title: "The Common Mass Arts (TCM Arts)",
    subtitle: "Cultivating Social Well-being, Balance & Harmony",
    description: "A diverse creative hub designed to enhance brain plasticity, cognitive focus, coordination, and physical poise. Experience the beautiful intersection of Fine Arts, Slalom Skating, and Chess.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop"
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>TCM Arts | Fine Arts, Skating & Chess Training in Kenya</title>
        <meta name="description" content="TCM Arts offers professional fine arts classes, skating academy training, and chess coaching in Kenya. Join our community for creative and cognitive development." />
        <meta name="keywords" content="fine arts Kenya, skating lessons Nairobi, chess training Kenya, art classes, skating academy, chess coaching" />
        <link rel="canonical" href="https://tcm-arts.onrender.com/" />
        <meta property="og:title" content="TCM Arts | Fine Arts, Skating & Chess Training" />
        <meta property="og:description" content="Professional arts, skating, and chess training in Kenya. Join our community today!" />
        <meta property="og:url" content="https://tcm-arts.onrender.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TCM Arts | Fine Arts, Skating & Chess Training" />
        <meta name="twitter:description" content="Professional arts, skating, and chess training in Kenya." />
      </Helmet>

      <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
        
        {/* 1. HERO SECTION */}
        <section style={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95)), url(${hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--border-color)',
          padding: '80px 0'
        }}>
          <div className="container">
            <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', width: 'fit-content' }}>
                <Sparkles size={14} color="#d4af37" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social Well-Being Hub</span>
              </div>
              
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                lineHeight: '1.1',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800
              }}>
                {hero.title}
              </h1>
              
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)'
              }}>
                {hero.subtitle}
              </h2>
              
              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                lineHeight: '1.7'
              }}>
                {hero.description}
              </p>

              {user && user.role === 'admin' && (
                <div style={{ display: 'inline-flex', gap: '10px' }}>
                  <Link to="/admin" className="btn btn-gold" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
                    ✏️ Quick Edit Live Text
                  </Link>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
                <Link to="/fine-arts" className="btn btn-gold">
                  Explore Art <ArrowRight size={16} />
                </Link>
                <Link to="/skating" className="btn btn-secondary">
                  Learn Skating
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE THREE PILLARS GATEWAY */}
        <section style={{ marginTop: '80px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Our Core Pillars</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Discover how we connect creative fine arts, active slalom skating, and strategic chess to enhance mind-body synchronization.
              </p>
            </div>

            <div className="grid-3">
              {/* Fine Arts Card */}
              <div className="glass-card glow-art" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <Palette size={26} color="#d4af37" />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Fine Arts</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flexGrow: 1 }}>
                  Custom portrait commissions, contextual arts, and classes across pencil, oil, acrylics, pastels, and watercolors.
                </p>
                <Link to="/fine-arts" className="btn btn-gold" style={{ width: '100%' }}>
                  Enter Studio
                </Link>
              </div>

              {/* Skating Card */}
              <div className="glass-card glow-skate" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <Compass size={26} color="#6366f1" />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Skating</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flexGrow: 1 }}>
                  Improve balance, coordination, and brain plasticity. We train slalom freestyle, offer memberships, and manage marketing activations.
                </p>
                <Link to="/skating" className="btn btn-indigo" style={{ width: '100%' }}>
                  Join Academy
                </Link>
              </div>

              {/* Chess Card */}
              <div className="glass-card glow-chess" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <Crown size={26} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Chess</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flexGrow: 1 }}>
                  Elevate strategic analysis and focus. Private tutoring packages and standard memberships for all skill levels.
                </p>
                <Link to="/chess" className="btn btn-emerald" style={{ width: '100%' }}>
                  Enter Chess Club
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SCIENTIFIC CONNECTION SECTION */}
        <section style={{ marginTop: '100px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '80px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '50px', alignItems: 'center' }} className="grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', width: 'fit-content' }}>
                  <Brain size={14} color="#6366f1" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cognitive Fitness</span>
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
                  Enhancing Brain Plasticity & Neural Coordination
                </h2>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                  Brain plasticity (neuroplasticity) is the brain's ability to reorganize itself by forming new neural pathways. By engaging in multiple, distinct disciplines, we stimulate various regions of the brain:
                </p>
                
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                  <li><strong>Fine Arts:</strong> Sparks creative right-brain visual processing and enhances motor skills.</li>
                  <li><strong>Skating (Slalom):</strong> Exercises the cerebellum, responsible for motor control, balance, and spatial coordination.</li>
                  <li><strong>Chess:</strong> Trains logical left-brain analytics, memory retrieval, foresight, and problem-solving.</li>
                </ul>
              </div>

              <div style={{ position: 'relative' }}>
                <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff' }}>The Well-being Synergy</div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    "When you alternate strategic calculations in chess, physical flow sequences in slalom skating, and artistic expressions in drawing, you build rich neural connections. This hybrid training reduces cognitive stress, increases motor reaction speeds, and unlocks a unique creative state of balance."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #6366f1, #10b981)' }}></div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>TCM Research Lab</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Neurological Well-being Studies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DYNAMIC SOCIAL CTA SECTION */}
        <section style={{ marginTop: '80px', marginBottom: '40px' }}>
          <div className="container">
            <div className="glass-card" style={{
              padding: '50px 40px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.9), rgba(10, 10, 12, 0.95))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Ambient background glows */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '300px',
                height: '300px',
                background: 'rgba(212, 175, 55, 0.12)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-50%',
                right: '-20%',
                width: '300px',
                height: '300px',
                background: 'rgba(99, 102, 241, 0.12)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}></div>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Get In Touch
                </div>

                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: '#fff',
                  maxWidth: '650px',
                  lineHeight: '1.2'
                }}>
                  Connect Directly with TCM Arts
                </h2>

                <p style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '600px',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  margin: '0 auto 10px auto'
                }}>
                  Have questions about our Fine Arts commissions, Slalom Skating, or Chess programs? Reach out directly via WhatsApp or follow our journey on Instagram!
                </p>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '15px'
                }}>
                  {/* WhatsApp button */}
                  <a
                    href="https://wa.me/254745728614?text=Hello%20TCM%20Arts!%20I'd%20like%20to%20inquire%20about%20your%20art,%20skating,%20and%20chess%20programs."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.05rem',
                      padding: '14px 28px',
                      borderRadius: '14px',
                      background: '#25d366',
                      border: '1px solid rgba(37, 211, 102, 0.2)',
                      color: '#000',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }}
                    className="social-cta-btn whatsapp-cta"
                  >
                    <MessageCircle size={20} />
                    <span>Chat on WhatsApp</span>
                  </a>

                  {/* Instagram button */}
                  <a
                    href="https://www.instagram.com/thecommonmass?igsh=MTBtZGhjOWwxYXk4aA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.05rem',
                      padding: '14px 28px',
                      borderRadius: '14px',
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(220, 39, 67, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }}
                    className="social-cta-btn instagram-cta"
                  >
                    <Instagram size={20} />
                    <span>Follow on Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
