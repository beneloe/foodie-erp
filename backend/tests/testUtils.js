const pool = require('../config/db');

const setupDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory_item (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(255) NOT NULL UNIQUE,
      stock NUMERIC(10, 2) NOT NULL CHECK (stock >= 0),
      unit VARCHAR(50) NOT NULL,
      price NUMERIC(10, 2) CHECK (price >= 0)
    );
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      vendor VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      paid BOOLEAN NOT NULL,
      received BOOLEAN NOT NULL,
      UNIQUE(date, vendor)
    );
    CREATE TABLE IF NOT EXISTS purchase_order_items (
      id SERIAL PRIMARY KEY,
      purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      UNIQUE(purchase_order_id, inventory_item_id)
    );
    CREATE TABLE IF NOT EXISTS production_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      status VARCHAR(50) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS production_order_items (
      id SERIAL PRIMARY KEY,
      production_order_id INTEGER REFERENCES production_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity_used NUMERIC(10, 2) NOT NULL CHECK (quantity_used > 0),
      unit VARCHAR(50) NOT NULL,
      UNIQUE(production_order_id, inventory_item_id)
    );
    CREATE TABLE IF NOT EXISTS sales_orders (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      customer VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      paid BOOLEAN NOT NULL,
      delivered BOOLEAN NOT NULL,
      UNIQUE(date, customer)
    );
    CREATE TABLE IF NOT EXISTS sales_order_items (
      id SERIAL PRIMARY KEY,
      sales_order_id INTEGER REFERENCES sales_orders(id) ON DELETE CASCADE,
      inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      UNIQUE(sales_order_id, inventory_item_id)
    );
    CREATE TABLE IF NOT EXISTS other_costs (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      vendor VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      paid BOOLEAN NOT NULL,
      status VARCHAR(50) NOT NULL,
      UNIQUE(date, vendor)
    );
    CREATE TABLE IF NOT EXISTS other_cost_items (
      id SERIAL PRIMARY KEY,
      other_cost_id INTEGER REFERENCES other_costs(id) ON DELETE CASCADE,
      line_item VARCHAR(255) NOT NULL,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      UNIQUE(other_cost_id, line_item)
    );
    CREATE TABLE IF NOT EXISTS staffing_costs (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      period VARCHAR(50) NOT NULL,
      employee VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      paid BOOLEAN NOT NULL,
      UNIQUE(date, period, employee)
    );
    CREATE TABLE IF NOT EXISTS staffing_cost_items (
      id SERIAL PRIMARY KEY,
      staffing_cost_id INTEGER REFERENCES staffing_costs(id) ON DELETE CASCADE,
      line_item VARCHAR(255) NOT NULL,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      UNIQUE(staffing_cost_id, line_item)
    );
    CREATE TABLE IF NOT EXISTS service_costs (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      vendor VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      paid BOOLEAN NOT NULL,
      status VARCHAR(50) NOT NULL,
      UNIQUE(date, vendor)
    );
    CREATE TABLE IF NOT EXISTS service_cost_items (
      id SERIAL PRIMARY KEY,
      service_cost_id INTEGER REFERENCES service_costs(id) ON DELETE CASCADE,
      service_description VARCHAR(255) NOT NULL,
      quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50) NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      UNIQUE(service_cost_id, service_description)
    );
    CREATE TABLE IF NOT EXISTS kpis (
      id SERIAL PRIMARY KEY,
      revenue NUMERIC(10, 2) NOT NULL CHECK (revenue >= 0),
      total_purchase_cost NUMERIC(10, 2) NOT NULL CHECK (total_purchase_cost >= 0),
      total_production_cost NUMERIC(10, 2) NOT NULL CHECK (total_production_cost >= 0),
      total_other_cost NUMERIC(10, 2) NOT NULL CHECK (total_other_cost >= 0),
      total_staffing_cost NUMERIC(10, 2) NOT NULL CHECK (total_staffing_cost >= 0),
      total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost >= 0),
      gross_profit NUMERIC(10, 2) NOT NULL CHECK (gross_profit >= 0),
      profit_margin NUMERIC(5, 2) NOT NULL CHECK (profit_margin >= 0),
      break_even_point NUMERIC(10, 2) NOT NULL CHECK (break_even_point >= 0),
      date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `);

  await pool.query(`
    INSERT INTO inventory_item (id, item_name, stock, unit, price)
    VALUES (1, 'Bread', 40000, 'grams', 0.01),
           (2, 'Lettuce', 1000, 'grams', 0.05),
           (3, 'Tomato', 600, 'grams', 0.10),
           (4, 'Cheese', 4000, 'grams', 0.03),
           (5, 'Ham', 6000, 'grams', 0.05),
           (6, 'Mayonnaise', 2000, 'grams', 0.01),
           (7, 'Sandwich', 0, 'pieces', 5.00)
    ON CONFLICT (id) DO NOTHING;
  `);
};

const teardownDatabase = async () => {
  await pool.query('DELETE FROM staffing_cost_items');
  await pool.query('DELETE FROM staffing_costs');
  await pool.query('DELETE FROM service_cost_items');
  await pool.query('DELETE FROM service_costs');
  await pool.query('DELETE FROM sales_order_items');
  await pool.query('DELETE FROM sales_orders');
  await pool.query('DELETE FROM production_order_items');
  await pool.query('DELETE FROM production_orders');
  await pool.query('DELETE FROM purchase_order_items');
  await pool.query('DELETE FROM purchase_orders');
  await pool.query('DELETE FROM inventory_item');
  await pool.query('DELETE FROM other_cost_items');
  await pool.query('DELETE FROM other_costs');
  await pool.query('DELETE FROM kpis');
  await pool.query('DELETE FROM users');
};

module.exports = { setupDatabase, teardownDatabase };
