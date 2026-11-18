
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { execFile } = require('child_process');

const router = express.Router();

// Folder containing uploaded original videos
const uploadDirectory = path.join(__dirname, '../uploads');

// Folder where generated clips will be stored
const processedDirectory = path.join(__dirname, '../processed');

// Create the processed folder if it doesn't exist
fs.mkdirSync(processedDirectory, { recursive: true });


// Create a video clip using FFmpeg
function createClip(inputPath, outputPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    execFile(
      'ffmpeg',
      [
        '-y',
        '-ss', String(startTime),
        '-i', inputPath,
        '-t', String(duration),
        '-map', '0:v:0',
        '-map', '0:a?',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputPath
      ],
      { timeout: 10 * 60 * 1000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('FFmpeg error:', stderr);

          return reject(
            new Error('Could not create the video clip.')
          );
        }

        resolve(outputPath);
      }
    );
  });
}


// Get the total duration of an uploaded video
function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    execFile(
      'ffprobe',
      [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        filePath
      ],
      (error, stdout) => {
        if (error) {
          return reject(
            new Error('Could not read the video duration.')
          );
        }

        const duration = Number(stdout.trim());

        if (!Number.isFinite(duration) || duration <= 0) {
          return reject(
            new Error('Invalid video duration.')
          );
        }

        resolve(duration);
      }
    );
  });
}


// Create a video clip endpoint
router.post('/create', async (req, res) => {
  const { filename, startTime, duration } = req.body;

  // Validate the submitted information
  if (
    typeof filename !== 'string' ||
    !Number.isFinite(startTime) ||
    !Number.isFinite(duration) ||
    startTime < 0 ||
    duration <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid filename, start time and duration.'
    });
  }

  // Prevent folder path manipulation
  if (filename !== path.basename(filename)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid video filename.'
    });
  }

  // Locate the uploaded video
  const inputPath = path.join(uploadDirectory, filename);

  // Check whether the uploaded video exists
  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({
      success: false,
      message: 'Uploaded video not found. Please upload it again.'
    });
  }

  try {
    // Get the original video's duration
    const videoDuration = await getVideoDuration(inputPath);

    // Make sure the requested clip fits inside the original video
    if (startTime + duration > videoDuration + 0.05) {
      return res.status(400).json({
        success: false,
        message: `The requested clip exceeds the video length. The video is ${videoDuration.toFixed(2)} seconds long.`
      });
    }

    // Generate a unique filename for the new clip
    const clipFilename = `${crypto.randomUUID()}.mp4`;

    // Get the output path
    const outputPath = path.join(processedDirectory, clipFilename);

    // Create the clip
    await createClip(
      inputPath,
      outputPath,
      startTime,
      duration
    );

    // Send the result back to the frontend
    res.status(201).json({
      success: true,
      message: 'Video clip created successfully!',
      clip: {
        filename: clipFilename,
        duration: duration,
        downloadUrl: `/api/clips/${clipFilename}/download`
      }
    });

  } catch (error) {
    console.error('Clip creation error:', error.message);

    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while creating the clip.'
    });
  }
});

// Download a generated video clip
router.get('/:filename/download', (req, res) => {
  const { filename } = req.params;

  // Prevent folder path manipulation
  if (
    filename !== path.basename(filename) ||
    path.extname(filename).toLowerCase() !== '.mp4'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid clip filename.'
    });
  }

  // Locate the generated clip
  const clipPath = path.join(processedDirectory, filename);

  // Check whether the clip exists
  if (!fs.existsSync(clipPath)) {
    return res.status(404).json({
      success: false,
      message: 'Clip not found. It may have expired.'
    });
  }

  // Send the clip to the user
  res.download(clipPath, filename);
});

module.exports = router;
