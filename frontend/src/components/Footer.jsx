import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#070709',
      borderTop: '1px solid var(--border-color)',
      padding: '60px 0 30px 0',
      marginTop: 'auto',
      fontFamily: "var(--font-body)",
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '40px',
          marginBottom: '40px'
        }} className="footer-grid">
          
          {/* Logo & Philosophy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
              <div style={{
                background: 'linear-gradient(135deg, #d4af37, #6366f1, #10b981)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>TCM <span style={{ fontWeight: 300, color: '#d4af37' }}>ARTS</span></span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '340px' }}>
              A collective space aiming to boost cognitive plasticity, strategy, physical balance, and coordination using art, skating, and board games.
            </p>
            
            {/* Instagram & WhatsApp Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a 
                href="https://www.instagram.com/thecommonmass?igsh=MTBtZGhjOWwxYXk4aA==" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Follow us on Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                className="social-btn instagram-glow"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>

              <a 
                href="https://wa.me/254745728614?text=Hello%20TCM%20Arts!%20I'd%20like%20to%20inquire%20about%20your%20art,%20skating,%20and%20chess%20programs." 
                target="_blank" 
                rel="noopener noreferrer"
                title="Chat with us on WhatsApp"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                className="social-btn whatsapp-glow"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>Programs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', padding: 0 }}>
              <li><Link to="/fine-arts" style={{ color: 'inherit', textDecoration: 'none' }}>Fine Arts Classes</Link></li>
              <li><Link to="/fine-arts" style={{ color: 'inherit', textDecoration: 'none' }}>Portrait Commissions</Link></li>
              <li><Link to="/skating" style={{ color: 'inherit', textDecoration: 'none' }}>Slalom Training</Link></li>
              <li><Link to="/skating" style={{ color: 'inherit', textDecoration: 'none' }}>Skating Memberships</Link></li>
              <li><Link to="/chess" style={{ color: 'inherit', textDecoration: 'none' }}>Chess Tutoring</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', padding: 0 }}>
              <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>My Bookings</Link></li>
              <li><Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>Contact & Spot</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--color-skate)" /> thecommonmass@gmail.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--color-chess)" /> +254 745 728614
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--color-art)" /> The Common Mass Hub, Nairobi
              </li>
            </ul>
          </div>

        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '30px 0' }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <p>© {new Date().getFullYear()} The Common Mass Arts (TCM Arts). All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Well-being</span>
            <span>Plasticity</span>
            <span>Coordination</span>
          </div>
        </div>

      </div>

      <style>{`
        .social-btn:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          transform: scale(1.1);
        }
        .social-btn.instagram-glow:hover {
          color: #e1306c !important;
          box-shadow: 0 0 15px rgba(225, 48, 108, 0.4);
          border-color: #e1306c !important;
        }
        .social-btn.whatsapp-glow:hover {
          color: #25d366 !important;
          box-shadow: 0 0 15px rgba(37, 211, 102, 0.4);
          border-color: #25d366 !important;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
