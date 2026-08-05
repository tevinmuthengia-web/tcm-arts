const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const { authenticateToken, requireAdmin, JWT_SECRET } = require('./middleware/auth');

// Import Cloudinary configuration
const { cloudinary, upload, uploadToCloudinary } = require('./config/cloudinary');

// Import Supabase database pool
const pool = require('./config/supabase');

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

// Register standard member
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUserId = 'user-' + Date.now();
    
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newUserId, name, email.toLowerCase(), hashedPassword, 'member', new Date().toISOString()]
    );

    const token = jwt.sign(
      { id: newUserId, name, email: email.toLowerCase(), role: 'member' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: newUserId, name, email: email.toLowerCase(), role: 'member' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    const user = result.rows[0];

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});


// ==========================================
// 2. PUBLIC DATA RETRIEVAL ENDPOINTS
// ==========================================

// Get editable site text blocks
app.get('/api/content', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_content');
    const content = {};
    result.rows.forEach(row => {
      content[row.key] = row.value;
    });
    res.json(content);
  } catch (error) {
    console.error('Content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// Get art gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ error: 'Failed to get gallery' });
  }
});

// Get classes
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (error) {
    console.error('Classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product (Admin)
app.post('/api/products', requireAdmin, upload.any(), async (req, res) => {
  const { name, category, subcategory, description, price, inStock } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  try {
    let imageUrl = req.body.imageUrl || '';
    let imageFront = req.body.imageFront || '';
    let imageRear = req.body.imageRear || '';
    let imageWhole = req.body.imageWhole || '';

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        if (file.fieldname === 'imageFront') imageFront = uploaded.secure_url;
        else if (file.fieldname === 'imageRear') imageRear = uploaded.secure_url;
        else if (file.fieldname === 'imageWhole') imageWhole = uploaded.secure_url;
        else if (file.fieldname === 'image') imageUrl = uploaded.secure_url;
      }
    }

    if (!imageUrl) imageUrl = imageWhole || imageFront || imageRear || '';
    if (!imageFront) imageFront = imageUrl;
    if (!imageRear) imageRear = imageUrl;
    if (!imageWhole) imageWhole = imageUrl;

    const newId = 'prod-' + Date.now();
    const isStockBool = inStock === 'false' || inStock === false ? false : true;

    await pool.query(
      `INSERT INTO products (id, name, category, subcategory, description, price, image_url, image_front, image_rear, image_whole, in_stock, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [newId, name, category, subcategory || '', description || '', parseFloat(price), imageUrl, imageFront, imageRear, imageWhole, isStockBool, new Date().toISOString()]
    );

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [newId]);
    res.status(201).json({ message: 'Product added successfully!', product: result.rows[0] });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product: ' + error.message });
  }
});

// Edit product (Admin)
app.put('/api/products/:id', requireAdmin, upload.any(), async (req, res) => {
  const { id } = req.params;
  const { name, category, subcategory, description, price, inStock } = req.body;

  try {
    let imageUrl = req.body.imageUrl || null;
    let imageFront = req.body.imageFront || null;
    let imageRear = req.body.imageRear || null;
    let imageWhole = req.body.imageWhole || null;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        if (file.fieldname === 'imageFront') imageFront = uploaded.secure_url;
        else if (file.fieldname === 'imageRear') imageRear = uploaded.secure_url;
        else if (file.fieldname === 'imageWhole') imageWhole = uploaded.secure_url;
        else if (file.fieldname === 'image') imageUrl = uploaded.secure_url;
      }
    }

    const isStockBool = inStock !== undefined && inStock !== null && inStock !== '' ? (inStock === 'true' || inStock === true) : null;

    await pool.query(
      `UPDATE products SET 
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        subcategory = COALESCE($3, subcategory),
        description = COALESCE($4, description),
        price = COALESCE($5, price),
        image_url = COALESCE($6, image_url),
        image_front = COALESCE($7, image_front),
        image_rear = COALESCE($8, image_rear),
        image_whole = COALESCE($9, image_whole),
        in_stock = COALESCE($10, in_stock)
       WHERE id = $11`,
      [
        name || null,
        category || null,
        subcategory || null,
        description || null,
        price ? parseFloat(price) : null,
        imageUrl,
        imageFront,
        imageRear,
        imageWhole,
        isStockBool,
        id
      ]
    );

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product updated successfully!', product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product: ' + error.message });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});



// ==========================================
// 3. ADMIN CONTENT MANAGEMENT (CMS) ENDPOINTS
// ==========================================

// Update any textual content block
app.put('/api/content', requireAdmin, async (req, res) => {
  const newContent = req.body;
  
  try {
    for (const [key, value] of Object.entries(newContent)) {
      await pool.query(
        `INSERT INTO site_content (key, value) 
         VALUES ($1, $2) 
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, value]
      );
    }
    res.json({ message: 'Website content updated successfully!', siteContent: newContent });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Add new painting/portrait to gallery
app.post('/api/gallery', requireAdmin, upload.single('image'), async (req, res) => {
  const { title, description, medium, price } = req.body;
  
  if (!title || !description || !medium || !price) {
    return res.status(400).json({ error: 'All description fields are required' });
  }

  try {
    let imageUrl = req.body.imageUrl || '';
    
    if (req.file) {
      const fileSizeMB = req.file.size / 1024 / 1024;
      console.log(`Processing upload: ${req.file.originalname} (${fileSizeMB.toFixed(2)} MB)`);
      
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      console.log('Upload successful, URL:', imageUrl);
      
      req.file.buffer = null;
    }

    const newArtId = 'art-' + Date.now();
    
    await pool.query(
      `INSERT INTO gallery (id, title, description, medium, image_url, price, is_sold, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [newArtId, title, description, medium, imageUrl, parseFloat(price), false, new Date().toISOString()]
    );

    const result = await pool.query('SELECT * FROM gallery WHERE id = $1', [newArtId]);
    
    res.status(201).json({ 
      message: 'Art piece added successfully!', 
      art: result.rows[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// Edit gallery piece details
app.put('/api/gallery/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, medium, price, isSold } = req.body;

  try {
    let imageUrl = null;
    
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      req.file.buffer = null;
    }

    let updateQuery = `UPDATE gallery SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      medium = COALESCE($3, medium),
      price = COALESCE($4, price),
      is_sold = COALESCE($5, is_sold)`;
    
    const params = [title || null, description || null, medium || null, price ? parseFloat(price) : null, isSold === 'true' || isSold === true];
    
    if (imageUrl) {
      updateQuery += `, image_url = $6`;
      params.push(imageUrl);
    }
    
    updateQuery += ` WHERE id = $${params.length + 1}`;
    params.push(id);
    
    await pool.query(updateQuery, params);
    
    const result = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    res.json({ message: 'Art piece updated successfully!', art: result.rows[0] });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update art piece' });
  }
});

// Delete gallery piece
app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Art piece not found' });
    }
    
    res.json({ message: 'Art piece deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete art piece' });
  }
});

// Add class
app.post('/api/classes', requireAdmin, async (req, res) => {
  const { category, title, description, schedule, price } = req.body;
  if (!category || !title || !description || !schedule || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newClassId = 'class-' + Date.now();
    
    await pool.query(
      `INSERT INTO classes (id, category, title, description, schedule, price) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newClassId, category, title, description, schedule, parseFloat(price)]
    );

    const result = await pool.query('SELECT * FROM classes WHERE id = $1', [newClassId]);
    res.status(201).json({ message: 'Class added successfully!', classItem: result.rows[0] });
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({ error: 'Failed to add class' });
  }
});

