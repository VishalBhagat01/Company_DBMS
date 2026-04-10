import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Search, Filter } from 'lucide-react';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', address: '', designation: '', contact: '', department_id: '', salary: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        fetch('http://localhost:5000/api/employees'),
        fetch('http://localhost:5000/api/departments')
      ]);
      const empData = await empRes.json();
      const deptData = await deptRes.json();
      setEmployees(empData);
      setDepartments(deptData);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/employees/${editingId}`
      : 'http://localhost:5000/api/employees';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchData();
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', designation: '', contact: '', department_id: '', salary: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (emp) => {
    setFormData({ 
      name: emp.name, 
      address: emp.address || '', 
      designation: emp.designation || '', 
      contact: emp.contact || '', 
      department_id: emp.department_id || '', 
      salary: emp.salary || '' 
    });
    setEditingId(emp.employee_id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee record?')) {
      fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' })
        .then(() => fetchData());
    }
  };

  const filteredEmployees = employees.filter(emp => 
    (filterDepartment === '' || emp.department_name === filterDepartment) &&
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.designation && emp.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.department_name && emp.department_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    emp.employee_id.toString().includes(searchTerm))
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Employees Directory</h2>
          <p className="page-subtitle">Manage company staff and their assignments</p>
        </div>
        <button className="primary add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>{editingId ? 'Edit Profile' : 'Register New Employee'}</h3>
            <button className="close-btn icon-btn-centered" onClick={resetForm}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="Senior Engineer" />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Salary (Annual)</label>
              <input type="number" step="0.01" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-group">
              <label>Home Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main St, City" />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>{editingId ? 'Update Profile' : 'Save Record'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass section-card table-container">
        <div className="table-controls">
          <div className="search-pill">
            <Search size={16} />
            <input 
               type="text" 
               placeholder="Search by name, role or ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-pill" style={{ padding: '0 12px' }}>
            <Filter size={16} />
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', padding: '8px 4px', fontSize: '0.8125rem' }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Departments</option>
              {departments.map(d => (
                <option key={d.department_id} value={d.name} style={{ background: '#0f172a' }}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? <div className="loading">Processing...</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Compensation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.employee_id}>
                  <td><span className="id-pill">#{emp.employee_id}</span></td>
                  <td>
                    <div className="avatar-info">
                      <div className="avatar-small">{emp.name[0]}</div>
                      <span className="font-bold">{emp.name}</span>
                    </div>
                  </td>
                  <td><span className="dept-tag">{emp.department_name || 'N/A'}</span></td>
                  <td className="text-secondary">{emp.designation || 'Staff'}</td>
                  <td className="salary-val">${parseFloat(emp.salary || 0).toLocaleString()}</td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn edit" onClick={() => handleEdit(emp)}><Edit2 size={18}/></button>
                      <button className="row-action-btn delete" onClick={() => handleDelete(emp.employee_id)}><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .page-subtitle { color: var(--text-secondary); margin-top: -24px; font-weight: 500; font-size: 0.875rem; }
        .entry-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--accent-color); opacity: 0.8; margin-bottom: 8px; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .form-header h3 { font-size: 1.25rem; font-weight: 800; }
        .close-btn { width: 32px; height: 32px; background: rgba(255, 255, 255, 0.03); color: var(--text-secondary); border-radius: 8px; }
        .close-btn:hover { background: var(--error); color: white; }
        
        .table-controls { display: flex; gap: 16px; margin-bottom: 24px; }
        .search-pill, .filter-pill { display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 12px; color: var(--text-secondary); }
        .search-pill input { background: none; border: none; padding: 0; font-size: 0.8125rem; color: white; width: 100%; }
        .search-pill input:focus { outline: none; }
        
        .avatar-info { display: flex; align-items: center; gap: 12px; }
        .avatar-small { width: 32px; height: 32px; background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--accent-color); }
        .id-pill { font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); padding: 2px 6px; background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
        .font-bold { font-weight: 700; color: var(--text-primary); }
        .dept-tag { padding: 4px 10px; background: rgba(59, 130, 246, 0.08); color: var(--accent-color); border-radius: 6px; font-weight: 700; font-size: 0.75rem; }
        .salary-val { font-family: 'JetBrains Mono', monospace; color: var(--success); font-weight: 700; font-size: 0.875rem; }
      `}} />
    </div>
  );
}

export default Employees;
