import React, { useState, useEffect } from 'react';
import { Helmet } from '@vuer-ai/react-helmet-async';
import { api } from '../utils/api';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Eye, CheckCircle2, ShieldAlert, Sparkles, Filter, X, ArrowRight, MessageCircle } from 'lucide-react';

export default function Products() {
  const { showToast } = useApp();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Active view state per product (mapped by product ID)
  // Options: 'front', 'rear', 'whole'
  const [activeViews, setActiveViews] = useState({});

  // Lightbox / Detail Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalActiveView, setModalActiveView] = useState('front');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.get();
      setProductList(data);

      // Initialize default active views for products
      const initialViews = {};
      data.forEach(p => {
        initialViews[p.id] = 'front';
      });
      setActiveViews(initialViews);
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setViewForProduct = (productId, view) => {
    setActiveViews(prev => ({ ...prev, [productId]: view }));
  };

  const getDisplayedImage = (product, view) => {
    if (view === 'front' && product.image_front) return product.image_front;
    if (view === 'rear' && product.image_rear) return product.image_rear;
    if (view === 'whole' && product.image_whole) return product.image_whole;
    return product.image_url || product.image_front || product.image_whole || product.image_rear;
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalActiveView(activeViews[product.id] || 'front');
  };

  // Group products by systemic categories
  const categories = ['All', 'Art Products', 'Skating Products', 'Chess Products'];

  const filteredProducts = selectedCategory === 'All' 
    ? productList 
    : productList.filter(p => p.category === selectedCategory);

  const artProducts = productList.filter(p => p.category === 'Art Products');
  const skatingProducts = productList.filter(p => p.category === 'Skating Products');
  const chessProducts = productList.filter(p => p.category === 'Chess Products');

  const formatKsh = (amount) => {
    return `Ksh ${Number(amount).toLocaleString()}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px', paddingBottom: '80px' }}>
      <Helmet>
        <title>Official Products & Merchandise | TCM Arts</title>
        <meta name="description" content="Shop official TCM Arts merchandise, fine art supplies like canvas boards & brushes, slalom skating shoes with multi-angle views, and studio apparel." />
      </Helmet>

      {/* Hero Header */}
      <section style={{
        position: 'relative',
        padding: '60px 0 40px 0',
        textAlign: 'center',
        background: 'radial-gradient(circle at top center, rgba(236,72,153,0.12) 0%, rgba(99,102,241,0.05) 50%, transparent 80%)',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '50px'
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(236,72,153,0.1)',
            border: '1px solid rgba(236,72,153,0.3)',
            color: '#ec4899',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <ShoppingBag size={15} /> TCM Arts Official Store
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Quality Merchandise & Supplies
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '700px',
            margin: '0 auto 35px auto',
            lineHeight: 1.6
          }}>
            Explore our systemic collection of professional Fine Art supplies, premium Slalom Skating shoes (featuring 3D front, rear & whole shoe views), and studio apparel.
          </p>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: selectedCategory === cat ? '1px solid #ec4899' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(99,102,241,0.2))' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat ? '0 4px 20px rgba(236,72,153,0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="loading-spinner-large"></div>
          </div>
        ) : productList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <ShoppingBag size={48} color="var(--text-secondary)" style={{ marginBottom: '15px', opacity: 0.5 }} />
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>No Products Available</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Check back soon for new merchandise!</p>
          </div>
        ) : selectedCategory !== 'All' ? (
          /* Single Selected Category View */
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              color: '#fff',
              fontSize: '1.8rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Filter size={22} color="#ec4899" /> {selectedCategory}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '30px'
            }}>
              {filteredProducts.map(product => renderProductCard(product))}
            </div>
          </div>
        ) : (
          /* Systemic Grouped Layout View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            
            {/* 1. Skating Products Section */}
            {skatingProducts.length > 0 && (
              <section id="skating-products">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px',
                  borderBottom: '1px solid rgba(99,102,241,0.2)',
                  paddingBottom: '15px'
                }}>
                  <div>
                    <h2 style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#fff',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'inline-flex'
                      }}>🛼</span> Skating Products & Shoes
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                      High-precision slalom skating shoes featuring multi-angle Front, Rear, and Whole Shoe view inspection.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('Skating Products')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#6366f1',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '30px'
                }}>
                  {skatingProducts.map(product => renderProductCard(product))}
                </div>
              </section>
            )}

            {/* 2. Art Products Section */}
            {artProducts.length > 0 && (
              <section id="art-products">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px',
                  borderBottom: '1px solid rgba(212,175,55,0.2)',
                  paddingBottom: '15px'
                }}>
                  <div>
                    <h2 style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#fff',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        background: 'rgba(212,175,55,0.15)',
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'inline-flex'
                      }}>🎨</span> Art Products & Materials
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                      Canvas boards, artist brushes, paint sets, and studio apparel.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('Art Products')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#d4af37',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '30px'
                }}>
                  {artProducts.map(product => renderProductCard(product))}
                </div>
              </section>
            )}

            {/* 3. Chess Products Section */}
            {chessProducts.length > 0 && (
              <section id="chess-products">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px',
                  borderBottom: '1px solid rgba(16,185,129,0.2)',
                  paddingBottom: '15px'
                }}>
                  <div>
                    <h2 style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#fff',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        background: 'rgba(16,185,129,0.15)',
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'inline-flex'
                      }}>♟️</span> Chess Products & Accessories
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                      Tournament chess boards, clocks, strategy manuals, and mind sport apparel.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('Chess Products')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#10b981',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '30px'
                }}>
                  {chessProducts.map(product => renderProductCard(product))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>

      {/* Product Interactive Multi-View Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            padding: '30px'
          }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <X size={20} />
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px',
              alignItems: 'center'
            }}>
              {/* Image Previewer */}
              <div>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '350px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#070709',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={getDisplayedImage(selectedProduct, modalActiveView)}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {modalActiveView === 'front' ? '📷 Front View' : modalActiveView === 'rear' ? '🔄 Rear View' : '👟 Whole Shoe View'}
                  </div>
                </div>

                {/* 3 View Angle Selector Thumbnails */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '10px',
                  marginTop: '15px'
                }}>
                  <button
                    onClick={() => setModalActiveView('front')}
                    style={{
                      border: modalActiveView === 'front' ? '2px solid #ec4899' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '6px',
                      background: 'rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: modalActiveView === 'front' ? '#ec4899' : 'var(--text-secondary)'
                    }}
                  >
                    <img
                      src={selectedProduct.image_front || selectedProduct.image_url}
                      alt="Front view"
                      style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Front View</span>
                  </button>

                  <button
                    onClick={() => setModalActiveView('rear')}
                    style={{
                      border: modalActiveView === 'rear' ? '2px solid #ec4899' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '6px',
                      background: 'rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: modalActiveView === 'rear' ? '#ec4899' : 'var(--text-secondary)'
                    }}
                  >
                    <img
                      src={selectedProduct.image_rear || selectedProduct.image_url}
                      alt="Rear view"
                      style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Rear View</span>
                  </button>

                  <button
                    onClick={() => setModalActiveView('whole')}
                    style={{
                      border: modalActiveView === 'whole' ? '2px solid #ec4899' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '6px',
                      background: 'rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: modalActiveView === 'whole' ? '#ec4899' : 'var(--text-secondary)'
                    }}
                  >
                    <img
                      src={selectedProduct.image_whole || selectedProduct.image_url}
                      alt="Whole view"
                      style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Whole Shoe</span>
                  </button>
                </div>
              </div>

              {/* Product Info & Purchase Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{
                  color: '#ec4899',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedProduct.category} {selectedProduct.subcategory && `• ${selectedProduct.subcategory}`}
                </span>

                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.8rem', lineHeight: 1.2 }}>
                  {selectedProduct.name}
                </h2>

                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d4af37' }}>
                  {formatKsh(selectedProduct.price)}
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {selectedProduct.description}
                </p>

                <div style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '6px' }}>💳 M-Pesa Direct Order Details:</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Paybill: <strong style={{ color: '#fff' }}>522533</strong></div>
                  <div style={{ color: 'var(--text-secondary)' }}>Account: <strong style={{ color: '#fff' }}>8070026</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <a
                    href={`https://wa.me/254745728614?text=${encodeURIComponent(`Hello TCM Arts! I'd like to order ${selectedProduct.name} (${formatKsh(selectedProduct.price)}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#25d366',
                      color: '#000',
                      fontWeight: 700,
                      padding: '14px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <MessageCircle size={18} /> Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper render for individual product cards
  function renderProductCard(product) {
    const activeView = activeViews[product.id] || 'front';
    const displayedImage = getDisplayedImage(product, activeView);
    const isSkatingShoe = product.category === 'Skating Products' || product.subcategory?.toLowerCase().includes('shoe');

    return (
      <div
        key={product.id}
        style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        className="product-card-hover"
      >
        {/* Main Image Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '260px',
          overflow: 'hidden',
          background: '#0a0a0c',
          cursor: 'pointer'
        }} onClick={() => openProductModal(product)}>
          <img
            src={displayedImage}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
          />

          {/* Active View Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {activeView === 'front' ? 'Front View' : activeView === 'rear' ? 'Rear View' : 'Whole Shoe'}
          </div>

          {/* Stock Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: product.in_stock ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* 3 View Switcher Bar for Skating Shoes / Multi-view products */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(0,0,0,0.4)'
        }}>
          <button
            onClick={() => setViewForProduct(product.id, 'front')}
            style={{
              padding: '8px 4px',
              border: 'none',
              background: activeView === 'front' ? 'rgba(236,72,153,0.15)' : 'transparent',
              borderBottom: activeView === 'front' ? '2px solid #ec4899' : '2px solid transparent',
              color: activeView === 'front' ? '#ec4899' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📷 Front
          </button>
          <button
            onClick={() => setViewForProduct(product.id, 'rear')}
            style={{
              padding: '8px 4px',
              border: 'none',
              background: activeView === 'rear' ? 'rgba(236,72,153,0.15)' : 'transparent',
              borderBottom: activeView === 'rear' ? '2px solid #ec4899' : '2px solid transparent',
              color: activeView === 'rear' ? '#ec4899' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🔄 Rear
          </button>
          <button
            onClick={() => setViewForProduct(product.id, 'whole')}
            style={{
              padding: '8px 4px',
              border: 'none',
              background: activeView === 'whole' ? 'rgba(236,72,153,0.15)' : 'transparent',
              borderBottom: activeView === 'whole' ? '2px solid #ec4899' : '2px solid transparent',
              color: activeView === 'whole' ? '#ec4899' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👟 Whole Shoe
          </button>
        </div>

        {/* Product Details */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{
            fontSize: '0.8rem',
            color: '#d4af37',
            fontWeight: 600,
            marginBottom: '6px'
          }}>
            {product.category} {product.subcategory && `• ${product.subcategory}`}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-heading)',
            color: '#fff',
            fontSize: '1.2rem',
            marginBottom: '8px',
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            marginBottom: '16px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {formatKsh(product.price)}
            </span>

            <button
              onClick={() => openProductModal(product)}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                border: 'none',
                color: '#fff',
                fontWeight: 600,
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(236,72,153,0.3)'
              }}
            >
              <Eye size={15} /> Details
            </button>
          </div>
        </div>
      </div>
    );
  }
}