// Edit class
app.put('/api/classes/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, schedule, price } = req.body;

  try {
    await pool.query(
      `UPDATE classes SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        schedule = COALESCE($3, schedule),
        price = COALESCE($4, price)
       WHERE id = $5`,
      [title || null, description || null, schedule || null, price ? parseFloat(price) : null, id]
    );

    const result = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
    res.json({ message: 'Class updated successfully!', classItem: result.rows[0] });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class
app.delete('/api/classes/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM classes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    res.json({ message: 'Class deleted successfully!' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// View all users (Admin only)
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});


// ==========================================
// 4. BOOKINGS & CUSTOM COMMISSIONS
// ==========================================

// Create booking for classes/sessions
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { classId } = req.body;
  if (!classId) {
    return res.status(400).json({ error: 'Class ID is required' });
  }

  try {
    const classResult = await pool.query('SELECT * FROM classes WHERE id = $1', [classId]);
    const classItem = classResult.rows[0];
    
    if (!classItem) {
      return res.status(404).json({ error: 'Class/Session not found' });
    }

    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 AND class_id = $2',
      [req.user.id, classId]
    );
    
    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ error: 'You are already registered for this class.' });
    }

    const newBookingId = 'book-' + Date.now();
    
    await pool.query(
      `INSERT INTO bookings (id, user_id, user_name, class_id, class_title, class_category, schedule, price, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [newBookingId, req.user.id, req.user.name, classItem.id, classItem.title, classItem.category, classItem.schedule, classItem.price, 'Confirmed', new Date().toISOString()]
    );

    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [newBookingId]);
    res.status(201).json({ message: 'Successfully booked class!', booking: result.rows[0] });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
app.get('/api/bookings/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Request portrait/art commission
app.post('/api/commissions', authenticateToken, async (req, res) => {
  const { medium, size, description, targetDate } = req.body;
  if (!medium || !size || !description) {
    return res.status(400).json({ error: 'Medium, size, and details are required' });
  }

  try {
    const newCommissionId = 'comm-' + Date.now();
    
    await pool.query(
      `INSERT INTO commissions (id, user_id, user_name, medium, size, description, target_date, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [newCommissionId, req.user.id, req.user.name, medium, size, description, targetDate || 'Flexible', 'Pending Review', new Date().toISOString()]
    );

    const result = await pool.query('SELECT * FROM commissions WHERE id = $1', [newCommissionId]);
    res.status(201).json({ message: 'Commission request submitted successfully!', commission: result.rows[0] });
  } catch (error) {
    console.error('Commission error:', error);
    res.status(500).json({ error: 'Failed to submit commission' });
  }
});

