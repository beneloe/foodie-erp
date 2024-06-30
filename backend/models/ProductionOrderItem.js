const pool = require('../config/db');

const createProductionOrderItem = async (productionOrderId, inventoryItemId, quantityUsed, unit) => {
  const query = `
    INSERT INTO production_order_items (production_order_id, inventory_item_id, quantity_used, unit)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [productionOrderId, inventoryItemId, quantityUsed, unit];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllProductionOrderItems = async (userId) => {
  const query = `
    SELECT poi.*
    FROM production_order_items poi
    JOIN production_orders po ON poi.production_order_id = po.id
    WHERE po.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createProductionOrderItem, getAllProductionOrderItems };
