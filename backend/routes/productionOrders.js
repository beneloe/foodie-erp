const express = require('express');
const { createProductionOrder, getAllProductionOrders } = require('../models/ProductionOrder');
const { createProductionOrderItem, getAllProductionOrderItems } = require('../models/ProductionOrderItem');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { date, product_name, quantity, status, items } = req.body;
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
