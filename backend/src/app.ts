import cors from 'cors';
import express, { Request, Response } from 'express';
import db from './db';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    const [empCount, prodCount, defCount, pendingDef, deptCount, matCount, custCount, supCount] = await Promise.all([
      db.query('SELECT COUNT(*) FROM employees'),
      db.query('SELECT COUNT(*) FROM products'),
      db.query('SELECT COUNT(*) FROM defects'),
      db.query("SELECT COUNT(*) FROM defects WHERE status = 'pending'"),
      db.query('SELECT COUNT(*) FROM departments'),
      db.query('SELECT COUNT(*) FROM raw_materials'),
      db.query('SELECT COUNT(*) FROM customers'),
      db.query('SELECT COUNT(*) FROM suppliers'),
    ]);

    res.json({
      totalEmployees: Number(empCount.rows[0].count),
      totalProducts: Number(prodCount.rows[0].count),
      totalDefects: Number(defCount.rows[0].count),
      pendingDefects: Number(pendingDef.rows[0].count),
      totalDepartments: Number(deptCount.rows[0].count),
      totalMaterials: Number(matCount.rows[0].count),
      totalCustomers: Number(custCount.rows[0].count),
      totalSuppliers: Number(supCount.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/departments', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM departments ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/departments', async (req: Request, res: Response) => {
  const { name, contact, head_of_dept } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO departments (name, contact, head_of_dept) VALUES ($1, $2, $3) RETURNING *',
      [name, contact, head_of_dept],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/departments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, contact, head_of_dept } = req.body;
  try {
    const result = await db.query(
      'UPDATE departments SET name=$1, contact=$2, head_of_dept=$3 WHERE department_id=$4 RETURNING *',
      [name, contact, head_of_dept, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/departments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM departments WHERE department_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/employees', async (_req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT e.*, d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      ORDER BY e.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/employees', async (req: Request, res: Response) => {
  const { name, address, designation, contact, department_id, salary } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO employees (name, address, designation, contact, department_id, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, designation, contact, department_id, salary],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/employees/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, designation, contact, department_id, salary } = req.body;
  try {
    const result = await db.query(
      'UPDATE employees SET name=$1, address=$2, designation=$3, contact=$4, department_id=$5, salary=$6 WHERE employee_id=$7 RETURNING *',
      [name, address, designation, contact, department_id, salary, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM employees WHERE employee_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY product_id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  const { product_type, price, mfd_date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (product_type, price, mfd_date) VALUES ($1, $2, $3) RETURNING *',
      [product_type, price, mfd_date],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/products/:id/defects', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM defects WHERE product_id=$1', [id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/materials', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM raw_materials ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/materials', async (req: Request, res: Response) => {
  const { name, quantity, price } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO raw_materials (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [name, quantity, price],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/materials/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  try {
    const result = await db.query(
      'UPDATE raw_materials SET name=$1, quantity=$2, price=$3 WHERE material_id=$4 RETURNING *',
      [name, quantity, price, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/materials/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM raw_materials WHERE material_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/customers', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/customers', async (req: Request, res: Response) => {
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO customers (name, address, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'UPDATE customers SET name=$1, address=$2, contact=$3 WHERE customer_id=$4 RETURNING *',
      [name, address, contact, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM customers WHERE customer_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/suppliers', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM suppliers ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/suppliers', async (req: Request, res: Response) => {
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO suppliers (name, address, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/suppliers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, contact } = req.body;
  try {
    const result = await db.query(
      'UPDATE suppliers SET name=$1, address=$2, contact=$3 WHERE supplier_id=$4 RETURNING *',
      [name, address, contact, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/suppliers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM suppliers WHERE supplier_id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/defects', async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    let queryText = `
      SELECT d.*, p.product_type, e.name as employee_name
      FROM defects d
      LEFT JOIN products p ON d.product_id = p.product_id
      LEFT JOIN employees e ON d.handled_by_employee_id = e.employee_id
    `;
    const params: unknown[] = [];

    if (status) {
      queryText += ' WHERE d.status = $1';
      params.push(status);
    }

    queryText += ' ORDER BY d.defect_date DESC';
    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/defects', async (req: Request, res: Response) => {
  const { product_id, description, handled_by_employee_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO defects (product_id, description, handled_by_employee_id) VALUES ($1, $2, $3) RETURNING *',
      [product_id, description, handled_by_employee_id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/defects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, handled_by_employee_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE defects SET status=$1, handled_by_employee_id=$2 WHERE defect_id=$3 RETURNING *',
      [status, handled_by_employee_id, id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/products/:id/assign-employee', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { employee_id } = req.body;
  try {
    await db.query(
      'INSERT INTO employee_product (employee_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [employee_id, id],
    );
    res.json({ message: 'Employee assigned to product' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/products/:id/add-material', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { material_id, quantity_used } = req.body;
  try {
    await db.query(
      'INSERT INTO product_material (product_id, material_id, quantity_used) VALUES ($1, $2, $3) ON CONFLICT (product_id, material_id) DO UPDATE SET quantity_used = product_material.quantity_used + $3',
      [id, material_id, quantity_used],
    );
    res.json({ message: 'Material added to product' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default app;