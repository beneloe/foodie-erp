const db = require('../config/db');

const getRevenue = async () => {
  const result = await db.query(`
    SELECT COALESCE(SUM(amount), 0) AS revenue
    FROM sales_order_items;
  `);
  return result.rows[0].revenue || 0;
};

const getTotalCosts = async () => {
  const result = await db.query(`
    WITH purchase_costs AS (
      SELECT COALESCE(SUM(amount), 0) AS total_purchase_cost
      FROM purchase_order_items
    ),
    production_costs AS (
      SELECT COALESCE(SUM(quantity_used * COALESCE((SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id), 0)), 0) AS total_production_cost
      FROM production_order_items
    ),
    other_costs AS (
      SELECT COALESCE(SUM(amount), 0) AS total_other_cost
      FROM other_costs
    ),
    staffing_costs AS (
      SELECT COALESCE(SUM(amount), 0) AS total_staffing_cost
      FROM staffing_costs
    )
    SELECT 
      purchase_costs.total_purchase_cost,
      production_costs.total_production_cost,
      other_costs.total_other_cost,
      staffing_costs.total_staffing_cost,
      (purchase_costs.total_purchase_cost + production_costs.total_production_cost + other_costs.total_other_cost + staffing_costs.total_staffing_cost) AS total_cost
    FROM purchase_costs, production_costs, other_costs, staffing_costs;
  `);
  return {
    total_purchase_cost: result.rows[0].total_purchase_cost || 0,
    total_production_cost: result.rows[0].total_production_cost || 0,
    total_other_cost: result.rows[0].total_other_cost || 0,
    total_staffing_cost: result.rows[0].total_staffing_cost || 0,
    total_cost: result.rows[0].total_cost || 0
  };
};

const getGrossProfit = async () => {
  const result = await db.query(`
    WITH revenue AS (
      SELECT COALESCE(SUM(amount), 0) AS total_revenue
      FROM sales_order_items
    ),
    total_costs AS (
      SELECT 
        COALESCE((SELECT SUM(amount) FROM purchase_order_items), 0) +
        COALESCE((SELECT SUM(quantity_used * COALESCE((SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id), 0)) FROM production_order_items), 0) +
        COALESCE((SELECT SUM(amount) FROM other_costs), 0) +
        COALESCE((SELECT SUM(amount) FROM staffing_costs), 0) AS total_cost
    )
    SELECT 
      revenue.total_revenue,
      total_costs.total_cost,
      (revenue.total_revenue - total_costs.total_cost) AS gross_profit
    FROM revenue, total_costs;
  `);
  return {
    total_revenue: result.rows[0].total_revenue || 0,
    total_cost: result.rows[0].total_cost || 0,
    gross_profit: result.rows[0].gross_profit || 0
  };
};

const getProfitMargin = async () => {
  const result = await db.query(`
    WITH revenue AS (
      SELECT COALESCE(SUM(amount), 0) AS total_revenue
      FROM sales_order_items
    ),
    total_costs AS (
      SELECT 
        COALESCE((SELECT SUM(amount) FROM purchase_order_items), 0) +
        COALESCE((SELECT SUM(quantity_used * COALESCE((SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id), 0)) FROM production_order_items), 0) +
        COALESCE((SELECT SUM(amount) FROM other_costs), 0) +
        COALESCE((SELECT SUM(amount) FROM staffing_costs), 0) AS total_cost
    ),
    gross_profit AS (
      SELECT 
        revenue.total_revenue,
        total_costs.total_cost,
        (revenue.total_revenue - total_costs.total_cost) AS gross_profit
      FROM revenue, total_costs
    )
    SELECT 
      CASE 
        WHEN revenue.total_revenue = 0 THEN 0
        ELSE (gross_profit.gross_profit / NULLIF(revenue.total_revenue, 0)) * 100
      END AS profit_margin
    FROM gross_profit, revenue;
  `);
  return result.rows[0].profit_margin || 0;
};

const getBreakEvenPoint = async (itemName) => {
  try {
    const result = await db.query(`
      WITH fixed_costs AS (
        SELECT COALESCE(SUM(amount), 0) AS total_fixed_cost
        FROM (
          SELECT amount FROM other_costs
          UNION ALL
          SELECT amount FROM staffing_costs
        ) AS all_fixed_costs
      ),
      variable_costs_per_unit AS (
        SELECT 
          COALESCE(SUM(poi.quantity_used * COALESCE(ii.price, 0)) / NULLIF(SUM(soi.quantity), 0), 0) AS variable_cost_per_unit
        FROM production_order_items poi
        JOIN production_orders po ON poi.production_order_id = po.id
        LEFT JOIN inventory_item ii ON poi.inventory_item_id = ii.id
        LEFT JOIN sales_order_items soi ON soi.inventory_item_id = ii.id
        WHERE po.product_name = $1
      ),
      price_per_unit AS (
        SELECT COALESCE(price, 0) AS price
        FROM inventory_item
        WHERE item_name = $1
      )
      SELECT 
        CASE
          WHEN (price_per_unit.price - variable_costs_per_unit.variable_cost_per_unit) = 0 THEN NULL
          ELSE (fixed_costs.total_fixed_cost / NULLIF((price_per_unit.price - variable_costs_per_unit.variable_cost_per_unit), 0))
        END AS break_even_point_in_units
      FROM fixed_costs, variable_costs_per_unit, price_per_unit;
    `, [itemName]);

    console.log('Break-even point calculation result:', result.rows[0]);

    return result.rows[0].break_even_point_in_units;
  } catch (error) {
    console.error('Error in getBreakEvenPoint:', error);
    throw error;
  }
};

module.exports = {
  getRevenue,
  getTotalCosts,
  getGrossProfit,
  getProfitMargin,
  getBreakEvenPoint,
};
