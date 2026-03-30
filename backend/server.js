const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Dashboard ---
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const employeeCount = await db.query('SELECT COUNT(*) FROM employees');
    const productCount = await db.query('SELECT COUNT(*) FROM products');
    const pendingDefects = await db.query("SELECT COUNT(*) FROM defects WHERE status = 'pending'");
    
    res.json({
      totalEmployees: parseInt(employeeCount.rows[0].count),
      totalProducts: parseInt(productCount.rows[0].count),
      pendingDefects: parseInt(pendingDefects.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Departments ---
app.get('/api/departments', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM departments ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  const { name, contact, head_of_dept } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO departments (name, contact, head_of_dept) VALUES ($1, $2, $3) RETURNING *',
      [name, contact, head_of_dept]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, head_of_dept } = req.body;
  try {
    const result = await db.query(
      'UPDATE departments SET name=$1, contact=$2, head_of_dept=$3 WHERE department_id=$4 RETURNING *',
      [name, contact, head_of_dept, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM departments WHERE department_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Employees ---
app.get('/api/employees', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, d.name as department_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.department_id 
      ORDER BY e.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, address, designation, contact, department_id, salary } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO employees (name, address, designation, contact, department_id, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, designation, contact, department_id, salary]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, designation, contact, department_id, salary } = req.body;
  try {
    const result = await db.query(
      'UPDATE employees SET name=$1, address=$2, designation=$3, contact=$4, department_id=$5, salary=$6 WHERE employee_id=$7 RETURNING *',
      [name, address, designation, contact, department_id, salary, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM employees WHERE employee_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY product_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { product_type, price, mfd_date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (product_type, price, mfd_date) VALUES ($1, $2, $3) RETURNING *',
      [product_type, price, mfd_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id/defects', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM defects WHERE product_id=$1', [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Raw Materials ---
app.get('/api/materials', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM raw_materials ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/materials', async (req, res) => {
  const { name, quantity, price } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO raw_materials (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [name, quantity, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Customers ---
app.get('/api/customers', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO customers (name, address, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Suppliers ---
app.get('/api/suppliers', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM suppliers ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO suppliers (name, address, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Defects ---
app.get('/api/defects', async (req, res) => {
  const { status } = req.query;
  try {
    let queryText = `
      SELECT d.*, p.product_type, e.name as employee_name 
      FROM defects d 
      LEFT JOIN products p ON d.product_id = p.product_id 
      LEFT JOIN employees e ON d.handled_by_employee_id = e.employee_id
    `;
    const params = [];
    if (status) {
      queryText += ' WHERE d.status = $1';
      params.push(status);
    }
    queryText += ' ORDER BY d.defect_date DESC';
    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/defects', async (req, res) => {
  const { product_id, description, handled_by_employee_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO defects (product_id, description, handled_by_employee_id) VALUES ($1, $2, $3) RETURNING *',
      [product_id, description, handled_by_employee_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/defects/:id', async (req, res) => {
  const { id } = req.params;
  const { status, handled_by_employee_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE defects SET status=$1, handled_by_employee_id=$2 WHERE defect_id=$3 RETURNING *',
      [status, handled_by_employee_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Assignments ---
app.post('/api/products/:id/assign-employee', async (req, res) => {
  const { id } = req.params;
  const { employee_id } = req.body;
  try {
    await db.query(
      'INSERT INTO employee_product (employee_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [employee_id, id]
    );
    res.json({ message: 'Employee assigned to product' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/add-material', async (req, res) => {
  const { id } = req.params;
  const { material_id, quantity_used } = req.body;
  try {
    await db.query(
      'INSERT INTO product_material (product_id, material_id, quantity_used) VALUES ($1, $2, $3) ON CONFLICT (product_id, material_id) DO UPDATE SET quantity_used = product_material.quantity_used + $3',
      [id, material_id, quantity_used]
    );
    res.json({ message: 'Material added to product' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