// Get user's commission requests
app.get('/api/commissions/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM commissions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ error: 'Failed to get commissions' });
  }
});

// View all commissions (Admin only)
app.get('/api/admin/commissions', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM commissions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all commissions error:', error);
    res.status(500).json({ error: 'Failed to get commissions' });
  }
});

// Update commission status (Admin only)
app.put('/api/admin/commissions/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE commissions SET status = $1 WHERE id = $2',
      [status, id]
    );

    const result = await pool.query('SELECT * FROM commissions WHERE id = $1', [id]);
    res.json({ message: 'Commission status updated successfully!', commission: result.rows[0] });
  } catch (error) {
    console.error('Update commission error:', error);
    res.status(500).json({ error: 'Failed to update commission status' });
  }
});


// ==========================================
// 5. PASSWORD RESET & ACCOUNT DELETION
// ==========================================

// Forgot Password - Request reset
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // DEBUG: Check if FRONTEND_URL is set
  console.log('========== DEBUG: PASSWORD RESET ==========');
  console.log('FRONTEND_URL from env:', process.env.FRONTEND_URL);
  console.log('Request received for email:', email);
  console.log('===========================================');

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found for email:', email);
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET + '_reset',
      { expiresIn: '1h' }
    );

    await pool.query('UPDATE users SET reset_token = $1, reset_expires = NOW() + INTERVAL \'1 hour\' WHERE id = $2', 
      [resetToken, user.id]);

    const frontendUrl = process.env.FRONTEND_URL || 'https://tcm-arts.onrender.com';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    console.log('========== PASSWORD RESET LINK ==========');
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('========================================');
    
    res.json({ 
      message: 'Password reset link generated. Check the server logs for the link.',
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset Password - Set new password
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET + '_reset');
    
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND reset_token = $2 AND reset_expires > NOW()',
      [decoded.id, token]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2',
      [hashedPassword, decoded.id]
    );

    res.json({ message: 'Password has been reset successfully!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Invalid or expired token' });
  }
});

