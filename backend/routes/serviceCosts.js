const express = require('express');
const { createServiceCost, getAllServiceCosts } = require('../models/ServiceCost');
const { createServiceCostItem, getAllServiceCostItems } = require('../models/ServiceCostItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, vendor, amount, paid, status, items } = req.body;
  try {
    const serviceCost = await createServiceCost(date, vendor, amount, paid, status);
    for (const item of items) {
      await createServiceCostItem(serviceCost.id, item.service_description, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(serviceCost);
  } catch (error) {
    console.error('Error creating service cost:', error);
    res.status(500).json({ error: 'Failed to create service cost' });
  }
});

router.get('/', async (req, res) => {
  try {
    const serviceCosts = await getAllServiceCosts();
    const serviceCostItems = await getAllServiceCostItems();
    res.status(200).json({ serviceCosts, serviceCostItems });
  } catch (error) {
    console.error('Error fetching service costs:', error);
    res.status(500).json({ error: 'Failed to fetch service costs' });
  }
});

module.exports = router;
