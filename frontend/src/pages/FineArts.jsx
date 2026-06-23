import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { Palette, Layers, Calendar, ShoppingBag, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from '@vuer-ai/react-helmet-async';

export default function FineArts() {
  const { siteContent, user, setShowAuthModal, setAuthModalTab, showToast } = useApp();
  const [gallery, setGallery] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Commission Form State
  const [medium, setMedium] = useState('Oil on Canvas');
  const [size, setSize] = useState('16x20 inches');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submittingCommission, setSubmittingCommission] = useState(false);

  const fetchArtData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching gallery data...");
      const art = await api.gallery.get();
      console.log("Raw gallery data received:", art);
      setGallery(art);
      
      const allClasses = await api.classes.get();
      setClasses(allClasses.filter(c => c.category === 'fine-arts'));
    } catch (err) {
      console.error("Failed to load fine arts details:", err);
      showToast("Error loading gallery. Please refresh.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtData();
  }, []);

  // --- Lightbox handlers ---
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // --- Handlers ---
  const handleBookClass = async (classId, classTitle) => {
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
      showToast("Please register or login to book classes.", "error");
      return;
    }

    try {
      await api.bookings.create(classId);
      showToast(`Successfully registered for ${classTitle}! Check your dashboard.`);
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
      showToast("Commission request submitted! Reviewing details shortly.");
      setDescription('');
      setTargetDate('');
    } catch (err) {
      showToast(err.message || "Request failed.", "error");
    } finally {
      setSubmittingCommission(false);
    }
  };

  const pageTexts = siteContent?.fineArts || {
    title: "Fine Arts Studio",
    description: "Unleash your creativity and master visual expression. From classical commissions to contemporary classes, explore art in its purest forms.",
    classesIntro: "We offer professional, structured fine arts classes across a wide range of mediums including Pencil & Pen sketching, Oil paints, Acrylics, Watercolors, and Oil Pastels."
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px 0 80px 0', textAlign: 'center' }}>
        <div className="container">
          <p>Loading Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Fine Arts Gallery & Classes | TCM Arts Kenya</title>
        <meta name="description" content="Explore our contemporary art gallery, commission custom portraits, or join fine arts classes in drawing, painting, and mixed media. Located in Kenya." />
        <meta name="keywords" content="fine arts Kenya, art gallery Nairobi, portrait commission, painting classes, drawing lessons, TCM Arts" />
        <link rel="canonical" href="https://tcm-arts.onrender.com/fine-arts" />
        <meta property="og:title" content="Fine Arts at TCM Arts | Gallery & Classes" />
        <meta property="og:description" content="Discover original artwork and fine arts training in Kenya. Commission custom portraits or join our classes." />
        <meta property="og:url" content="https://tcm-arts.onrender.com/fine-arts" />
        <meta property="og:type" content="website" />
      </Helmet>

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
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)',
              marginBottom: '16px'
            }}>
              <Palette size={14} color="#d4af37" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Creativity & expression</span>
            </div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>{pageTexts.title}</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
              {pageTexts.description}
            </p>
          </div>
        </section>

        {/* 2. GALLERY GRID */}
        <section style={{ marginBottom: '80px' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              🎨 Contemporary Art Gallery
            </h2>
            
            <div className="grid-3">
              {gallery.length === 0 ? (
                <p>No artwork available in this gallery yet. Check back soon for new pieces.</p>
              ) : (
                gallery.map((art, index) => (
                  <div 
                    key={art.id} 
                    className="glass-card glow-art"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      padding: '16px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Image Wrap with click handler for lightbox */}
                    <div 
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '240px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        marginBottom: '16px',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        isolation: 'isolate'
                      }}
                      onClick={() => openLightbox(index)}
                    >
                      {art.image_url ? (
                        <img 
                          src={art.image_url.startsWith('/uploads') ? art.image_url : art.image_url} 
                          alt={art.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);">Image failed to load</div>'; }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-muted)'
                        }}>
                          No Image Available
                        </div>
                      )}
                      {/* Magnifying glass icon - positioned inside image */}
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        pointerEvents: 'none',
                        zIndex: 5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        <span style={{ fontSize: '15px', color: '#fff', lineHeight: 1 }}>🔍</span>
                      </div>
                      {art.is_sold && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(2px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#d4af37',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '1.4rem',
                          letterSpacing: '0.1em'
                        }}>
                          SOLD
                        </div>
                      )}
                    </div>

                    {/* Details - SEPARATED BELOW IMAGE */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1 1 auto',
                      minHeight: 0,
                      overflow: 'hidden'
                    }}>
                      <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '6px' }}>{art.title}</h3>
                      <span className="badge badge-art" style={{ width: 'fit-content', marginBottom: '12px' }}>{art.medium}</span>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexGrow: 1, marginBottom: '16px', overflow: 'hidden' }}>{art.description}</p>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '12px',
                        flexShrink: 0
                      }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                          Ksh {parseFloat(art.price).toLocaleString()}
                        </span>
                        {!art.is_sold ? (
                          <button 
                            onClick={() => showToast(`Simulated acquiring: "${art.title}"! We have received your purchase intent.`)}
                            className="btn btn-gold" 
                            style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
                          >
                            <ShoppingBag size={14} /> Buy Piece
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Private Collection</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 3. CLASSES */}
        <section style={{ marginBottom: '80px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
              📚 Fine Arts Classes
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '700px' }}>
              {pageTexts.classesIntro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {classes.length > 0 ? (
                classes.map(c => (
                  <div 
                    key={c.id} 
                    className="glass-card" 
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
                        backgroundColor: 'rgba(212,175,55,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Palette size={20} color="#d4af37" />
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
                        Ksh {c.price?.toLocaleString() || '0'} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ class</span>
                      </div>
                      <button 
                        onClick={() => handleBookClass(c.id, c.title)}
                        className="btn btn-gold"
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      >
                        Book Spot
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p>No classes available at the moment.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Check back soon for upcoming sessions!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. PORTRAIT COMMISSIONS */}
        <section>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="glass-card glow-art" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Layers size={24} color="#d4af37" />
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Commission Custom Portraits</h2>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
                Have an idea, photo, or memory you'd like brought to life in an elegant, contemporary aesthetic? Select a medium and details below to submit a review request to our studio curators.
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
                    placeholder="Describe your context, focus subject (family portrait, pet representation, landscape backdrop), specific color themes, and reference requirements..."
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
        </section>

      </div>

      {/* ============================================
          LIGHTBOX MODAL
          ============================================ */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <X size={28} />
          </button>

          {/* Previous button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              style={{
                position: 'absolute',
                left: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              style={{
                position: 'absolute',
                right: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Image container */}
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {gallery[currentImageIndex]?.image_url ? (
              <img
                src={gallery[currentImageIndex].image_url}
                alt={gallery[currentImageIndex].title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                }}
              />
            ) : (
              <div style={{ color: '#fff', fontSize: '1.2rem' }}>No image available</div>
            )}
          </div>

          {/* Image info - title and description */}
          {gallery[currentImageIndex] && (
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                padding: '12px 24px',
                borderRadius: '12px',
                textAlign: 'center',
                maxWidth: '80%',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <h3 style={{ color: '#fff', marginBottom: '4px', fontSize: '1.1rem' }}>
                {gallery[currentImageIndex].title}
              </h3>
              {gallery[currentImageIndex].description && (
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>
                  {gallery[currentImageIndex].description}
                </p>
              )}
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '4px' }}>
                {gallery[currentImageIndex].medium} • Ksh {parseFloat(gallery[currentImageIndex].price).toLocaleString()}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>
                {currentImageIndex + 1} / {gallery.length}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
