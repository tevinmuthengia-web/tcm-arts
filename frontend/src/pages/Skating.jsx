import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Calendar, Clock, Users, Award, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';

export default function Skating() {
  const { siteContent } = useApp();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      const skatingClasses = data.filter(c => c.category === 'skating');
      setClasses(skatingClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const content = siteContent?.skating || {
    title: 'Skating Academy',
    description: 'The ultimate exercise for fine motor balance, core stability, and bilateral brain coordination. Building instant muscle memory and joint fluidity.',
    membershipPrice: 15000
  };

  return (
    <div className="skating-page animate-fade-in" style={{ 
      padding: '40px 0 80px 0',
      overflowX: 'hidden',
      maxWidth: '100%'
    }}>
      <div className="container" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 20px',
        overflowX: 'hidden'
      }}>
        
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px',
          padding: '0 16px'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '20px'
          }}>
            {content.title}
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
            color: 'var(--text-secondary)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal'
          }}>
            {content.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {['Balance', 'Plasticity', 'Focus', 'Speed', 'Agility', 'Strength'].map((benefit, index) => (
            <div key={index} className="glass-card" style={{ textAlign: 'center', padding: '24px' }}>
              <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', marginBottom: '8px' }}>{benefit}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Professional skating development
              </p>
            </div>
          ))}
        </div>

        {/* Classes Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Private 1-on-1 Classes
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {classes.map(classItem => (
              <div key={classItem.id} className="glass-card glow-skate" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', marginBottom: '12px' }}>
                  {classItem.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  wordWrap: 'break-word',
                  lineHeight: 1.5
                }}>
                  {classItem.description}
                </p>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    {classItem.schedule}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                    Ksh {classItem.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedClass(classItem);
                      setShowBooking(true);
                    }}
                    className="btn btn-indigo"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Book Now <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Section */}
        <div className="glass-card glow-skate" style={{ 
          padding: 'clamp(24px, 5vw, 40px)',
          marginTop: '40px'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>Annual Pass</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 'bold', color: 'var(--gold)' }}>
                  Ksh {content.membershipPrice?.toLocaleString() || '15,000'}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}> / year</span>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                textAlign: 'left',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                <li style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  wordWrap: 'break-word'
                }}>
                  <Award size={16} color="var(--gold)" /> Unlimited access to facilities
                </li>
                <li style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  wordWrap: 'break-word'
                }}>
                  <Users size={16} color="var(--gold)" /> Community meetups
                </li>
                <li style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  wordWrap: 'break-word'
                }}>
                  <Clock size={16} color="var(--gold)" /> Equipment discounts
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>Drop-in Session</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 'bold', color: 'var(--gold)' }}>
                  Ksh 1,500
                </span>
                <span style={{ color: 'var(--text-secondary)' }}> / session</span>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                textAlign: 'left',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                <li style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  wordWrap: 'break-word'
                }}>
                  <Award size={16} color="var(--gold)" /> Single session access
                </li>
                <li style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  wordWrap: 'break-word'
                }}>
                  <Users size={16} color="var(--gold)" /> All skill levels welcome
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedClass && (
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
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowBooking(false)}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 40px)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', marginBottom: '20px' }}>
              Book {selectedClass.title}
            </h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              Schedule: {selectedClass.schedule}
            </p>
            <button 
              className="btn btn-gold"
              style={{ width: '100%', marginBottom: '12px' }}
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    alert('Please log in to book a class');
                    setShowBooking(false);
                    return;
                  }
                  const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ classId: selectedClass.id })
                  });
                  if (response.ok) {
                    alert('Class booked successfully!');
                    setShowBooking(false);
                  } else {
                    const error = await response.json();
                    alert(error.error || 'Booking failed');
                  }
                } catch (error) {
                  console.error('Booking error:', error);
                  alert('Failed to book class');
                }
              }}
            >
              Confirm Booking
            </button>
            <button 
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setShowBooking(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
