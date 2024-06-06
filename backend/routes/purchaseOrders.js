const express = require('express');
const { createPurchaseOrder, getAllPurchaseOrders } = require('../models/PurchaseOrder');
const { createPurchaseOrderItem, getAllPurchaseOrderItems } = require('../models/PurchaseOrderItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, vendor, amount, paid, received, items } = req.body;
  try {
    const purchaseOrder = await createPurchaseOrder(date, vendor, amount, paid, received);
    for (const item of items) {
      await createPurchaseOrderItem(purchaseOrder.id, item.inventory_item_id, item.quantity, item.unit, item.unit_price, item.amount);
    }
    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const purchaseOrders = await getAllPurchaseOrders();
    const purchaseOrderItems = await getAllPurchaseOrderItems();
    res.status(200).json({ purchaseOrders, purchaseOrderItems });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

module.exports = router;
