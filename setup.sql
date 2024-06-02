CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE inventory_item (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  stock NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2),
  starting_quantity NUMERIC(10, 2),
  picture VARCHAR(255)
);

CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN NOT NULL,
  received BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE purchase_order_items (
  id SERIAL PRIMARY KEY,
  purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE production_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE production_order_items (
  id SERIAL PRIMARY KEY,
  production_order_id INTEGER NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity_used NUMERIC(10, 2) NOT NULL
);

CREATE TABLE sales_orders (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  customer VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN NOT NULL,
  delivered BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE sales_order_items (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_item(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE other_costs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  period VARCHAR(50) NOT NULL,
  employee VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE service_costs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN NOT NULL,
  status VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE service_cost_items (
  id SERIAL PRIMARY KEY,
  service_cost_id INTEGER NOT NULL REFERENCES service_costs(id) ON DELETE CASCADE,
  service_description VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);
