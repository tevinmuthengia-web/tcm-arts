const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const db = require('./database/db');
const { authenticateToken, requireAdmin, JWT_SECRET } = require('./middleware/auth');

// Import Cloudinary configuration
const { cloudinary, upload, uploadToCloudinary } = require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing with increased limits for large files
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Setup static uploads directory for OLD images (kept for backward compatibility)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const data = db.read();
  const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'member',
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.write(data);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const data = db.read();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const data = db.read();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});


// ==========================================
// 2. PUBLIC DATA RETRIEVAL ENDPOINTS
// ==========================================

app.get('/api/content', (req, res) => {
  const data = db.read();
  res.json(data.siteContent);
});

app.get('/api/gallery', (req, res) => {
  const data = db.read();
  res.json(data.gallery);
});

app.get('/api/classes', (req, res) => {
  const data = db.read();
  res.json(data.classes);
});


// ==========================================
// 3. ADMIN CONTENT MANAGEMENT (CMS) ENDPOINTS
// ==========================================

app.put('/api/content', requireAdmin, (req, res) => {
  const newContent = req.body;
  const data = db.read();
  
  data.siteContent = {
    ...data.siteContent,
    ...newContent
  };
  
  db.write(data);
  res.json({ message: 'Website content updated successfully!', siteContent: data.siteContent });
});

// FIXED: Add new painting/portrait to gallery with better error handling
app.post('/api/gallery', requireAdmin, upload.single('image'), async (req, res) => {
  console.log('=== GALLERY UPLOAD REQUEST RECEIVED ===');
  console.log('Body fields:', Object.keys(req.body));
  console.log('File present:', !!req.file);
  
  const { title, description, medium, price } = req.body;
  
  if (!title || !description || !medium || !price) {
    console.log('Missing fields:', { title, description, medium, price });
    return res.status(400).json({ error: 'All description fields are required' });
  }

  try {
    let imageUrl = req.body.imageUrl || '';
    
    if (req.file) {
      const fileSizeMB = req.file.size / 1024 / 1024;
      console.log(`Processing upload: ${req.file.originalname} (${fileSizeMB.toFixed(2)} MB)`);
      console.log('Cloudinary credentials present:', {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
      });
      
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      console.log('Upload successful, URL:', imageUrl);
      
      // Clear buffer to free memory
      req.file.buffer = null;
    }

    const data = db.read();
    const newArt = {
      id: 'art-' + Date.now(),
      title,
      description,
      medium,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800',
      price: parseFloat(price),
      isSold: false,
      createdAt: new Date().toISOString()
    };

    data.gallery.unshift(newArt);
    db.write(data);

    console.log('Art piece saved successfully, ID:', newArt.id);
    res.status(201).json({ 
      message: 'Art piece added successfully!', 
      art: newArt 
    });
  } catch (error) {
    console.error('Upload error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to upload image: ' + error.message 
    });
  }
});

// Edit gallery piece details
app.put('/api/gallery/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, medium, price, isSold } = req.body;

  const data = db.read();
  const artIndex = data.gallery.findIndex(art => art.id === id);

  if (artIndex === -1) {
    return res.status(404).json({ error: 'Art piece not found' });
  }

  try {
    let imageUrl = data.gallery[artIndex].imageUrl;
    
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      req.file.buffer = null;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    data.gallery[artIndex] = {
      ...data.gallery[artIndex],
      title: title || data.gallery[artIndex].title,
      description: description || data.gallery[artIndex].description,
      medium: medium || data.gallery[artIndex].medium,
      price: price ? parseFloat(price) : data.gallery[artIndex].price,
      isSold: isSold === 'true' || isSold === true,
      imageUrl
    };

    db.write(data);
    res.json({ message: 'Art piece updated successfully!', art: data.gallery[artIndex] });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// Delete gallery piece
app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const data = db.read();
  const artToDelete = data.gallery.find(art => art.id === id);
  
  if (artToDelete && artToDelete.imageUrl && artToDelete.imageUrl.includes('cloudinary.com')) {
    try {
      const urlParts = artToDelete.imageUrl.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      const filename = filenameWithExt.split('.')[0];
      const publicId = `tcm-arts/${filename}`;
      
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
    }
  }
  
  const filteredGallery = data.gallery.filter(art => art.id !== id);

  if (filteredGallery.length === data.gallery.length) {
    return res.status(404).json({ error: 'Art piece not found' });
  }

  data.gallery = filteredGallery;
  db.write(data);
  res.json({ message: 'Art piece deleted successfully!' });
});

