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
const { cloudinary, upload } = require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Setup static uploads directory for OLD images (kept for backward compatibility)
// Any existing images in this folder will still be served, but new uploads go to Cloudinary
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Register standard member (free, no subscription needed)
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
    role: 'member', // Default role is member
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.write(data);

  // Generate JWT token
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

// Login
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

// Get user profile
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

// Get editable site text blocks
app.get('/api/content', (req, res) => {
  const data = db.read();
  res.json(data.siteContent);
});

// Get art gallery
app.get('/api/gallery', (req, res) => {
  const data = db.read();
  res.json(data.gallery);
});

// Get classes
app.get('/api/classes', (req, res) => {
  const data = db.read();
  res.json(data.classes);
});


// ==========================================
// 3. ADMIN CONTENT MANAGEMENT (CMS) ENDPOINTS
// ==========================================

// Update any textual content block
app.put('/api/content', requireAdmin, (req, res) => {
  const newContent = req.body;
  const data = db.read();
  
  // Merge the content updates
  data.siteContent = {
    ...data.siteContent,
    ...newContent
  };
  
  db.write(data);
  res.json({ message: 'Website content updated successfully!', siteContent: data.siteContent });
});

// Add new painting/portrait to gallery (UPDATED for Cloudinary)
app.post('/api/gallery', requireAdmin, upload.single('image'), (req, res) => {
  const { title, description, medium, price } = req.body;
  if (!title || !description || !medium || !price) {
    return res.status(400).json({ error: 'All description fields are required' });
  }

  let imageUrl = req.body.imageUrl || '';
  
  // If a file was uploaded, Cloudinary provides the URL in req.file.path
  if (req.file) {
    imageUrl = req.file.path;
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

  res.status(201).json({ message: 'Art piece added successfully!', art: newArt });
});

// Edit gallery piece details (UPDATED for Cloudinary)
app.put('/api/gallery/:id', requireAdmin, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, medium, price, isSold } = req.body;

  const data = db.read();
  const artIndex = data.gallery.findIndex(art => art.id === id);

  if (artIndex === -1) {
    return res.status(404).json({ error: 'Art piece not found' });
  }

  let imageUrl = data.gallery[artIndex].imageUrl;
  
  // If a new file was uploaded, use the Cloudinary URL
  if (req.file) {
    imageUrl = req.file.path;
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
});

// Delete gallery piece (UPDATED to also delete from Cloudinary)
app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const data = db.read();
  const artToDelete = data.gallery.find(art => art.id === id);
  
  // If the image is stored in Cloudinary, delete it from Cloudinary as well
  if (artToDelete && artToDelete.imageUrl && artToDelete.imageUrl.includes('cloudinary.com')) {
    try {
      // Extract the public ID from the Cloudinary URL
      // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/tcm-arts/filename.jpg
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

// View all users (Members + Admins)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const data = db.read();
  // Don't send password hashes!
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

// Create booking for classes/sessions
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

  // Check if already booked to prevent duplicates
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

// Get user's bookings
app.get('/api/bookings/my', authenticateToken, (req, res) => {
  const data = db.read();
  const myBookings = data.bookings.filter(b => b.userId === req.user.id);
  res.json(myBookings);
});

// Request portrait/art commission
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

// Get user's commission requests
app.get('/api/commissions/my', authenticateToken, (req, res) => {
  const data = db.read();
  const myCommissions = data.commissions.filter(c => c.userId === req.user.id);
  res.json(myCommissions);
});

// View all commissions (Admin only)
app.get('/api/admin/commissions', requireAdmin, (req, res) => {
  const data = db.read();
  res.json(data.commissions);
});

// Update commission status (Admin only)
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
  console.log(`============================================`);
});
