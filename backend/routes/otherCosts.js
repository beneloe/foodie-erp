const express = require('express');
const { createOtherCost, getAllOtherCosts } = require('../models/OtherCost');
const { createOtherCostItem, getAllOtherCostItems } = require('../models/OtherCostItem');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, [
  body('date').isISO8601().withMessage('Date is required and must be a valid date.'),
  body('vendor').notEmpty().withMessage('Vendor is required.'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('paid').isBoolean().withMessage('Paid status must be a boolean.'),
  body('status').notEmpty().withMessage('Status is required.'),
  body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item.'),
  body('items.*.line_item').notEmpty().withMessage('Line item is required.'),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Quantity must be a positive number.'),
  body('items.*.unit').notEmpty().withMessage('Unit is required.'),
  body('items.*.unit_price').isFloat({ gt: 0 }).withMessage('Unit price must be a positive number.'),
  body('items.*.amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, vendor, amount, paid, status, items } = req.body;
  try {
    const otherCost = await createOtherCost(req.user.id, date, vendor, amount, paid, status);
    for (const item of items) {
      await createOtherCostItem(otherCost.id, item.line_item, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(otherCost);
  } catch (error) {
    console.error('Error creating other cost:', error);
    res.status(500).json({ error: 'Failed to create other cost' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const otherCosts = await getAllOtherCosts(req.user.id);
    const otherCostItems = await getAllOtherCostItems(req.user.id);
    res.status(200).json({ otherCosts, otherCostItems });
  } catch (error) {
    console.error('Error fetching other costs:', error);
    res.status(500).json({ error: 'Failed to fetch other costs' });
  }
});

module.exports = router;
