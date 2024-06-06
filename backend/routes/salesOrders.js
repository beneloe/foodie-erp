const express = require('express');
const { createSalesOrder, getAllSalesOrders } = require('../models/SalesOrder');
const { createSalesOrderItem, getAllSalesOrderItems } = require('../models/SalesOrderItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, customer, amount, paid, delivered, items } = req.body;
  try {
    const salesOrder = await createSalesOrder(date, customer, amount, paid, delivered);
    for (const item of items) {
      await createSalesOrderItem(salesOrder.id, item.inventory_item_id, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(salesOrder);
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ error: 'Failed to create sales order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const salesOrders = await getAllSalesOrders();
    const salesOrderItems = await getAllSalesOrderItems();
    res.status(200).json({ salesOrders, salesOrderItems });
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
});

module.exports = router;
