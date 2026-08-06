const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Memory storage for direct uploads
const storage = multer.memoryStorage();

// Shared image-type filter used by every upload middleware.
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, png, gif, webp) are allowed!'));
};

// Single-image upload (used by the gallery artwork routes).
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  },
  fileFilter: imageFileFilter
});

// Multi-image upload (used by the products routes). Products can carry up
// to 3 view pictures (front, rear, whole), so the cap must exceed 1 file.
// The previous shared `files: 1` limit caused multer to abort multi-view
// uploads mid-stream, which the frontend mistook for a network failure and
// retried — making product uploads appear extremely slow.
const uploadProductImages = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 4
  },
  fileFilter: imageFileFilter
});

// Helper function to upload to Cloudinary with better error handling
const uploadToCloudinary = (fileBuffer, folder = 'tcm-arts') => {
  return new Promise((resolve, reject) => {
    console.log(`Starting Cloudinary upload, buffer size: ${fileBuffer.length} bytes`);
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
        timeout: 120000 // 2 minute timeout
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, upload, uploadProductImages, uploadToCloudinary };