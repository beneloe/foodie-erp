const pool = require('../config/db');

const createPurchaseOrderItem = async (purchaseOrderId, inventoryItemId, quantity, unit, unitPrice, amount) => {
  const query = `
    INSERT INTO purchase_order_items (purchase_order_id, inventory_item_id, quantity, unit, unit_price, amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [purchaseOrderId, inventoryItemId, quantity, unit, unitPrice, amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllPurchaseOrderItems = async (userId) => {
  const query = `
    SELECT poi.*, ii.item_name
    FROM purchase_order_items poi
    JOIN inventory_item ii ON poi.inventory_item_id = ii.id
    JOIN purchase_orders po ON poi.purchase_order_id = po.id
    WHERE po.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createPurchaseOrderItem, getAllPurchaseOrderItems };