// Delete own account (Member)
app.delete('/api/auth/delete-account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.query('DELETE FROM bookings WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM commissions WHERE user_id = $1', [userId]);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Admin - Delete any user
app.delete('/api/admin/users/:userId', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  
  if (userId === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own admin account' });
  }

  try {
    await pool.query('DELETE FROM bookings WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM commissions WHERE user_id = $1', [userId]);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// ==========================================
// 6. ARTWORK PURCHASE & M-PESA
// ==========================================

// Purchase artwork - marks as sold and sends notification
app.post('/api/gallery/:id/purchase', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log('🔍 ===== PURCHASE REQUEST RECEIVED =====');
  console.log('Artwork ID:', id);
  console.log('User:', req.user ? req.user.email : 'Not authenticated');
  
  try {
    // Check if artwork exists and is not sold
    const artResult = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    const artwork = artResult.rows[0];
    
    console.log('Artwork found:', artwork ? artwork.title : 'NOT FOUND');
    
    if (!artwork) {
      console.log('❌ Artwork not found');
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    if (artwork.is_sold) {
      console.log('❌ Artwork already sold');
      return res.status(400).json({ error: 'This artwork has already been sold' });
    }
    
    // Mark as sold
    console.log('✅ Marking artwork as sold...');
    await pool.query('UPDATE gallery SET is_sold = true WHERE id = $1', [id]);
    
    // Get the updated artwork
    const updatedArt = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    console.log('✅ Artwork marked as sold successfully!');
    
    // Send email notification to admin (if Resend is configured)
    try {
      const { sendPurchaseNotification } = require('./services/emailService');
      const buyer = {
        name: req.user.name || 'Guest',
        email: req.user.email || 'No email provided'
      };
      await sendPurchaseNotification(artwork, buyer, artwork.price);
      console.log('✅ Email notification sent to admin');
    } catch (emailError) {
      console.error('⚠️ Email notification failed (continuing):', emailError.message);
      // Continue anyway - the purchase is still successful
    }
    
    // Return the updated artwork
    res.json({
      message: `"${artwork.title}" has been marked as sold. Thank you!`,
      artwork: updatedArt.rows[0],
      mpesa: {
        description: `Purchase of ${artwork.title}`,
        amount: artwork.price,
        instructions: 'Payment received. Artwork is now reserved for you.'
      }
    });
    console.log('✅ Purchase completed successfully!');
    console.log('============================================');
  } catch (error) {
    console.error('❌ Purchase error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to process purchase: ' + error.message });
  }
});

// Get purchase information for an artwork (for checkout)
app.get('/api/gallery/:id/purchase-info', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const artResult = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    const artwork = artResult.rows[0];
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    if (artwork.is_sold) {
      return res.status(400).json({ error: 'This artwork has already been sold' });
    }
    
    res.json({
      artwork: {
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        image_url: artwork.image_url
      },
      payment: {
        method: 'M-Pesa',
        amount: artwork.price,
        instructions: `Please send Ksh ${artwork.price.toLocaleString()} to M-Pesa Paybill: 522533 Account: 8070026. Reference: ART-${artwork.id}`
      }
    });
  } catch (error) {
    console.error('Purchase info error:', error);
    res.status(500).json({ error: 'Failed to get purchase information' });
  }
});


// ==========================================
// 7. PRODUCTS DATABASE TABLE INIT
// ==========================================
const initProductsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        description TEXT,
        price NUMERIC NOT NULL,
        image_url TEXT,
        image_front TEXT,
        image_rear TEXT,
        image_whole TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Demo products are no longer auto-seeded. Previously, demo rows were
    // re-inserted whenever the table was empty, which reappeared on every
    // Render restart/sleep-wake. Permanently remove any leftover demo rows.
    const demoIds = ['prod-skate-1', 'prod-skate-2', 'prod-art-1', 'prod-art-2', 'prod-art-3', 'prod-skate-3'];
    await pool.query('DELETE FROM products WHERE id = ANY($1)', [demoIds]);
  } catch (err) {
    console.error('Error initializing products table:', err);
  }
};

// Initialize products table on startup
initProductsTable();

// ==========================================
// Start the server
// ==========================================
app.listen(PORT, () => {
  console.log(`============================================`);
  console.log(`🚀 TCM Arts Server running on port ${PORT}`);
  console.log(`👤 Admin: tevinmuthengia@gmail.com (pwd: Muthengia2040#)`);
  console.log(`👤 Owner: thecommonmass@gmail.com (pwd: Tesh@2026)`);
  console.log(`📸 Images stored in Cloudinary (persistent!)`);
  console.log(`🗄️ Database: Supabase PostgreSQL (permanent storage!)`);
  console.log(`============================================`);
});
