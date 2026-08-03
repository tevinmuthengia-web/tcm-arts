import React, { useState } from 'react';
import { MessageSquare, Instagram, MessageCircle, X } from 'lucide-react';

export default function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 9998,
      fontFamily: "var(--font-body)",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '12px'
    }}>
      
      {/* 1. EXPANDED SOCIAL MENU */}
      {isOpen && (
        <div style={{
          background: 'rgba(20, 20, 25, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '220px',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <h4 style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            paddingBottom: '6px',
            fontFamily: "var(--font-heading)"
          }}>
            Connect with TCM Arts
          </h4>

          {/* WhatsApp Direct Link */}
          <a 
            href="https://wa.me/254745728614?text=Hello%20TCM%20Arts!%20I'd%20like%20to%20inquire%20about%20your%20art,%20skating,%20and%20chess%20programs." 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(37, 211, 102, 0.08)',
              border: '1px solid rgba(37, 211, 102, 0.2)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
            className="menu-social-btn whatsapp-menu-btn"
          >
            <div style={{ color: '#25d366', display: 'flex', alignItems: 'center' }}>
              <MessageCircle size={18} />
            </div>
            <span>WhatsApp Chat</span>
          </a>

          {/* Instagram Profile Link */}
          <a 
            href="https://www.instagram.com/_tcm.art"
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(225, 48, 108, 0.08)',
              border: '1px solid rgba(225, 48, 108, 0.2)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
            className="menu-social-btn instagram-menu-btn"
          >
            <div style={{ color: '#e1306c', display: 'flex', alignItems: 'center' }}>
              <Instagram size={18} />
            </div>
            <span>Instagram Feed</span>
          </a>
        </div>
      )}

      {/* 2. FLOATING TRIGGER BUBBLE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #6366f1, #10b981)',
          border: 'none',
          color: '#000',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          animation: 'pulseGlow 2.5s infinite'
        }}
        className="floating-bubble"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(15px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3); transform: scale(1); }
          50% { box-shadow: 0 8px 35px rgba(99, 102, 241, 0.5); transform: scale(1.05); }
        }
        .menu-social-btn:hover {
          transform: translateX(-3px);
        }
        .whatsapp-menu-btn:hover {
          background: rgba(37, 211, 102, 0.15) !important;
          border-color: rgba(37, 211, 102, 0.4) !important;
        }
        .instagram-menu-btn:hover {
          background: rgba(225, 48, 108, 0.15) !important;
          border-color: rgba(225, 48, 108, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
