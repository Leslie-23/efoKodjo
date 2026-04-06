const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const SiteContent = require('../models/SiteContent');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper: get or create the single site content document
async function getContent() {
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create({});
  }
  return content;
}

// GET site content (public)
router.get('/', async (req, res) => {
  try {
    const content = await getContent();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update site content (admin)
router.put('/', async (req, res) => {
  try {
    const content = await getContent();
    const fields = [
      'hero', 'origin', 'persona', 'collabs',
      'contentFeed', 'services', 'contact', 'marqueeText',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    });
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

module.exports = router;
