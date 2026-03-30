-- Company Management System Database Schema

-- 1. Departments Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact VARCHAR(20),
    head_of_dept VARCHAR(255)
);

-- 2. Employees Table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    designation VARCHAR(100),
    contact VARCHAR(20),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    salary DECIMAL(12, 2)
);

-- 3. Products Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_type VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2),
    mfd_date DATE
);

-- 4. Raw Materials Table
CREATE TABLE raw_materials (
    material_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    quantity INT DEFAULT 0,
    price DECIMAL(12, 2)
);

-- 5. Customers Table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact VARCHAR(20)
);

-- 6. Suppliers Table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact VARCHAR(20)
);

-- 7. Defects Table
CREATE TABLE defects (
    defect_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    description TEXT,
    defect_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'cancelled')),
    handled_by_employee_id INT REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- 8. Employee_Product (Many-to-Many junction table)
CREATE TABLE employee_product (
    employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, product_id)
);

-- 9. Product_Material (Many-to-Many junction table)
CREATE TABLE product_material (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    material_id INT REFERENCES raw_materials(material_id) ON DELETE CASCADE,
    quantity_used INT NOT NULL DEFAULT 1,
    PRIMARY KEY (product_id, material_id)
);
