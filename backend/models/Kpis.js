const db = require('../config/db');

const getRevenue = async () => {
  const result = await db.query(`
    SELECT SUM(amount) AS revenue
    FROM sales_order_items;
  `);
  return result.rows[0].revenue;
};

const getTotalCosts = async () => {
  const result = await db.query(`
    WITH purchase_costs AS (
      SELECT SUM(amount) AS total_purchase_cost
      FROM purchase_order_items
    ),
    production_costs AS (
      SELECT SUM(quantity_used * (SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id)) AS total_production_cost
      FROM production_order_items
    ),
    other_costs AS (
      SELECT SUM(amount) AS total_other_cost
      FROM other_costs
    ),
    staffing_costs AS (
      SELECT SUM(amount) AS total_staffing_cost
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
  return result.rows[0];
};

const getGrossProfit = async () => {
  const result = await db.query(`
    WITH revenue AS (
      SELECT SUM(amount) AS total_revenue
      FROM sales_order_items
    ),
    total_costs AS (
      SELECT 
        (SELECT SUM(amount) FROM purchase_order_items) +
        (SELECT SUM(quantity_used * (SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id)) FROM production_order_items) +
        (SELECT SUM(amount) FROM other_costs) +
        (SELECT SUM(amount) FROM staffing_costs) AS total_cost
    )
    SELECT 
      revenue.total_revenue,
      total_costs.total_cost,
      (revenue.total_revenue - total_costs.total_cost) AS gross_profit
    FROM revenue, total_costs;
  `);
  return result.rows[0];
};

const getProfitMargin = async () => {
  const result = await db.query(`
    WITH revenue AS (
      SELECT SUM(amount) AS total_revenue
      FROM sales_order_items
    ),
    total_costs AS (
      SELECT 
        (SELECT SUM(amount) FROM purchase_order_items) +
        (SELECT SUM(quantity_used * (SELECT price FROM inventory_item WHERE id = production_order_items.inventory_item_id)) FROM production_order_items) +
        (SELECT SUM(amount) FROM other_costs) +
        (SELECT SUM(amount) FROM staffing_costs) AS total_cost
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
        ELSE (gross_profit.gross_profit / revenue.total_revenue) * 100
      END AS profit_margin
    FROM gross_profit, revenue;
  `);
  return result.rows[0].profit_margin;
};

const getBreakEvenPoint = async (itemName) => {
  const result = await db.query(`
    WITH fixed_costs AS (
      SELECT SUM(amount) AS total_fixed_cost
      FROM other_costs
      UNION ALL
      SELECT SUM(amount)
      FROM staffing_costs
    ),
    variable_costs_per_unit AS (
      SELECT 
        SUM(poi.quantity_used * ii.price) / NULLIF(SUM(soi.quantity), 0) AS variable_cost_per_unit
      FROM production_order_items poi
      JOIN production_orders po ON poi.production_order_id = po.id
      JOIN inventory_item ii ON poi.inventory_item_id = ii.id
      LEFT JOIN sales_order_items soi ON soi.inventory_item_id = ii.id
      WHERE po.product_name = $1
    ),
    price_per_unit AS (
      SELECT price
      FROM inventory_item
      WHERE item_name = $1
    )
    SELECT 
      CASE
        WHEN (price_per_unit.price - variable_costs_per_unit.variable_cost_per_unit) = 0 THEN NULL
        ELSE (SUM(fixed_costs.total_fixed_cost) / NULLIF((price_per_unit.price - variable_costs_per_unit.variable_cost_per_unit), 0))
      END AS break_even_point_in_units
    FROM fixed_costs, variable_costs_per_unit, price_per_unit
    GROUP BY price_per_unit.price, variable_costs_per_unit.variable_cost_per_unit;
  `, [itemName]);

  return result.rows[0].break_even_point_in_units;
};

module.exports = {
  getRevenue,
  getTotalCosts,
  getGrossProfit,
  getProfitMargin,
  getBreakEvenPoint,
};
