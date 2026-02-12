const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: process.env.BACKEND_PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  dbPath: process.env.SQLITE_PATH || path.resolve(__dirname, '../../database/survey.db'),
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'
};
