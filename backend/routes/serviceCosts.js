const express = require('express');
const { createServiceCost, getAllServiceCosts } = require('../models/ServiceCost');
const { createServiceCostItem, getAllServiceCostItems } = require('../models/ServiceCostItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, vendor, amount, paid, status, items } = req.body;

  // Input validation
  if (!date || !vendor || amount <= 0 || paid === undefined || !status || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const serviceCost = await createServiceCost(date, vendor, amount, paid, status);
    for (const item of items) {
      if (!item.service_description || item.quantity <= 0 || !item.unit || item.unit_price <= 0 || item.amount <= 0) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
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
