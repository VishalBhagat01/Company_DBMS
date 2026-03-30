-- Sample Seed Data for Company Management System

-- 1. Departments
INSERT INTO departments (name, contact, head_of_dept) VALUES
('Human Resources', '555-0101', 'John Doe'),
('Engineering', '555-0102', 'Jane Smith'),
('Marketing', '555-0103', 'Alice Brown'),
('Sales', '555-0104', 'Robert Johnson'),
('Quality Assurance', '555-0105', 'Charlie Davis');

-- 2. Employees
INSERT INTO employees (name, address, designation, contact, department_id, salary) VALUES
('Alice Miller', '123 Main St, New York, NY', 'HR Manager', '555-1001', 1, 85000.00),
('Bob Wilson', '456 Oak Ave, Los Angeles, CA', 'Senior Engineer', '555-1002', 2, 120000.00),
('Carol White', '789 Pine Rd, Chicago, IL', 'Marketing Specialist', '555-1003', 3, 75000.00),
('David Black', '101 Maple Ln, Houston, TX', 'Sales Executive', '555-1004', 4, 65000.00),
('Eve Green', '202 Birch Blvd, Phoenix, AZ', 'QA Engineer', '555-1005', 5, 90000.00);

-- 3. Products
INSERT INTO products (product_type, price, mfd_date) VALUES
('Ultra Smartphone', 999.99, '2024-01-15'),
('Smart Watch Series 5', 299.99, '2024-02-20'),
('Noise Cancelling Headphones', 199.99, '2024-03-05'),
('Gaming Laptop', 1499.99, '2023-12-10'),
('Wireless Earbuds', 149.99, '2024-03-25');

-- 4. Raw Materials
INSERT INTO raw_materials (name, quantity, price) VALUES
('Lithium Battery', 500, 15.50),
('OLED Screen', 300, 45.00),
('Processor Chip', 1000, 30.00),
('Plastic Casing', 2000, 5.00),
('Aluminum Frame', 400, 10.00);

-- 5. Customers
INSERT INTO customers (name, address, contact) VALUES
('John Smith', '789 Broadway, New York, NY', '555-2001'),
('Mary Johnson', '321 Sunset Blvd, Los Angeles, CA', '555-2002'),
('Michael Brown', '456 W Lake St, Chicago, IL', '555-2003'),
('Sarah Davis', '987 Texas Ave, Houston, TX', '555-2004'),
('James Wilson', '654 Central Ave, Phoenix, AZ', '555-2005');

-- 6. Suppliers
INSERT INTO suppliers (name, address, contact) VALUES
('Global Electronics', '101 Shenzhen St, China', '555-3001'),
('Tech Mining Co.', '202 Perth Way, Australia', '555-3002'),
('Plastic Corp', '303 Mumbai Rd, India', '555-3003'),
('Advanced Circuits', '404 Silicon Valley, USA', '555-3004'),
('Frame Works Ltd.', '505 Berlin Ave, Germany', '555-3005');

-- 7. Defects
INSERT INTO defects (product_id, description, status, handled_by_employee_id) VALUES
(1, 'Dead pixels on OLED screen', 'pending', 5),
(2, 'Battery draining fast', 'resolved', 2),
(4, 'Overheating during gaming', 'cancelled', NULL),
(1, 'Charging port loose', 'pending', NULL),
(5, 'Bluetooth connectivity issues', 'resolved', 5);

-- 8. Employee_Product mappings
INSERT INTO employee_product (employee_id, product_id) VALUES
(2, 1),
(2, 4),
(5, 1),
(5, 2),
(5, 5);

-- 9. Product_Material mappings
INSERT INTO product_material (product_id, material_id, quantity_used) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(1, 5, 1),
(4, 3, 2);
