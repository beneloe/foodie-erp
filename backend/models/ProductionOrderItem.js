const pool = require('../config/db');

const createProductionOrderItem = async (productionOrderId, inventoryItemId, quantityUsed, unit, inInventory, inBuild) => {
  const query = `
    INSERT INTO production_order_items (production_order_id, inventory_item_id, quantity_used, unit, in_inventory, in_build)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [productionOrderId, inventoryItemId, quantityUsed, unit, inInventory, inBuild];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllProductionOrderItems = async () => {
  const query = 'SELECT * FROM production_order_items;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createProductionOrderItem, getAllProductionOrderItems };
