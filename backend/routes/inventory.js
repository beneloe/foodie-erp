const express = require('express');
const { createItem, getAllItems } = require('../models/InventoryItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { item_name, stock, unit, price } = req.body;
  try {
    const newItem = await createItem(item_name, stock, unit, price);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Item with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create item' });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await getAllItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;
