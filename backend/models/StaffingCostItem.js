const pool = require('../config/db');

const createStaffingCostItem = async (staffingCostId, line_item, quantity, unit, unit_price, amount) => {
  const query = `
    INSERT INTO staffing_cost_items (staffing_cost_id, line_item, quantity, unit, unit_price, amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [staffingCostId, line_item, quantity, unit, unit_price, amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllStaffingCostItems = async (userId) => {
  const query = `
    SELECT sci.*
    FROM staffing_cost_items sci
    JOIN staffing_costs sc ON sci.staffing_cost_id = sc.id
    WHERE sc.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createStaffingCostItem, getAllStaffingCostItems };
