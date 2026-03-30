import { useState, useEffect } from 'react';
import { Plus, Check, Eye, X, Users, Layers, Search, BarChart3 } from 'lucide-react';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ product_type: '', price: '', mfd_date: '' });
  const [viewDefectsId, setViewDefectsId] = useState(null);
  const [defects, setDefects] = useState([]);

  const [showAssignEmp, setShowAssignEmp] = useState(false);
  const [showAddMat, setShowAddMat] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignData, setAssignData] = useState({ employee_id: '', material_id: '', quantity_used: 1 });
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  const fetchDefects = (id) => {
    fetch(`http://localhost:5000/api/products/${id}/defects`)
      .then(res => res.json())
      .then(data => setDefects(data));
  };

  const fetchAssignmentData = async () => {
    const [empRes, matRes] = await Promise.all([
      fetch('http://localhost:5000/api/employees'),
      fetch('http://localhost:5000/api/materials')
    ]);
    setEmployees(await empRes.json());
    setMaterials(await matRes.json());
  };

  useEffect(() => fetchProducts(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchProducts();
      setFormData({ product_type: '', price: '', mfd_date: '' });
      setShowForm(false);
    });
  };

  const handleAssignEmployee = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/products/${selectedProductId}/assign-employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: assignData.employee_id })
    }).then(() => setShowAssignEmp(false));
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/products/${selectedProductId}/add-material`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ material_id: assignData.material_id, quantity_used: assignData.quantity_used })
    }).then(() => setShowAddMat(false));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Products Inventory</h2>
          <p className="page-subtitle">Track production lines, defects and material usage</p>
        </div>
        <button className="primary add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>New Product</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>Add Production Item</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group">
              <label>Product Name/Type</label>
              <input type="text" required value={formData.product_type} onChange={e => setFormData({...formData, product_type: e.target.value})} placeholder="e.g. Model X-1" />
            </div>
            <div className="form-group">
              <label>Market Price</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Manufacturing Date</label>
              <input type="date" required value={formData.mfd_date} onChange={e => setFormData({...formData, mfd_date: e.target.value})} />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {showAssignEmp && (
        <div className="modal-overlay" onClick={() => setShowAssignEmp(false)}>
          <div className="glass modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Users size={18} /> Assign Staff</h3>
              <button className="close-btn icon-btn-centered" onClick={() => setShowAssignEmp(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleAssignEmployee} className="mt-4">
              <div className="form-group">
                <label>Responsible Employee</label>
                <select required value={assignData.employee_id} onChange={e => setAssignData({...assignData, employee_id: e.target.value})}>
                  <option value="">Select Personnel</option>
                  {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
                </select>
              </div>
              <button type="submit" className="primary mt-6 w-full">Confirm Assignment</button>
            </form>
          </div>
        </div>
      )}

      {showAddMat && (
        <div className="modal-overlay" onClick={() => setShowAddMat(false)}>
          <div className="glass modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Layers size={18} /> Register Consumables</h3>
              <button className="close-btn icon-btn-centered" onClick={() => setShowAddMat(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleAddMaterial} className="mt-4">
              <div className="form-group">
                <label>Raw Material Used</label>
                <select required value={assignData.material_id} onChange={e => setAssignData({...assignData, material_id: e.target.value})}>
                  <option value="">Select Material</option>
                  {materials.map(mat => <option key={mat.material_id} value={mat.material_id}>{mat.name}</option>)}
                </select>
              </div>
              <div className="form-group mt-4">
                <label>Batch Quantity</label>
                <input type="number" required value={assignData.quantity_used} onChange={e => setAssignData({...assignData, quantity_used: e.target.value})} />
              </div>
              <button type="submit" className="primary mt-6 w-full">Update Components</button>
            </form>
          </div>
        </div>
      )}

      {viewDefectsId && (
        <div className="modal-overlay" onClick={() => setViewDefectsId(null)}>
          <div className="glass modal-content large animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>History for Item #{viewDefectsId}</h3>
              <button className="close-btn icon-btn-centered" onClick={() => setViewDefectsId(null)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              {defects.length === 0 ? <div className="empty-state">No incidents reported on this product line.</div> : (
                <table>
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Incident Description</th>
                      <th>Current Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defects.map(d => (
                      <tr key={d.defect_id}>
                        <td className="id-pill">#{d.defect_id}</td>
                        <td className="font-semibold text-primary">{d.description}</td>
                        <td><span className={`status-tag status-${d.status}`}>{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="glass section-card table-container">
        <div className="table-controls">
          <div className="search-pill">
            <Search size={16} />
            <input type="text" placeholder="Filter by product name..." />
          </div>
          <div className="filter-pill">
             <BarChart3 size={16} />
             <span>Analytics</span>
          </div>
        </div>

        {loading ? <div className="loading">Syncing data...</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Production Item</th>
                <th>Unit Valuation</th>
                <th>MFD Timeline</th>
                <th>Assignment Hub</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.product_id}>
                  <td><span className="id-pill">#{p.product_id}</span></td>
                  <td><span className="font-bold">{p.product_type}</span></td>
                  <td className="valuation-val">${parseFloat(p.price).toLocaleString()}</td>
                  <td className="text-secondary">{new Date(p.mfd_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn view" title="Defects" onClick={() => { setViewDefectsId(p.product_id); fetchDefects(p.product_id); }}>
                        <Eye size={18} />
                      </button>
                      <button className="row-action-btn edit" title="Staff" onClick={() => { setSelectedProductId(p.product_id); fetchAssignmentData(); setShowAssignEmp(true); }}>
                        <Users size={18} />
                      </button>
                      <button className="row-action-btn stock" title="Stock" onClick={() => { setSelectedProductId(p.product_id); fetchAssignmentData(); setShowAddMat(true); }}>
                        <Layers size={18} />
                      </button>
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
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .form-header h3 { font-size: 1.25rem; font-weight: 800; }
        
        .valuation-val { font-family: 'JetBrains Mono', monospace; color: var(--accent-color); font-weight: 700; }
        .font-bold { font-weight: 700; color: var(--text-primary); }
        .id-pill { font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); padding: 2px 6px; background: rgba(15, 23, 42, 0.4); border-radius: 4px; }
        
        .table-controls { display: flex; gap: 16px; margin-bottom: 24px; }
        .search-pill, .filter-pill { display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 12px; color: var(--text-secondary); }
        .search-pill input { background: none; border: none; padding: 0; font-size: 0.8125rem; color: white; width: 100%; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { width: 440px; padding: 32px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .modal-content.large { width: 700px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h3 { display: flex; align-items: center; gap: 10px; font-weight: 800; }
        .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); font-style: italic; }
        .close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.03); color: var(--text-secondary); }
        .close-btn:hover { background: var(--error); color: white; }
        .w-full { width: 100%; }
        .mt-6 { margin-top: 24px; }
      `}} />
    </div>
  );
}

export default Products;
