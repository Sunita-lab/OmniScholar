const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const { getGFSBucket } = require('../config/gridfs');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload a single file
// @route   POST /api/upload
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const gfsBucket = getGFSBucket();
  const filename = `${Date.now()}-${req.file.originalname}`;

  const readableStream = new Readable();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(filename, {
    contentType: req.file.mimetype,
  });

  readableStream.pipe(uploadStream);

  uploadStream.on('finish', () => {
    res.status(201).json({
      message: 'File uploaded successfully',
      fileId: uploadStream.id,
      filename: filename,
    });
  });

  uploadStream.on('error', (error) => {
    res.status(500).json({ message: error.message });
  });
});

// @desc    Get/download a file by ID
// @route   GET /api/upload/:id
router.get('/:id', async (req, res) => {
  try {
    const gfsBucket = getGFSBucket();
    const fileId = new (require('mongodb').ObjectId)(req.params.id);

    const downloadStream = gfsBucket.openDownloadStream(fileId);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;