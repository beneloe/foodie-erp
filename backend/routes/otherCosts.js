const express = require('express');
const { createOtherCost, getAllOtherCosts } = require('../models/OtherCost');
const { createOtherCostItem, getAllOtherCostItems } = require('../models/OtherCostItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, vendor, amount, paid, status, items } = req.body;
  try {
    const otherCost = await createOtherCost(date, vendor, amount, paid, status);
    for (const item of items) {
      await createOtherCostItem(otherCost.id, item.line_item, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(otherCost);
  } catch (error) {
    console.error('Error creating other cost:', error);
    res.status(500).json({ error: 'Failed to create other cost' });
  }
});

router.get('/', async (req, res) => {
  try {
    const otherCosts = await getAllOtherCosts();
    const otherCostItems = await getAllOtherCostItems();
    res.status(200).json({ otherCosts, otherCostItems });
  } catch (error) {
    console.error('Error fetching other costs:', error);
    res.status(500).json({ error: 'Failed to fetch other costs' });
  }
});

module.exports = router;
