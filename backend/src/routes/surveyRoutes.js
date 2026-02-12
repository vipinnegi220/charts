const express = require('express');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');
const { uploadSurvey, getDashboard, listSurveys, generateReport } = require('../controllers/surveyController');
const { uploadDir } = require('../config/env');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.xlsx') {
      return cb(new Error('Only .xlsx files are supported'));
    }
    return cb(null, true);
  }
});

router.use(authMiddleware);
router.get('/', listSurveys);
router.post('/upload', upload.single('surveyFile'), uploadSurvey);
router.get('/:id/dashboard', getDashboard);
router.get('/:id/report', generateReport);

module.exports = router;
