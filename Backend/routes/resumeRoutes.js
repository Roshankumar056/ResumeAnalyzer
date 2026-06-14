const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { analyzeResume, getHistory } = require('../controllers/resumeController');

// POST /api/resume/analyze
router.post('/analyze', upload.single('resume'), analyzeResume);

// GET /api/resume/history
router.get('/history', getHistory);

module.exports = router;