import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Users, Award, ChevronRight } from 'lucide-react';

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
    <div className="animate-fade-in" style={{ 
      padding: '40px 0 80px 0',
      overflowX: 'hidden',
      maxWidth: '100%'
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1>{content.title}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            {content.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid-3" style={{ marginBottom: '60px' }}>
          {['Balance', 'Plasticity', 'Focus', 'Speed', 'Agility', 'Strength'].map((benefit, index) => (
            <div key={index} className="glass-card glow-skate" style={{ textAlign: 'center' }}>
              <h3>{benefit}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Professional skating development</p>
            </div>
          ))}
        </div>

        {/* Classes Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Private 1-on-1 Classes</h2>
          <div className="grid-2">
            {classes.map(classItem => (
              <div key={classItem.id} className="glass-card glow-skate">
                <h3>{classItem.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{classItem.description}</p>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ color: 'var(--gold)' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    {classItem.schedule}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                    Ksh {classItem.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedClass(classItem);
                      setShowBooking(true);
                    }}
                    className="btn btn-indigo"
                  >
                    Book Now <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Section */}
        <div className="glass-card glow-skate">
          <div className="grid-2" style={{ textAlign: 'center' }}>
            <div>
              <h3>Annual Pass</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                  Ksh {content.membershipPrice?.toLocaleString() || '15,000'}
                </span>
                <span> / year</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', maxWidth: '280px', margin: '0 auto' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="var(--gold)" /> Unlimited access to facilities
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--gold)" /> Community meetups
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--gold)" /> Equipment discounts
                </li>
              </ul>
            </div>
            
            <div>
              <h3>Drop-in Session</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                  Ksh 1,500
                </span>
                <span> / session</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', maxWidth: '280px', margin: '0 auto' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="var(--gold)" /> Single session access
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            padding: '32px',
            maxWidth: '500px',
            width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <h3>Book {selectedClass.title}</h3>
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
