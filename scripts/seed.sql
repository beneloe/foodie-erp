-- Clear all tables
DELETE FROM service_cost_items;
DELETE FROM service_costs;
DELETE FROM salaries;
DELETE FROM other_cost_items;
DELETE FROM other_costs;
DELETE FROM sales_order_items;
DELETE FROM sales_orders;
DELETE FROM production_order_items;
DELETE FROM production_orders;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM inventory_item;
DELETE FROM users;

-- Populate database with sample data
INSERT INTO users (username, password, email) VALUES ('admin', 'password', 'admin@admin.com');

INSERT INTO inventory_item (item_name, stock, unit, price, starting_quantity, picture)
VALUES 
('Bread', 30000, 'grams', 0.00, 20000, 'picture.jpeg'),
('Lettuce', 750, 'grams', 0.05, 500, 'picture.jpeg'),
('Tomato', 450, 'grams', 0.10, 300, 'picture.jpeg'),
('Cheese', 3000, 'grams', 0.03, 2000, 'picture.jpeg'),
('Ham', 4500, 'grams', 0.05, 3000, 'picture.jpeg'),
('Mayonnaise', 1500, 'grams', 0.01, 1000, 'picture.jpeg'),
('Sandwich', 0, 'pieces', 5.00, 500, 'picture.jpeg');

DO $$ DECLARE purchase_order_id INTEGER;
BEGIN
  INSERT INTO purchase_orders (date, vendor, amount, paid, received)
  VALUES ('2024-01-01', 'Metro', 500.00, TRUE, TRUE) RETURNING id INTO purchase_order_id;

  INSERT INTO purchase_order_items (purchase_order_id, inventory_item_id, quantity, unit, unit_price, amount)
  VALUES 
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Bread'), 20000, 'grams', 0.00, 40.00),
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Lettuce'), 500, 'grams', 0.05, 25.00),
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Tomato'), 300, 'grams', 0.10, 30.00),
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Cheese'), 2000, 'grams', 0.03, 60.00),
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Ham'), 3000, 'grams', 0.05, 150.00),
  (purchase_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Mayonnaise'), 1000, 'grams', 0.01, 10.00);
END $$;

DO $$ DECLARE production_order_id INTEGER;
BEGIN
  INSERT INTO production_orders (date, product_name, quantity, status)
  VALUES ('2024-01-02', 'Sandwich', 500, 'done') RETURNING id INTO production_order_id;

  INSERT INTO production_order_items (production_order_id, inventory_item_id, quantity_used, unit, in_inventory, in_build)
  VALUES 
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Bread'), 10000, 'grams', 20000, 10000),
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Lettuce'), 250, 'grams', 500, 250),
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Tomato'), 150, 'grams', 300, 150),
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Cheese'), 1000, 'grams', 2000, 1000),
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Ham'), 1500, 'grams', 3000, 1500),
  (production_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Mayonnaise'), 500, 'grams', 1000, 500);
END $$;

DO $$ DECLARE sales_order_id INTEGER;
BEGIN
  INSERT INTO sales_orders (date, customer, amount, paid, delivered)
  VALUES ('2024-01-03', 'Edeka', 2500.00, TRUE, TRUE) RETURNING id INTO sales_order_id;

  INSERT INTO sales_order_items (sales_order_id, inventory_item_id, quantity, unit, unit_price, amount)
  VALUES 
  (sales_order_id, (SELECT id FROM inventory_item WHERE item_name = 'Sandwich'), 500, 'pieces', 5.00, 2500.00);
END $$;

DO $$ DECLARE other_cost_id INTEGER;
BEGIN
  INSERT INTO other_costs (date, vendor, amount, paid, status)
  VALUES ('2024-01-31', 'Transporter', 300.00, FALSE, 'done') RETURNING id INTO other_cost_id;

  INSERT INTO other_cost_items (other_cost_id, line_item, quantity, unit, unit_price, amount)
  VALUES (other_cost_id, 'Transportation', 1, 'service', 300.00, 300.00);
END $$;

INSERT INTO salaries (date, period, employee, amount, paid, hours_worked, unit, hourly_rate)
VALUES ('2024-01-31', '2024-05-01 - 2024-05-31', 'Employee 1', 2000.00, TRUE, 160, 'hours', 12.50);

DO $$ DECLARE service_cost_id INTEGER;
BEGIN
  INSERT INTO service_costs (date, vendor, amount, paid, status)
  VALUES ('2024-01-31', 'Consultant', 500.00, FALSE, 'done') RETURNING id INTO service_cost_id;

  INSERT INTO service_cost_items (service_cost_id, service_description, quantity, unit, unit_price, amount)
  VALUES (service_cost_id, 'Consulting', 10, 'hours', 20.00, 200.00);
END $$;

-- Display all entries in the database
SELECT * FROM users;
SELECT * FROM inventory_item;
SELECT * FROM purchase_orders;
SELECT * FROM purchase_order_items;
SELECT * FROM production_orders;
SELECT * FROM production_order_items;
SELECT * FROM sales_orders;
SELECT * FROM sales_order_items;
SELECT * FROM other_costs;
SELECT * FROM other_cost_items;
SELECT * FROM salaries;
SELECT * FROM service_costs;
SELECT * FROM service_cost_items;
