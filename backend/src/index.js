require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/mysql');
const propertiesRouter = require('./routes/properties');

const app = express();
const PORT = process.env.PORT || 5001;

// Allow requests from your deployed frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.use('/api/properties', propertiesRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});