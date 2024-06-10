const express = require('express');
const { createStaffingCost, getAllStaffingCosts } = require('../models/StaffingCost');
const { createStaffingCostItem, getAllStaffingCostItems } = require('../models/StaffingCostItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, period, employee, amount, paid, items } = req.body;
  try {
    const staffingCost = await createStaffingCost(date, period, employee, amount, paid);
    for (const item of items) {
      await createStaffingCostItem(staffingCost.id, item.line_item, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(staffingCost);
  } catch (error) {
    console.error('Error creating staffing cost:', error);
    res.status(500).json({ error: 'Failed to create staffing cost' });
  }
});

router.get('/', async (req, res) => {
  try {
    const staffingCosts = await getAllStaffingCosts();
    const staffingCostItems = await getAllStaffingCostItems();
    res.status(200).json({ staffingCosts, staffingCostItems });
  } catch (error) {
    console.error('Error fetching staffing costs:', error);
    res.status(500).json({ error: 'Failed to fetch staffing costs' });
  }
});

module.exports = router;
