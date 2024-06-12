const pool = require('../config/db');

const createServiceCostItem = async (serviceCostId, serviceDescription, quantity, unit, unitPrice, amount) => {
  const query = `
    INSERT INTO service_cost_items (service_cost_id, service_description, quantity, unit, unit_price, amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [serviceCostId, serviceDescription, quantity, unit, unitPrice, amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllServiceCostItems = async () => {
  const query = 'SELECT * FROM service_cost_items;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createServiceCostItem, getAllServiceCostItems };
