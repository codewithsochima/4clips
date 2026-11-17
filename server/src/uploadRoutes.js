
const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { execFile } = require('child_process');

const router = express.Router();

// Define where uploaded videos will be stored
const uploadDirectory = path.join(__dirname, '../uploads');

// Create the uploads folder if it doesn't exist
fs.mkdirSync(uploadDirectory, { recursive: true });

// Verify that an uploaded file is a valid video
function verifyVideo(filePath) {
  return new Promise((resolve, reject) => {
    execFile(
      'ffprobe',
      [
        '-v', 'error',
        '-show_entries', 'stream=codec_type,width,height',
        '-show_entries', 'format=duration',
        '-of', 'json',
        filePath
      ],
      (error, stdout) => {
        if (error) {
          return reject(
            new Error('Invalid or unreadable video file.')
          );
        }

        try {
          const metadata = JSON.parse(stdout);

          const videoStream = metadata.streams?.find(
            (stream) => stream.codec_type === 'video'
          );

          const duration = Number(metadata.format?.duration);

          if (
            !videoStream ||
            !Number.isFinite(duration) ||
            duration <= 0
          ) {
            return reject(
              new Error('The uploaded file is not a valid video.')
            );
          }

          resolve({
            duration,
            width: videoStream.width ?? null,
            height: videoStream.height ?? null
          });

        } catch {
          reject(
            new Error('Could not read video information.')
          );
        }
      }
    );
  });
}

// Configure where and how uploaded videos are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`;

    cb(null, uniqueName);
  }
});

// Configure Multer
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 500 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      '.mp4',
      '.mov',
      '.mkv',
      '.webm',
      '.avi'
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported video format. Please upload MP4, MOV, MKV, WEBM or AVI.'
        )
      );
    }
  }
});

// Video upload endpoint
router.post('/upload', upload.single('video'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select a video to upload.'
    });
  }

  try {
    const metadata = await verifyVideo(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Video uploaded and verified successfully!',

      video: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height
      }
    });

  } catch (error) {
    await fs.promises.unlink(req.file.path).catch(() => {});

    next(error);
  }
});

// Handle upload errors
router.use((err, req, res, next) => {
  console.error('Upload error:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'Video is too large. Maximum upload size is 500 MB.'
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || 'Something went wrong during upload.'
  });
});

module.exports = router;
