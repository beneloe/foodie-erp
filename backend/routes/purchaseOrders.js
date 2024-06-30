const express = require('express');
const { body, validationResult } = require('express-validator');
const { createPurchaseOrder, getAllPurchaseOrders } = require('../models/PurchaseOrder');
const { createPurchaseOrderItem, getAllPurchaseOrderItems } = require('../models/PurchaseOrderItem');
const auth = require('../middleware/auth');
const router = express.Router();

// validation middleware
const validatePurchaseOrder = [
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('vendor').isString().withMessage('Vendor must be a string'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('paid').isBoolean().withMessage('Paid must be a boolean value'),
  body('received').isBoolean().withMessage('Received must be a boolean value'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.inventory_item_id').isInt({ gt: 0 }).withMessage('Inventory item ID must be a positive integer'),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Quantity must be a positive number'),
  body('items.*.unit').isString().withMessage('Unit must be a string'),
  body('items.*.unit_price').isFloat({ gt: 0 }).withMessage('Unit price must be a positive number'),
  body('items.*.amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.post('/add', auth, validatePurchaseOrder, async (req, res) => {
  const { date, vendor, amount, paid, received, items } = req.body;
  try {
    const purchaseOrder = await createPurchaseOrder(req.user.id, date, vendor, amount, paid, received);
    for (const item of items) {
      await createPurchaseOrderItem(purchaseOrder.id, item.inventory_item_id, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const purchaseOrders = await getAllPurchaseOrders(req.user.id);
    const purchaseOrderItems = await getAllPurchaseOrderItems(req.user.id);
    res.status(200).json({ purchaseOrders, purchaseOrderItems });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

module.exports = router;
