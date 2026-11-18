
const express = require('express');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

const router = express.Router();

// Locate Python and our transcription script
const PYTHON_PATH = path.resolve(
  __dirname,
  '../../ai-env/Scripts/python.exe'
);

const SCRIPT_PATH = path.resolve(
  __dirname,
  '../../ai/transcribe.py'
);

// Where uploaded videos are stored
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

// Transcribe an uploaded video
router.post('/transcribe', (req, res) => {
  const { filename } = req.body;

  // Validate the filename
  if (
    typeof filename !== 'string' ||
    !filename ||
    path.basename(filename) !== filename
  ) {
    return res.status(400).json({
      success: false,
      message: 'A valid video filename is required.'
    });
  }

  // Locate the uploaded video
  const videoPath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({
      success: false,
      message: 'Video file not found.'
    });
  }

  if (!fs.existsSync(PYTHON_PATH) || !fs.existsSync(SCRIPT_PATH)) {
    return res.status(500).json({
      success: false,
      message: 'Python transcription setup is incomplete.'
    });
  }

  // Run the Python transcription script
  execFile(
    PYTHON_PATH,
    [SCRIPT_PATH, videoPath],
    {
      timeout: 30 * 60 * 1000,
      maxBuffer: 20 * 1024 * 1024
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error('Transcription failed:', stderr || error.message);

        return res.status(500).json({
          success: false,
          message: 'Video transcription failed.'
        });
      }

      try {
        const transcript = JSON.parse(stdout);

        if (transcript.error) {
          return res.status(400).json({
            success: false,
            message: transcript.error
          });
        }

        return res.json({
          success: true,
          message: 'Video transcribed successfully.',
          transcript
        });

      } catch (parseError) {
        console.error('Invalid transcription response:', parseError);

        return res.status(500).json({
          success: false,
          message: 'Could not read the transcription result.'
        });
      }
    }
  );
});

module.exports = router;
