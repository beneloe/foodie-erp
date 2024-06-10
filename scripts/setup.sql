-- Drop all existing tables
DROP TABLE IF EXISTS service_cost_items, service_costs, staffing_costs, staffing_cost_items, other_cost_items, other_costs, sales_order_items, sales_orders, production_order_items, production_orders, purchase_order_items, purchase_orders, inventory_item, users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Create inventory_item table
CREATE TABLE inventory_item (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL UNIQUE,
  stock NUMERIC(10, 2) NOT NULL CHECK (stock >= 0),
  unit VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) CHECK (price >= 0)
);

-- Create purchase_orders table
CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid BOOLEAN NOT NULL,
  received BOOLEAN NOT NULL,
  UNIQUE(date, vendor)
);

-- Create purchase_order_items table
CREATE TABLE purchase_order_items (
  id SERIAL PRIMARY KEY,
  purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  UNIQUE(purchase_order_id, inventory_item_id)
);

-- Create production_orders table
CREATE TABLE production_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  status VARCHAR(50) NOT NULL
);

-- Create production_order_items table
CREATE TABLE production_order_items (
  id SERIAL PRIMARY KEY,
  production_order_id INTEGER REFERENCES production_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity_used NUMERIC(10, 2) NOT NULL CHECK (quantity_used > 0),
  unit VARCHAR(50) NOT NULL,
  UNIQUE(production_order_id, inventory_item_id)
);

-- Create sales_orders table
CREATE TABLE sales_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  customer VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid BOOLEAN NOT NULL,
  delivered BOOLEAN NOT NULL,
  UNIQUE(date, customer)
);

-- Create sales_order_items table
CREATE TABLE sales_order_items (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER REFERENCES sales_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  UNIQUE(sales_order_id, inventory_item_id)
);

-- Create other_costs table
CREATE TABLE other_costs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid BOOLEAN NOT NULL,
  status VARCHAR(50) NOT NULL,
  UNIQUE(date, vendor)
);

-- Create other_cost_items table
CREATE TABLE other_cost_items (
  id SERIAL PRIMARY KEY,
  other_cost_id INTEGER REFERENCES other_costs(id) ON DELETE CASCADE,
  line_item VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  UNIQUE(other_cost_id, line_item)
);

-- Create staffing costs table
CREATE TABLE staffing_costs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  period VARCHAR(50) NOT NULL,
  employee VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid BOOLEAN NOT NULL,
  UNIQUE(date, period, employee)
);

-- Create staffing cost items table
CREATE TABLE staffing_cost_items (
  id SERIAL PRIMARY KEY,
  staffing_cost_id INTEGER REFERENCES staffing_costs(id) ON DELETE CASCADE,
  line_item VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  UNIQUE(staffing_cost_id, line_item)
);

-- Create service_costs table
CREATE TABLE service_costs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid BOOLEAN NOT NULL,
  status VARCHAR(50) NOT NULL,
  UNIQUE(date, vendor)
);

-- Create service_cost_items table
CREATE TABLE service_cost_items (
  id SERIAL PRIMARY KEY,
  service_cost_id INTEGER REFERENCES service_costs(id) ON DELETE CASCADE,
  service_description VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  UNIQUE(service_cost_id, service_description)
);

-- This function updates inventory stock with purchase orders, production orders, and sales orders.
CREATE OR REPLACE FUNCTION update_inventory_stock() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'purchase_order_items' THEN
      UPDATE inventory_item
      SET stock = stock + NEW.quantity
      WHERE id = NEW.inventory_item_id;
    ELSIF TG_TABLE_NAME = 'production_order_items' THEN
      UPDATE inventory_item
      SET stock = stock - NEW.quantity_used
      WHERE id = NEW.inventory_item_id;
    ELSIF TG_TABLE_NAME = 'production_orders' THEN
      UPDATE inventory_item
      SET stock = stock + NEW.quantity
      WHERE item_name = NEW.product_name;
    ELSIF TG_TABLE_NAME = 'sales_order_items' THEN
      IF (SELECT stock FROM inventory_item WHERE id = NEW.inventory_item_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Not enough stock for item %', NEW.inventory_item_id;
      ELSE
        UPDATE inventory_item
        SET stock = stock - NEW.quantity
        WHERE id = NEW.inventory_item_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'purchase_order_items' THEN
      UPDATE inventory_item
      SET stock = stock - OLD.quantity
      WHERE id = OLD.inventory_item_id;
    ELSIF TG_TABLE_NAME = 'production_order_items' THEN
      UPDATE inventory_item
      SET stock = stock + OLD.quantity_used
      WHERE id = OLD.inventory_item_id;
    ELSIF TG_TABLE_NAME = 'production_orders' THEN
      UPDATE inventory_item
      SET stock = stock - OLD.quantity
      WHERE item_name = OLD.product_name;
    ELSIF TG_TABLE_NAME = 'sales_order_items' THEN
      UPDATE inventory_item
      SET stock = stock + OLD.quantity
      WHERE id = OLD.inventory_item_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_inventory_stock with a purchase
CREATE TRIGGER trg_update_inventory_purchase
AFTER INSERT OR DELETE ON purchase_order_items
FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

-- Trigger to call update_inventory_stock with a production
CREATE TRIGGER trg_update_inventory_production
AFTER INSERT OR DELETE ON production_orders
FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

DROP TRIGGER IF EXISTS trg_update_inventory_production_items ON production_order_items;

CREATE TRIGGER trg_update_inventory_production_items
AFTER INSERT OR DELETE ON production_order_items
FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

-- Trigger to call update_inventory_stock with a sale
CREATE TRIGGER trg_update_inventory_sales
AFTER INSERT OR DELETE ON sales_order_items
FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();
