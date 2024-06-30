const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const router = express.Router();

// validation middleware
const validateInventoryItem = [
  body('item_name').isString().trim().escape().notEmpty().withMessage('Item name is required'),
  body('stock').isFloat({ min: 0.01 }).withMessage('Stock must be a positive number'),
  body('unit').isString().trim().escape().notEmpty().withMessage('Unit is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
];

router.post('/add', validateInventoryItem, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { item_name, stock, unit, price } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO inventory_item (item_name, stock, unit, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [item_name, stock, unit, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory_item');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
