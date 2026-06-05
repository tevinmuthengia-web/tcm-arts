import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../utils/api';
import { Edit, Image, Plus, Trash2, Calendar, FileText, CheckCircle2, Shield, User, Loader } from 'lucide-react';

// ==========================================
// ADVANCED IMAGE COMPRESSION - HANDLES 100MB+ FILES
// ==========================================
const compressImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const fileSizeMB = file.size / 1024 / 1024;
    
    // Show warning for very large files
    if (fileSizeMB > 50) {
      alert(`Your image is ${fileSizeMB.toFixed(1)}MB. This will be compressed to under 5MB. Please wait...`);
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Aggressive resizing based on file size
        let MAX_WIDTH = 1200;
        let MAX_HEIGHT = 1200;
        let quality = 0.8;
        
        if (fileSizeMB > 50) {
          MAX_WIDTH = 800;
          MAX_HEIGHT = 800;
          quality = 0.6;
        } else if (fileSizeMB > 30) {
          MAX_WIDTH = 1000;
          MAX_HEIGHT = 1000;
          quality = 0.7;
        } else if (fileSizeMB > 15) {
          MAX_WIDTH = 1200;
          MAX_HEIGHT = 1200;
          quality = 0.75;
        }
        
        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Update progress
        if (onProgress) onProgress(50);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          const compressedSizeMB = compressedFile.size / 1024 / 1024;
          const savedPercent = Math.round((1 - compressedFile.size / file.size) * 100);
          
          console.log(`📸 Compression: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${savedPercent}% saved)`);
          
          if (onProgress) onProgress(100);
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

export default function AdminPanel() {
  const { siteContent, reloadContent, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('text');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  
  // 1. Copy State
  const [heroTitle, setHeroTitle] = useState(siteContent?.hero?.title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent?.hero?.subtitle || '');
  const [heroDesc, setHeroDesc] = useState(siteContent?.hero?.description || '');
  
  const [artTitle, setArtTitle] = useState(siteContent?.fineArts?.title || '');
  const [artDesc, setArtDesc] = useState(siteContent?.fineArts?.description || '');
  const [artBaseCommissionPrice, setArtBaseCommissionPrice] = useState(siteContent?.fineArts?.baseCommissionPrice || 5000);
  
  const [skateTitle, setSkateTitle] = useState(siteContent?.skating?.title || '');
  const [skateDesc, setSkateDesc] = useState(siteContent?.skating?.description || '');
  const [skateMembershipPrice, setSkateMembershipPrice] = useState(siteContent?.skating?.membershipPrice || 15000);
  
  const [chessTitle, setChessTitle] = useState(siteContent?.chess?.title || '');
  const [chessDesc, setChessDesc] = useState(siteContent?.chess?.description || '');
  const [chessCasualPrice, setChessCasualPrice] = useState(siteContent?.chess?.casualPrice || 4000);
  const [chessProPrice, setChessProPrice] = useState(siteContent?.chess?.proPrice || 10000);

  // 2. Gallery State
  const [gallery, setGallery] = useState([]);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtDesc, setNewArtDesc] = useState('');
  const [newArtMedium, setNewArtMedium] = useState('Oil on Canvas');
  const [newArtPrice, setNewArtPrice] = useState('');
  const [newArtFile, setNewArtFile] = useState(null);
  const [newArtUrl, setNewArtUrl] = useState('');

  // Editing Art State
  const [editingArtId, setEditingArtId] = useState(null);
  const [editArtTitle, setEditArtTitle] = useState('');
  const [editArtMedium, setEditArtMedium] = useState('');
  const [editArtPrice, setEditArtPrice] = useState('');
  const [editArtDesc, setEditArtDesc] = useState('');

  // 3. Classes State
  const [classes, setClasses] = useState([]);
  const [newClassCategory, setNewClassCategory] = useState('fine-arts');
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassDay, setNewClassDay] = useState('');
  const [newClassDate, setNewClassDate] = useState('');
  const [newClassTime, setNewClassTime] = useState('');
  const [newClassPrice, setNewClassPrice] = useState('');

  // Editing Class State
  const [editingClassId, setEditingClassId] = useState(null);
  const [editClassTitle, setEditClassTitle] = useState('');
  const [editClassDesc, setEditClassDesc] = useState('');
  const [editClassPrice, setEditClassPrice] = useState('');
  const [editClassDay, setEditClassDay] = useState('');
  const [editClassDate, setEditClassDate] = useState('');
  const [editClassTime, setEditClassTime] = useState('');

  // 4. Commissions State
  const [commissions, setCommissions] = useState([]);

  // 5. Users State
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const art = await api.gallery.get();
      setGallery(art);
      const cls = await api.classes.get();
      setClasses(cls);
      const comms = await api.commissions.getAll();
      setCommissions(comms);
      const usrList = await api.admin.getUsers();
      setUsers(usrList);
    } catch (err) {
      console.error("Admin data retrieval error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update site texts on the backend JSON database
  const handleUpdateCopy = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        hero: { title: heroTitle, subtitle: heroSubtitle, description: heroDesc, image: siteContent?.hero?.image },
        fineArts: { 
          title: artTitle, 
          description: artDesc, 
          classesIntro: siteContent?.fineArts?.classesIntro, 
          baseCommissionPrice: Number(artBaseCommissionPrice) 
        },
        skating: { 
          title: skateTitle, 
          description: skateDesc, 
          servicesIntro: siteContent?.skating?.servicesIntro, 
          membershipPrice: Number(skateMembershipPrice) 
        },
        chess: { 
          title: chessTitle, 
          description: chessDesc, 
          tutoringIntro: siteContent?.chess?.tutoringIntro, 
          casualPrice: Number(chessCasualPrice), 
          proPrice: Number(chessProPrice) 
        }
      };

      await api.content.update(updated);
      await reloadContent();
      showToast("Website content and pricing updated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to update content and pricing.", "error");
    }
  };

  // Add a gallery painting/portrait - HANDLES 100MB+ FILES
  const handleAddArt = async (e) => {
    e.preventDefault();
    if (!newArtTitle || !newArtDesc || !newArtPrice) {
      showToast("All art description fields are required", "error");
      return;
    }

    if (!newArtFile && !newArtUrl) {
      showToast("Please select an image file or provide an image URL.", "error");
      return;
    }

    try {
      let fileToUpload = newArtFile;
      
      // Compress image if it exists (handles ANY file size)
      if (newArtFile) {
        const fileSizeMB = newArtFile.size / 1024 / 1024;
        setIsCompressing(true);
        setCompressProgress(0);
        
        showToast(`📦 Compressing ${fileSizeMB.toFixed(1)}MB image...`, "info");
        
        fileToUpload = await compressImage(newArtFile, (progress) => {
          setCompressProgress(progress);
        });
        
        const compressedSizeMB = fileToUpload.size / 1024 / 1024;
        const savedPercent = Math.round((1 - fileToUpload.size / newArtFile.size) * 100);
        
        showToast(`✅ Compressed: ${fileSizeMB.toFixed(1)}MB → ${compressedSizeMB.toFixed(2)}MB (${savedPercent}% saved)`, "success");
        setIsCompressing(false);
      }
      
      const formData = new FormData();
      formData.append('title', newArtTitle);
      formData.append('description', newArtDesc);
      formData.append('medium', newArtMedium);
      formData.append('price', newArtPrice);
      
      if (fileToUpload) {
        formData.append('image', fileToUpload);
      } else if (newArtUrl) {
        formData.append('imageUrl', newArtUrl);
      }

      await api.gallery.add(formData);
      showToast("🎨 New art piece added to Fine Arts Studio!");
      setNewArtTitle('');
      setNewArtDesc('');
      setNewArtPrice('');
      setNewArtFile(null);
      setNewArtUrl('');
      setCompressProgress(0);
      fetchData();
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.message || "Failed to upload art. Please try again.", "error");
      setIsCompressing(false);
      setCompressProgress(0);
    }
  };

  const handleToggleSold = async (id, currentSold) => {
    try {
      const formData = new FormData();
      formData.append('isSold', !currentSold);
      await api.gallery.edit(id, formData);
      showToast("Availability status modified.");
      fetchData();
    } catch (err) {
      showToast("Toggle status failed.", "error");
    }
  };

  const handleStartEditArt = (art) => {
    setEditingArtId(art.id);
    setEditArtTitle(art.title);
    setEditArtMedium(art.medium);
    setEditArtPrice(art.price);
    setEditArtDesc(art.description);
  };

  const handleSaveArt = async (id) => {
    if (!editArtTitle || !editArtMedium || !editArtPrice || !editArtDesc) {
      showToast("Please fill all art details.", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', editArtTitle);
      formData.append('medium', editArtMedium);
      formData.append('price', parseFloat(editArtPrice));
      formData.append('description', editArtDesc);
      
      await api.gallery.edit(id, formData);
      showToast("Art piece details updated successfully!");
      setEditingArtId(null);
      fetchData();
    } catch (err) {
      showToast("Failed to update art details.", "error");
    }
  };

  const handleDeleteArt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this art piece?")) return;
    try {
      await api.gallery.delete(id);
      showToast("Art piece deleted.");
      fetchData();
    } catch (err) {
      showToast("Failed to delete.", "error");
    }
  };

  // Add course
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassTitle || !newClassDesc || !newClassDay || !newClassDate || !newClassTime || !newClassPrice) {
      showToast("Please fill all class fields and timeline.", "error");
      return;
    }

    try {
      const schedule = `${newClassDay} | ${newClassDate} | ${newClassTime}`;
      await api.classes.add({
        category: newClassCategory,
        title: newClassTitle,
        description: newClassDesc,
        schedule,
        price: parseFloat(newClassPrice)
      });
      showToast(`Added ${newClassTitle} class successfully!`);
      setNewClassTitle('');
      setNewClassDesc('');
      setNewClassDay('');
      setNewClassDate('');
      setNewClassTime('');
      setNewClassPrice('');
      fetchData();
    } catch (err) {
      showToast("Failed to add class.", "error");
    }
  };

  const handleStartEditClass = (c) => {
    setEditingClassId(c.id);
    setEditClassTitle(c.title);
    setEditClassDesc(c.description);
    setEditClassPrice(c.price);
    
    const parts = c.schedule.split(' | ');
    if (parts.length >= 3) {
      setEditClassDay(parts[0]);
      setEditClassDate(parts[1]);
      setEditClassTime(parts[2]);
    } else {
      setEditClassDay(c.schedule);
      setEditClassDate('');
      setEditClassTime('');
    }
  };

  const handleSaveClass = async (id) => {
    if (!editClassTitle || !editClassDesc || !editClassPrice || !editClassDay || !editClassDate || !editClassTime) {
      showToast("Please fill all timeline and detail fields.", "error");
      return;
    }
    try {
      const schedule = `${editClassDay} | ${editClassDate} | ${editClassTime}`;
      await api.classes.edit(id, {
        title: editClassTitle,
        description: editClassDesc,
        schedule,
        price: parseFloat(editClassPrice)
      });
      showToast("Course details and timeline updated successfully!");
      setEditingClassId(null);
      fetchData();
    } catch (err) {
      showToast("Failed to update class details.", "error");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Delete this training course?")) return;
    try {
      await api.classes.delete(id);
      showToast("Course deleted.");
      fetchData();
    } catch (err) {
      showToast("Failed to delete course.", "error");
    }
  };

  const handleUpdateCommissionStatus = async (id, status) => {
    try {
      await api.commissions.updateStatus(id, status);
      showToast(`Commission updated to: ${status}`);
      fetchData();
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <Shield size={32} color="#d4af37" />
          <div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>
              TCM Administrative Control Center
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Directly edit website text copy, manage art gallery archives, post new classes, and review commission orders.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '30px',
          borderBottom: '1px solid var(--border-color)'
        }} className="admin-tabs">
          <button onClick={() => setActiveTab('text')} style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'text' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'text' ? '#d4af37' : 'var(--text-secondary)', border: activeTab === 'text' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit size={16} /> Edit Live Text
          </button>
          <button onClick={() => setActiveTab('gallery')} style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'gallery' ? 'rgba(99,102,241,0.08)' : 'transparent', color: activeTab === 'gallery' ? '#6366f1' : 'var(--text-secondary)', border: activeTab === 'gallery' ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image size={16} /> Art Gallery Manager
          </button>
          <button onClick={() => setActiveTab('classes')} style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'classes' ? 'rgba(16,185,129,0.08)' : 'transparent', color: activeTab === 'classes' ? '#10b981' : 'var(--text-secondary)', border: activeTab === 'classes' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} /> Classes & Slots
          </button>
          <button onClick={() => setActiveTab('commissions')} style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'commissions' ? 'rgba(255,255,255,0.04)' : 'transparent', color: activeTab === 'commissions' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'commissions' ? '1px solid var(--border-color)' : '1px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} /> Portrait Commissions ({commissions.length})
          </button>
          <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'users' ? 'rgba(255,255,255,0.04)' : 'transparent', color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'users' ? '1px solid var(--border-color)' : '1px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Registered Members ({users.length})
          </button>
        </div>

        {/* TAB 1: DYNAMIC COPY/TEXT CMS */}
        {activeTab === 'text' && (
          <form onSubmit={handleUpdateCopy} className="glass-card glow-art" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '24px' }}>📝 Edit Dynamic Text Copy</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h4 style={{ color: '#d4af37', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '6px', marginBottom: '16px' }}>Hero Section (Home Page)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Hero Title Heading</label><input type="text" className="form-control focus-art" value={heroTitle} onChange={(e)=>setHeroTitle(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Hero Subtitle</label><input type="text" className="form-control focus-art" value={heroSubtitle} onChange={(e)=>setHeroSubtitle(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Hero Description</label><textarea className="form-control focus-art" rows={3} value={heroDesc} onChange={(e)=>setHeroDesc(e.target.value)} required /></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }} className="grid-3">
                <div><h4 style={{ color: '#d4af37', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '6px', marginBottom: '16px' }}>Fine Arts Page</h4><div className="form-group"><label className="form-label">Arts Page Title</label><input type="text" className="form-control focus-art" value={artTitle} onChange={(e)=>setArtTitle(e.target.value)} required /></div><div className="form-group"><label className="form-label">Arts Description</label><textarea className="form-control focus-art" rows={4} value={artDesc} onChange={(e)=>setArtDesc(e.target.value)} required /></div></div>
                <div><h4 style={{ color: '#6366f1', borderBottom: '1px solid rgba(99,102,241,0.2)', paddingBottom: '6px', marginBottom: '16px' }}>Skating Page</h4><div className="form-group"><label className="form-label">Skating Page Title</label><input type="text" className="form-control focus-skate" value={skateTitle} onChange={(e)=>setSkateTitle(e.target.value)} required /></div><div className="form-group"><label className="form-label">Skating Description</label><textarea className="form-control focus-skate" rows={4} value={skateDesc} onChange={(e)=>setSkateDesc(e.target.value)} required /></div></div>
                <div><h4 style={{ color: '#10b981', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '6px', marginBottom: '16px' }}>Chess Page</h4><div className="form-group"><label className="form-label">Chess Page Title</label><input type="text" className="form-control focus-chess" value={chessTitle} onChange={(e)=>setChessTitle(e.target.value)} required /></div><div className="form-group"><label className="form-label">Chess Description</label><textarea className="form-control focus-chess" rows={4} value={chessDesc} onChange={(e)=>setChessDesc(e.target.value)} required /></div></div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ color: '#d4af37', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '6px', marginBottom: '16px' }}>💰 Service & Membership Pricing</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }} className="grid-4">
                  <div className="form-group"><label className="form-label">Art Commission Base (Ksh)</label><input type="number" className="form-control focus-art" value={artBaseCommissionPrice} onChange={(e) => setArtBaseCommissionPrice(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Skating Annual Pass (Ksh)</label><input type="number" className="form-control focus-skate" value={skateMembershipPrice} onChange={(e) => setSkateMembershipPrice(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Chess Casual Pass (Ksh)</label><input type="number" className="form-control focus-chess" value={chessCasualPrice} onChange={(e) => setChessCasualPrice(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Chess Pro Pass (Ksh)</label><input type="number" className="form-control focus-chess" value={chessProPrice} onChange={(e) => setChessProPrice(e.target.value)} required /></div>
                </div>
              </div>
              <button type="submit" className="btn btn-gold" style={{ alignSelf: 'flex-start' }}>💾 Save Content & Pricing Changes</button>
            </div>
          </form>
        )}

        {/* TAB 2: ART GALLERY ARCHIVE MANAGER (CMS) - WITH PROGRESS BAR */}
        {activeTab === 'gallery' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }} className="grid-2">
            <form onSubmit={handleAddArt} className="glass-card glow-art" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '20px' }}>➕ Upload New Art Piece</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Painting Title</label><input type="text" className="form-control focus-art" placeholder="E.g., Autumn Reflexes" value={newArtTitle} onChange={(e)=>setNewArtTitle(e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Art Medium / Style</label><input type="text" className="form-control focus-art" placeholder="E.g., Oil pastels on board" value={newArtMedium} onChange={(e)=>setNewArtMedium(e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Selling Price (Ksh)</label><input type="number" className="form-control focus-art" placeholder="E.g., 25000" value={newArtPrice} onChange={(e)=>setNewArtPrice(e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Description / Philosophy</label><textarea className="form-control focus-art" rows={3} placeholder="Contextual insights..." value={newArtDesc} onChange={(e)=>setNewArtDesc(e.target.value)} required /></div>
                <div className="form-group">
                  <label className="form-label">Visual Image Source</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="file" accept="image/*" onChange={(e) => setNewArtFile(e.target.files[0])} style={{ color: '#fff', fontSize: '0.85rem' }} disabled={isCompressing} />
                    {isCompressing && (
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <Loader size={16} className="spin" style={{ color: '#d4af37' }} />
                          <span style={{ color: '#d4af37', fontSize: '0.85rem' }}>Compressing image... {compressProgress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${compressProgress}%`, height: '100%', backgroundColor: '#d4af37', transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>- OR enter public link -</div>
                    <input type="text" className="form-control focus-art" placeholder="https://images.unsplash.com/..." value={newArtUrl} onChange={(e) => setNewArtUrl(e.target.value)} disabled={!!newArtFile || isCompressing} />
                  </div>
                </div>
                <button type="submit" className="btn btn-gold" style={{ marginTop: '10px' }} disabled={isCompressing}>
                  {isCompressing ? 'Compressing... Please wait' : <><Plus size={16} /> Post to Gallery</>}
                </button>
              </div>
            </form>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>🖼️ Gallery Archives ({gallery.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto' }}>
                {gallery.map(art => (
                  <div key={art.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editingArtId === art.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }} className="grid-2">
                          <input type="text" className="form-control focus-art" value={editArtTitle} onChange={(e) => setEditArtTitle(e.target.value)} placeholder="Painting Title" required />
                          <input type="number" className="form-control focus-art" value={editArtPrice} onChange={(e) => setEditArtPrice(e.target.value)} placeholder="Price (Ksh)" required />
                        </div>
                        <div className="form-group"><input type="text" className="form-control focus-art" value={editArtMedium} onChange={(e) => setEditArtMedium(e.target.value)} placeholder="Art Medium / Style" required /></div>
                        <textarea className="form-control focus-art" value={editArtDesc} onChange={(e) => setEditArtDesc(e.target.value)} placeholder="Description / Philosophy" rows={2} required />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button onClick={() => handleSaveArt(art.id)} className="btn btn-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                          <button onClick={() => setEditingArtId(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img src={art.imageUrl} alt={art.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div><h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0 }}>{art.title}</h4><div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}><span className="badge badge-art" style={{ fontSize: '0.65rem' }}>{art.medium}</span><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ksh {art.price.toLocaleString()}</span></div></div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => handleToggleSold(art.id, art.isSold)} className={`btn ${art.isSold ? 'btn-secondary' : 'btn-gold'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>{art.isSold ? 'Set Available' : 'Set Sold'}</button>
                          <button onClick={() => handleStartEditArt(art)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit size={12} /> Edit</button>
                          <button onClick={() => handleDeleteArt(art.id)} className="btn btn-danger" style={{ padding: '6px 10px' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLASSES & COURSES CMS MANAGER */}
        {activeTab === 'classes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }} className="grid-2">
            <form onSubmit={handleAddClass} className="glass-card glow-skate" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '20px' }}>➕ Add New Course / Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Category</label><select className="form-control focus-skate" value={newClassCategory} onChange={(e)=>setNewClassCategory(e.target.value)}><option value="fine-arts">Fine Arts Studio</option><option value="skating">Skating Academy</option><option value="chess">Chess & Mind Sports</option></select></div>
                <div className="form-group"><label className="form-label">Course Title</label><input type="text" className="form-control focus-skate" placeholder="E.g., Pastel Landscape Flow" value={newClassTitle} onChange={(e)=>setNewClassTitle(e.target.value)} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }} className="grid-3">
                  <div className="form-group"><label className="form-label">Day</label><input type="text" className="form-control focus-skate" placeholder="E.g., Sunday" value={newClassDay} onChange={(e)=>setNewClassDay(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Date & Year</label><input type="text" className="form-control focus-skate" placeholder="E.g., Oct 12, 2026" value={newClassDate} onChange={(e)=>setNewClassDate(e.target.value)} required /></div>
                  <div className="form-group"><label className="form-label">Time Range</label><input type="text" className="form-control focus-skate" placeholder="E.g., 3:00 PM - 4:30 PM" value={newClassTime} onChange={(e)=>setNewClassTime(e.target.value)} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Price per Session (Ksh)</label><input type="number" className="form-control focus-skate" placeholder="E.g., 1500" value={newClassPrice} onChange={(e)=>setNewClassPrice(e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Short Description</label><textarea className="form-control focus-skate" rows={3} placeholder="Course goals..." value={newClassDesc} onChange={(e)=>setNewClassDesc(e.target.value)} required /></div>
                <button type="submit" className="btn btn-indigo" style={{ marginTop: '10px' }}><Plus size={16} /> Post Class</button>
              </div>
            </form>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>📚 Current Active Classes ({classes.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto' }}>
                {classes.map(c => (
                  <div key={c.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editingClassId === c.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }} className="grid-2">
                          <input type="text" className="form-control focus-skate" value={editClassTitle} onChange={(e) => setEditClassTitle(e.target.value)} placeholder="Course Title" required />
                          <input type="number" className="form-control focus-skate" value={editClassPrice} onChange={(e) => setEditClassPrice(e.target.value)} placeholder="Price (Ksh)" required />
                        </div>
                        <textarea className="form-control focus-skate" value={editClassDesc} onChange={(e) => setEditClassDesc(e.target.value)} placeholder="Description" rows={2} required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }} className="grid-3">
                          <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Day</label><input type="text" className="form-control focus-skate" value={editClassDay} onChange={(e) => setEditClassDay(e.target.value)} placeholder="e.g. Sunday" required /></div>
                          <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Year</label><input type="text" className="form-control focus-skate" value={editClassDate} onChange={(e) => setEditClassDate(e.target.value)} placeholder="e.g. Oct 12, 2026" required /></div>
                          <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Range</label><input type="text" className="form-control focus-skate" value={editClassTime} onChange={(e) => setEditClassTime(e.target.value)} placeholder="e.g. 3:00 PM - 4:30 PM" required /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button onClick={() => handleSaveClass(c.id)} className="btn btn-emerald" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                          <button onClick={() => setEditingClassId(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
                        <div><div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}><span className={`badge ${c.category === 'fine-arts' ? 'badge-art' : c.category === 'skating' ? 'badge-skate' : 'badge-chess'}`} style={{ fontSize: '0.6rem' }}>{c.category}</span></div><h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0 }}>{c.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '4px 0 0 0' }}>Timeline: <span style={{ color: '#fff' }}>{c.schedule}</span> | Price: <span style={{ color: '#fff' }}>Ksh {c.price.toLocaleString()}</span></p></div>
                        <div style={{ display: 'flex', gap: '8px' }}><button onClick={() => handleStartEditClass(c)} className="btn btn-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit size={14} /> Edit</button><button onClick={() => handleDeleteClass(c.id)} className="btn btn-danger" style={{ padding: '8px 12px' }}><Trash2 size={14} /></button></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PORTRAIT COMMISSIONS PIPELINE */}
        {activeTab === 'commissions' && (
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '24px' }}>🎨 Portrait Commission Queue ({commissions.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {commissions.map(comm => (
                <div key={comm.id} style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }} className="grid-2">
                  <div><div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}><span className="badge badge-art">{comm.medium}</span><span className="badge badge-gray">{comm.size}</span><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>by {comm.userName}</span></div><p style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 10px 0', fontWeight: 500 }}>"{comm.description}"</p><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Target Delivery: {comm.targetDate} | Request ID: {comm.id}</div></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', alignItems: 'flex-end' }}><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status: <span style={{ color: comm.status === 'Pending Review' ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{comm.status}</span></div><div style={{ display: 'flex', gap: '8px' }}><button onClick={() => handleUpdateCommissionStatus(comm.id, 'In Progress')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Start Work</button><button onClick={() => handleUpdateCommissionStatus(comm.id, 'Completed')} className="btn btn-emerald" style={{ padding: '6px 12px', fontSize: '0.75rem' }}><CheckCircle2 size={14} /> Finish</button></div></div>
                </div>
              ))}
              {commissions.length === 0 && (<div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No portrait commission requests in the active queue.</div>)}
            </div>
          </div>
        )}

        {/* TAB 5: USERS ROSTER */}
        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '24px' }}>👤 Registered TCM Arts Members ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}><th style={{ padding: '12px 16px' }}>Name</th><th style={{ padding: '12px 16px' }}>Email</th><th style={{ padding: '12px 16px' }}>Access Role</th><th style={{ padding: '12px 16px' }}>Registered At</th></tr></thead>
                <tbody>{users.map(u => (<tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}><td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{u.name}</td><td style={{ padding: '12px 16px' }}>{u.email}</td><td style={{ padding: '12px 16px' }}><span className={`badge ${u.role === 'admin' ? 'badge-art' : 'badge-gray'}`} style={{ fontSize: '0.65rem' }}>{u.role}</span></td><td style={{ padding: '12px 16px' }}>{new Date(u.createdAt).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}