// Add class
app.post('/api/classes', requireAdmin, (req, res) => {
  const { category, title, description, schedule, price } = req.body;
  if (!category || !title || !description || !schedule || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const data = db.read();
  const newClass = {
    id: 'class-' + Date.now(),
    category,
    title,
    description,
    schedule,
    price: parseFloat(price)
  };

  data.classes.push(newClass);
  db.write(data);
  res.status(201).json({ message: 'Class added successfully!', classItem: newClass });
});

// Edit class
app.put('/api/classes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, schedule, price } = req.body;

  const data = db.read();
  const classIndex = data.classes.findIndex(c => c.id === id);

  if (classIndex === -1) {
    return res.status(404).json({ error: 'Class not found' });
  }

  data.classes[classIndex] = {
    ...data.classes[classIndex],
    title: title || data.classes[classIndex].title,
    description: description || data.classes[classIndex].description,
    schedule: schedule || data.classes[classIndex].schedule,
    price: price ? parseFloat(price) : data.classes[classIndex].price
  };

  db.write(data);
  res.json({ message: 'Class updated successfully!', classItem: data.classes[classIndex] });
});

// Delete class
app.delete('/api/classes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const data = db.read();
  const filteredClasses = data.classes.filter(c => c.id !== id);

  if (filteredClasses.length === data.classes.length) {
    return res.status(404).json({ error: 'Class not found' });
  }

  data.classes = filteredClasses;
  db.write(data);
  res.json({ message: 'Class deleted successfully!' });
});

// View all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const data = db.read();
  const safeUsers = data.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});


// ==========================================
// 4. BOOKINGS & CUSTOM COMMISSIONS
// ==========================================

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { classId } = req.body;
  if (!classId) {
    return res.status(400).json({ error: 'Class ID is required' });
  }

  const data = db.read();
  const classItem = data.classes.find(c => c.id === classId);
  if (!classItem) {
    return res.status(404).json({ error: 'Class/Session not found' });
  }

  const alreadyBooked = data.bookings.find(b => b.userId === req.user.id && b.classId === classId);
  if (alreadyBooked) {
    return res.status(400).json({ error: 'You are already registered for this class.' });
  }

  const newBooking = {
    id: 'book-' + Date.now(),
    userId: req.user.id,
    userName: req.user.name,
    classId: classItem.id,
    classTitle: classItem.title,
    classCategory: classItem.category,
    schedule: classItem.schedule,
    price: classItem.price,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  data.bookings.push(newBooking);
  db.write(data);

  res.status(201).json({ message: 'Successfully booked class!', booking: newBooking });
});

app.get('/api/bookings/my', authenticateToken, (req, res) => {
  const data = db.read();
  const myBookings = data.bookings.filter(b => b.userId === req.user.id);
  res.json(myBookings);
});

app.post('/api/commissions', authenticateToken, (req, res) => {
  const { medium, size, description, targetDate } = req.body;
  if (!medium || !size || !description) {
    return res.status(400).json({ error: 'Medium, size, and details are required' });
  }

  const data = db.read();
  const newCommission = {
    id: 'comm-' + Date.now(),
    userId: req.user.id,
    userName: req.user.name,
    medium,
    size,
    description,
    targetDate: targetDate || 'Flexible',
    status: 'Pending Review',
    createdAt: new Date().toISOString()
  };

  data.commissions.push(newCommission);
  db.write(data);

  res.status(201).json({ message: 'Commission request submitted successfully!', commission: newCommission });
});

app.get('/api/commissions/my', authenticateToken, (req, res) => {
  const data = db.read();
  const myCommissions = data.commissions.filter(c => c.userId === req.user.id);
  res.json(myCommissions);
});

app.get('/api/admin/commissions', requireAdmin, (req, res) => {
  const data = db.read();
  res.json(data.commissions);
});

app.put('/api/admin/commissions/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const data = db.read();
  const index = data.commissions.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Commission request not found' });
  }

  data.commissions[index].status = status;
  db.write(data);
  res.json({ message: 'Commission status updated successfully!', commission: data.commissions[index] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`============================================`);
  console.log(`🚀 TCM Arts Server running on port ${PORT}`);
  console.log(`👤 Admin: tevinmuthengia@gmail.com (pwd: Muthengia2040#)`);
  console.log(`👤 Owner: thecommonmass@gmail.com (pwd: Tesh@2026)`);
  console.log(`📸 Images stored in Cloudinary (persistent!)`);
  console.log(`⚡ Max file size: 50MB`);
  console.log(`============================================`);
});
