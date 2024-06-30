const pool = require('../config/db');

const createOtherCostItem = async (otherCostId, lineItem, quantity, unit, unitPrice, amount) => {
  const query = `
    INSERT INTO other_cost_items (other_cost_id, line_item, quantity, unit, unit_price, amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [otherCostId, lineItem, quantity, unit, unitPrice, amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllOtherCostItems = async (userId) => {
  const query = `
    SELECT oci.*
    FROM other_cost_items oci
    JOIN other_costs oc ON oci.other_cost_id = oc.id
    WHERE oc.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createOtherCostItem, getAllOtherCostItems };
