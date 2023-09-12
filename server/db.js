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
});

module.exports = db;
