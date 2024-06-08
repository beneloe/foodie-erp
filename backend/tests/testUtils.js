const pool = require('../config/db');

const setupDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_item (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(255) NOT NULL UNIQUE,
      stock NUMERIC(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      price NUMERIC(10, 2)
    );
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      vendor VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      paid BOOLEAN NOT NULL,
      received BOOLEAN NOT NULL,
      UNIQUE(date, vendor)
    );
    CREATE TABLE IF NOT EXISTS purchase_order_items (
      id SERIAL PRIMARY KEY,
      purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity NUMERIC(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      UNIQUE(purchase_order_id, inventory_item_id)
    );
    CREATE TABLE IF NOT EXISTS production_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      product_name VARCHAR(255) NOT NULL UNIQUE,
      quantity NUMERIC(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS production_order_items (
      id SERIAL PRIMARY KEY,
      production_order_id INTEGER REFERENCES production_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity_used NUMERIC(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      UNIQUE(production_order_id, inventory_item_id)
    );
    CREATE TABLE IF NOT EXISTS sales_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      customer VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      paid BOOLEAN NOT NULL,
      delivered BOOLEAN NOT NULL,
      UNIQUE(date, customer)
    );
    CREATE TABLE IF NOT EXISTS sales_order_items (
      id SERIAL PRIMARY KEY,
      sales_order_id INTEGER REFERENCES sales_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity NUMERIC(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      UNIQUE(sales_order_id, inventory_item_id)
    );
  `);

  await pool.query(`
    INSERT INTO inventory_item (id, item_name, stock, unit, price)
    VALUES (1, 'Test Item', 100, 'pcs', 10)
    ON CONFLICT (id) DO NOTHING;
  `);
};

const teardownDatabase = async () => {
  await pool.query('DELETE FROM sales_order_items');
  await pool.query('DELETE FROM sales_orders');
  await pool.query('DELETE FROM production_order_items');
  await pool.query('DELETE FROM production_orders');
  await pool.query('DELETE FROM purchase_order_items');
  await pool.query('DELETE FROM purchase_orders');
  await pool.query('DELETE FROM inventory_item');
};

module.exports = { setupDatabase, teardownDatabase };
