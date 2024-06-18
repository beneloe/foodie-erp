const express = require('express');
const { createProductionOrder, getAllProductionOrders } = require('../models/ProductionOrder');
const { createProductionOrderItem, getAllProductionOrderItems } = require('../models/ProductionOrderItem');
const router = express.Router();

const isValidProductionOrder = (date, productName, quantity, status, items) => {
  const errors = [];

  if (!Date.parse(date)) {
    errors.push('Invalid date format.');
  }

  if (!productName || typeof productName !== 'string' || productName.length > 255) {
    errors.push('Product name must be a non-empty string and less than 255 characters.');
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    errors.push('Quantity must be a positive number.');
  }

  if (!status || typeof status !== 'string' || status.length > 50) {
    errors.push('Status must be a non-empty string and less than 50 characters.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Items must be a non-empty array.');
  } else {
    items.forEach((item, index) => {
      if (typeof item.inventory_item_id !== 'number' || item.inventory_item_id <= 0) {
        errors.push(`Item ${index + 1}: inventory_item_id must be a positive number.`);
      }
      if (typeof item.quantity_used !== 'number' || item.quantity_used <= 0) {
        errors.push(`Item ${index + 1}: quantity_used must be a positive number.`);
      }
      if (!item.unit || typeof item.unit !== 'string' || item.unit.length > 50) {
        errors.push(`Item ${index + 1}: unit must be a non-empty string and less than 50 characters.`);
      }
    });
  }

  return errors;
};

router.post('/add', async (req, res) => {
  const { date, product_name, quantity, status, items } = req.body;
  const validationErrors = isValidProductionOrder(date, product_name, quantity, status, items);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const productionOrder = await createProductionOrder(date, product_name, quantity, status);
    for (const item of items) {
      await createProductionOrderItem(productionOrder.id, item.inventory_item_id, item.quantity_used, item.unit);
    }
    res.status(201).json(productionOrder);
  } catch (error) {
    console.error('Error creating production order:', error);
    res.status(500).json({ error: 'Failed to create production order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const productionOrders = await getAllProductionOrders();
    const productionOrderItems = await getAllProductionOrderItems();
    res.status(200).json({ productionOrders, productionOrderItems });
  } catch (error) {
    console.error('Error fetching production orders:', error);
    res.status(500).json({ error: 'Failed to fetch production orders' });
  }
});

module.exports = router;
