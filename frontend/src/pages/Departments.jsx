import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Building2, Phone } from 'lucide-react';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', head_of_dept: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/departments/${editingId}`
      : 'http://localhost:5000/api/departments';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchDepartments();
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', contact: '', head_of_dept: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (dept) => {
    setFormData({ name: dept.name, contact: dept.contact || '', head_of_dept: dept.head_of_dept || '' });
    setEditingId(dept.department_id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this department? This may affect assigned employees.')) {
      fetch(`http://localhost:5000/api/departments/${id}`, { method: 'DELETE' })
        .then(() => fetchDepartments());
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Departments</h2>
          <p className="page-subtitle">Organizational structure and leadership</p>
        </div>
        <button className="primary add-btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', contact: '', head_of_dept: '' }); }}>
          <Plus size={18} />
          <span>New Department</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>{editingId ? 'Modify Department' : 'Create Department'}</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group grid-span-full">
              <label>Department Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Research & Development" />
            </div>
            <div className="form-group">
              <label>Head of Department</label>
              <input type="text" value={formData.head_of_dept} onChange={e => setFormData({...formData, head_of_dept: e.target.value})} placeholder="Manager Name" />
            </div>
            <div className="form-group">
              <label>Contact/Extension</label>
              <div className="input-with-icon">
                 <Phone size={14} className="input-icon" />
                 <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="Ext 123" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>{editingId ? 'Update Info' : 'Confirm'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass section-card table-container">
        {loading ? (
          <div className="loading text-center py-6">Retrieving structure...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Leadership</th>
                <th>Contact Info</th>
                <th>Operational Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.department_id}>
                  <td><span className="id-pill">#{dept.department_id}</span></td>
                  <td>
                    <div className="dept-cell">
                      <div className="dept-icon-mini"><Building2 size={14}/></div>
                      <span className="font-bold text-primary">{dept.name}</span>
                    </div>
                  </td>
                  <td className="text-secondary font-medium">{dept.head_of_dept || 'Unassigned'}</td>
                  <td><span className="contact-pill">{dept.contact || 'N/A'}</span></td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn edit" onClick={() => handleEdit(dept)}><Edit2 size={18}/></button>
                      <button className="row-action-btn delete" onClick={() => handleDelete(dept.department_id)}><Trash2 size={18}/></button>
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
        .grid-span-full { grid-column: 1 / -1; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .form-header h3 { font-size: 1.25rem; font-weight: 800; }
        
        .dept-cell { display: flex; align-items: center; gap: 12px; }
        .dept-icon-mini { width: 28px; height: 28px; background: rgba(59, 130, 246, 0.1); color: var(--accent-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .contact-pill { font-size: 0.75rem; color: var(--text-secondary); padding: 4px 10px; background: rgba(15, 23, 42, 0.4); border-radius: 999px; border: 1px solid var(--border-color); }
        .font-bold { font-weight: 700; color: var(--text-primary); }
        .font-medium { font-weight: 500; }
        .input-with-icon { position: relative; width: 100%; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); opacity: 0.5; }
        .input-with-icon input { padding-left: 40px; }

        .id-pill { font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); padding: 2px 6px; background: rgba(15, 23, 42, 0.4); border-radius: 4px; }
        .close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255, 255, 255, 0.03); color: var(--text-secondary); }
        .close-btn:hover { background: var(--error); color: white; }
      `}} />
    </div>
  );
}

export default Departments;
