const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '../../..');
dotenv.config({ path: path.join(rootDir, '.env') });

module.exports = {
  port: process.env.BACKEND_PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  dbPath: process.env.SQLITE_PATH || path.join(rootDir, 'database', 'survey.db'),
  uploadDir: process.env.UPLOAD_DIR || path.join(rootDir, 'uploads'),
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'
};
