const express = require('express');
const { createItem } = require('../models/InventoryItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { item_name, stock, unit, price, starting_quantity, picture } = req.body;
  const newItem = await createItem(item_name, stock, unit, price, starting_quantity, picture);
  res.status(201).json(newItem);
});

module.exports = router;
