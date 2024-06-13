const express = require('express');
const router = express.Router();
const kpis = require('../models/KPIs');

router.get('/revenue', async (req, res) => {
  try {
    const revenue = await kpis.getRevenue();
    res.json({ revenue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

router.get('/total-costs', async (req, res) => {
  try {
    const totalCosts = await kpis.getTotalCosts();
    res.json(totalCosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total costs' });
  }
});

router.get('/gross-profit', async (req, res) => {
  try {
    const grossProfit = await kpis.getGrossProfit();
    res.json(grossProfit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gross profit' });
  }
});

router.get('/profit-margin', async (req, res) => {
  try {
    const profitMargin = await kpis.getProfitMargin();
    res.json({ profitMargin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profit margin' });
  }
});

router.get('/break-even-point', async (req, res) => {
  try {
    const breakEvenPoint = await kpis.getBreakEvenPoint();
    res.json({ breakEvenPoint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch break-even point' });
  }
});

module.exports = router;
