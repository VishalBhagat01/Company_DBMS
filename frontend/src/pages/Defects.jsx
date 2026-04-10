import { useState, useEffect } from 'react';
import { Plus, Check, X, Filter, AlertTriangle, User, Package, Search } from 'lucide-react';

function Defects() {
  const [defects, setDefects] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    product_id: '', description: '', handled_by_employee_id: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = filterStatus 
        ? `http://localhost:5000/api/defects?status=${filterStatus}`
        : 'http://localhost:5000/api/defects';
      
      const [defRes, prodRes, empRes] = await Promise.all([
        fetch(url),
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/employees')
      ]);
      setDefects(await defRes.json());
      setProducts(await prodRes.json());
      setEmployees(await empRes.json());
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/defects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchData();
      setFormData({ product_id: '', description: '', handled_by_employee_id: '' });
      setShowForm(false);
    });
  };

  const handleUpdateStatus = (id, status, empId) => {
    fetch(`http://localhost:5000/api/defects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, handled_by_employee_id: empId })
    })
    .then(() => fetchData());
  };

  const filteredDefects = defects.filter(d => 
    d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.product_type && d.product_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    d.defect_id.toString().includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Quality Assurance</h2>
          <p className="page-subtitle">Inventory defect tracking and resolution hub</p>
        </div>
        <div className="header-actions">
          <button className="primary add-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            <span>Report Defect</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>Record New Incident</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group">
              <label>Affected Product</label>
              <div className="input-with-icon">
                <Package size={18} className="input-icon" />
                <select required value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                  <option value="">Select Item</option>
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.product_type} (#{p.product_id})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Lead Personnel</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <select value={formData.handled_by_employee_id} onChange={e => setFormData({...formData, handled_by_employee_id: e.target.value})}>
                  <option value="">Assign Employee</option>
                  {employees.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group grid-span-full">
              <label>Detailed Observations</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the quality issue..." />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>Submit Incident</span>
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
              placeholder="Search by product, description or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-pill" style={{ padding: '0 12px' }}>
            <Filter size={16} />
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', padding: '8px 4px', fontSize: '0.8125rem' }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Scopes</option>
              <option value="pending" style={{ background: '#0f172a' }}>Pending</option>
              <option value="resolved" style={{ background: '#0f172a' }}>Resolved</option>
              <option value="cancelled" style={{ background: '#0f172a' }}>Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? <div className="loading text-center py-8">Auditing defect database...</div> : (
          <table>
            <thead>
              <tr>
                <th>Timeline</th>
                <th>Product</th>
                <th>Issue Details</th>
                <th>Personnel</th>
                <th>Severity</th>
                <th>Workflow</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map(d => (
                <tr key={d.defect_id}>
                  <td className="text-secondary font-medium">{new Date(d.defect_date).toLocaleDateString()}</td>
                  <td>
                    <div className="prod-cell">
                      <div className="prod-icon-mini"><Package size={18}/></div>
                      <span className="font-bold text-primary">{d.product_type}</span>
                    </div>
                  </td>
                  <td className="desc-cell"><AlertTriangle size={18} className="desc-icon" /> {d.description}</td>
                  <td><span className="user-tag">{d.employee_name || 'Idle'}</span></td>
                  <td><span className={`status-tag status-${d.status}`}>{d.status}</span></td>
                  <td>
                    <select 
                      className="workflow-selector"
                      value={d.status} 
                      onChange={e => handleUpdateStatus(d.defect_id, e.target.value, d.handled_by_employee_id)}
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="resolved">Mark Resolved</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>
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
        .header-actions { display: flex; gap: 16px; align-items: center; }
        
        .filter-pill-large { display: flex; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 12px; color: var(--text-secondary); }
        .filter-pill-large select { background: none; border: none; padding: 0; font-size: 0.875rem; color: white; width: auto; font-weight: 700; }
        
        .entry-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-span-full { grid-column: 1 / -1; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        
        .prod-cell { display: flex; align-items: center; gap: 12px; }
        .prod-icon-mini { width: 32px; height: 32px; background: rgba(239, 68, 68, 0.1); color: var(--error); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .desc-cell { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--text-secondary); max-width: 300px; }
        .desc-icon { opacity: 0.6; color: var(--warning); min-width: 18px; }
        .user-tag { font-size: 0.75rem; font-weight: 700; color: #60a5fa; background: rgba(59, 130, 246, 0.1); padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; min-width: 80px; }
        
        .workflow-selector { 
          padding: 8px 12px; 
          font-size: 0.75rem; 
          font-weight: 700; 
          background: rgba(15, 23, 42, 0.6); 
          border: 1px solid var(--border-color); 
          border-radius: 10px; 
          width: 140px;
          color: white;
          cursor: pointer;
        }
        .workflow-selector option {
          color: white;
          padding: 8px;
        }
        .workflow-selector:hover { border-color: var(--accent-color); background: rgba(59, 130, 246, 0.05); }

        .input-with-icon { position: relative; width: 100%; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); opacity: 0.5; }
        .input-with-icon select { padding-left: 44px; }

        .table-controls { display: flex; gap: 16px; margin-bottom: 24px; }
        .search-pill, .filter-pill { display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 12px; color: var(--text-secondary); }
        .search-pill input { background: none; border: none; padding: 0; font-size: 0.8125rem; color: white; width: 100%; }
        .search-pill input:focus { outline: none; }

        .close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255, 255, 255, 0.03); color: var(--text-secondary); }
        .close-btn:hover { background: var(--error); color: white; }
      `}} />
    </div>
  );
}

export default Defects;
