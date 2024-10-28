const multer = require("multer");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// MIME types for voice notes
const voiceMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;

    // Check the file type to determine the upload directory
    if (voiceMimeTypes.includes(file.mimetype)) {
      // Directory for voice notes
      uploadDir = path.join(__dirname, './public/voice-notes');
    } else {
      // Directory for images/videos (default behavior)
      uploadDir = path.join(__dirname, './public/artits');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdir(uploadDir, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
          return cb(err);
        }
        cb(null, uploadDir);
      });
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generates a 32-character unique string
    const extension = file.originalname.split('.').pop(); // Get the file extension

    cb(null, `${uniqueSuffix}.${extension}`); // Save as uniqueSuffix.extension
  }
});

// File filter to restrict uploads to images, videos, and voice notes
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'video/mp4', 'video/mpeg',
    ...voiceMimeTypes // Add voice MIME types
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

// Set up multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
