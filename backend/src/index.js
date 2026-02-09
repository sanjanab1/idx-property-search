const express = require('express');
const cors = require('cors');
const pool = require('./db/mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: error && error.message ? error.message : 'Unknown error',
            code: error && error.code ? error.code : undefined,
            errno: error && error.errno ? error.errno : undefined,
            sqlMessage: error && error.sqlMessage ? error.sqlMessage : undefined
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});