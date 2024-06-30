const pool = require('../config/db');

const createSalesOrderItem = async (salesOrderId, inventoryItemId, quantity, unit, unitPrice, amount) => {
  const query = `
    INSERT INTO sales_order_items (sales_order_id, inventory_item_id, quantity, unit, unit_price, amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [salesOrderId, inventoryItemId, quantity, unit, unitPrice, amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllSalesOrderItems = async (userId) => {
  const query = `
    SELECT soi.*, ii.item_name 
    FROM sales_order_items soi
    JOIN inventory_item ii ON soi.inventory_item_id = ii.id
    JOIN sales_orders so ON soi.sales_order_id = so.id
    WHERE so.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createSalesOrderItem, getAllSalesOrderItems };
