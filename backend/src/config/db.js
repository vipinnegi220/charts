const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { dbPath } = require('./env');

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return db;
}

module.exports = { getDb };
