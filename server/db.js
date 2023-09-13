// db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numberValue INTEGER
      )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS columns_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      columnName TEXT UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS A (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isChecked INTEGER,
      uuid TEXT UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS B (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isActive INTEGER,
      uuid TEXT UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS C (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      uuid TEXT UNIQUE
    )
  `);
});

module.exports = db;
