const express = require('express');
const { check, validationResult } = require('express-validator');
const { createStaffingCost, getAllStaffingCosts } = require('../models/StaffingCost');
const { createStaffingCostItem, getAllStaffingCostItems } = require('../models/StaffingCostItem');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/add',
  auth,
  [
    check('date').isISO8601().withMessage('Date must be a valid date'),
    check('period').not().isEmpty().withMessage('Period is required'),
    check('employee').not().isEmpty().withMessage('Employee is required'),
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    check('paid').isBoolean().withMessage('Paid must be a boolean'),
    check('items').isArray().withMessage('Items must be an array'),
    check('items.*.line_item').not().isEmpty().withMessage('Line item is required'),
    check('items.*.quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than zero'),
    check('items.*.unit').not().isEmpty().withMessage('Unit is required'),
    check('items.*.unit_price').isFloat({ gt: 0 }).withMessage('Unit price must be greater than zero'),
    check('items.*.amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, period, employee, amount, paid, items } = req.body;
    try {
      const staffingCost = await createStaffingCost(req.user.id, date, period, employee, amount, paid);
      for (const item of items) {
        await createStaffingCostItem(staffingCost.id, item.line_item, item.quantity, item.unit, item.unit_price, item.amount);
      }
      res.status(201).json(staffingCost);
    } catch (error) {
      console.error('Error creating staffing cost:', error);
      res.status(500).json({ error: 'Failed to create staffing cost' });
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const staffingCosts = await getAllStaffingCosts(req.user.id);
    const staffingCostItems = await getAllStaffingCostItems(req.user.id);
    res.status(200).json({ staffingCosts, staffingCostItems });
  } catch (error) {
    console.error('Error fetching staffing costs:', error);
    res.status(500).json({ error: 'Failed to fetch staffing costs' });
  }
});

module.exports = router;
