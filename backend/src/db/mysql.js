const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

// DB_SSL_CA can be the PEM contents directly (e.g. set as a Render env var),
// or a path to a local cert file (e.g. for local dev against backend/certs/).
function loadCaCert() {
    const value = process.env.DB_SSL_CA;
    if (!value) return undefined;
    if (value.includes('BEGIN CERTIFICATE')) return value;
    return fs.readFileSync(value);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: loadCaCert(),
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;