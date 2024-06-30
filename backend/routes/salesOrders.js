const express = require('express');
const { createSalesOrder, getAllSalesOrders } = require('../models/SalesOrder');
const { createSalesOrderItem, getAllSalesOrderItems } = require('../models/SalesOrderItem');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, async (req, res) => {
  const { date, customer, amount, paid, delivered, items } = req.body;
  if (!date || !customer || amount <= 0 || typeof paid !== 'boolean' || typeof delivered !== 'boolean' || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const salesOrder = await createSalesOrder(req.user.id, date, customer, amount, paid, delivered);
    for (const item of items) {
      if (!item.inventory_item_id || item.quantity <= 0 || item.unit_price <= 0 || item.amount <= 0) {
        return res.status(400).json({ error: 'Invalid input data for sales order item' });
      }
      await createSalesOrderItem(salesOrder.id, item.inventory_item_id, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(salesOrder);
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ error: 'Failed to create sales order' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const salesOrders = await getAllSalesOrders(req.user.id);
    const salesOrderItems = await getAllSalesOrderItems(req.user.id);
    res.status(200).json({ salesOrders, salesOrderItems });
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
});

module.exports = router;
