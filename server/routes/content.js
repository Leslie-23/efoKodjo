const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const SiteContent = require('../models/SiteContent');
const Image = require('../models/Image');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
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

// POST upload image -> MongoDB
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const image = await Image.create({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname,
    });
    res.json({ url: `/api/content/images/${image._id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET serve image from MongoDB
router.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', image.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
