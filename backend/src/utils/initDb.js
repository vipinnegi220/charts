const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { uploadDir } = require('../config/env');

async function init() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      metadata_json TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS survey_rows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_id INTEGER NOT NULL,
      row_json TEXT NOT NULL,
      FOREIGN KEY(survey_id) REFERENCES surveys(id)
    );
  `);

  const existing = await db.get('SELECT id FROM users WHERE email = ?', ['demo@saas.com']);
  if (!existing) {
    const hash = await bcrypt.hash('password123', 10);
    await db.run(
      'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
      ['demo@saas.com', hash, 'Demo Analyst']
    );
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(path.resolve(__dirname, '../../../sample-data'), { recursive: true });

  console.log('Database initialized and demo user ready (demo@saas.com / password123).');
}

init();
