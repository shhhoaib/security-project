const Database = require('better-sqlite3');

// Database banao
const db = new Database('users.db');

// Users table banao
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Test users daalo
const insert = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
insert.run('admin', 'Admin@123');
insert.run('shoaib', 'Shoaib@123');

console.log('Database ready!');

module.exports = db;
