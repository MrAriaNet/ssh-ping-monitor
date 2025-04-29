const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../ping_data.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(\`CREATE TABLE IF NOT EXISTS pings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        target TEXT,
        success INTEGER,
        time REAL,
        timestamp TEXT
    )\`);
});

function insertPing({ source, target, success, time, timestamp }) {
    const stmt = db.prepare(\`INSERT INTO pings (source, target, success, time, timestamp) VALUES (?, ?, ?, ?, ?)\`);
    stmt.run(source, target, success ? 1 : 0, time, timestamp);
    stmt.finalize();
}

function getLastPings(limit = 100) {
    return new Promise((resolve, reject) => {
        db.all(\`SELECT * FROM pings ORDER BY id DESC LIMIT ?\`, [limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.reverse());
        });
    });
}

module.exports = { insertPing, getLastPings };
