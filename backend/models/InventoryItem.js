const { pool } = require('../config/db');
	
const createItem = async (item_name, stock, unit, price, starting_quantity, picture) => {
const res = await pool.query(
    'INSERT INTO inventory (item_name, stock, unit, price, starting_quantity, picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [item_name, stock, unit, price, starting_quantity, picture]
    );
    return res.rows[0];
};
	
module.exports = { createItem };
