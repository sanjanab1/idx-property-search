const experss = require('express');
const router = experss.Router();
const pool = require('../db/mysql'); 

module.exports = router; 

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM rets_property'
        );
        
        const total = countResult[0].total;
    
        const [results] = await pool.query(
            'SELECT * FROM rets_property LIMIT ? OFFSET ?',
            [limit, offset]
        );
    
        res.json({ total, limit, offset, results });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});