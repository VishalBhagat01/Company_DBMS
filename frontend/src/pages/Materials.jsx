import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Search, Package, Filter } from 'lucide-react';

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchMaterials = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/materials')
      .then(res => res.json())
      .then(data => {
        setMaterials(data);
        setLoading(false);
      });
  };

  useEffect(() => fetchMaterials(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/materials/${editingId}`
      : 'http://localhost:5000/api/materials';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchMaterials();
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', quantity: '', price: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (mat) => {
    setFormData({ name: mat.name, quantity: mat.quantity, price: mat.price });
    setEditingId(mat.material_id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this material record?')) {
      fetch(`http://localhost:5000/api/materials/${id}`, { method: 'DELETE' })
        .then(() => fetchMaterials());
    }
  };

  const filteredMaterials = materials.filter(mat => 
    (filterStock === '' || 
    (filterStock === 'low' && mat.quantity < 10) || 
    (filterStock === 'in_stock' && mat.quantity >= 10)) &&
    (mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mat.material_id.toString().includes(searchTerm))
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Raw Materials</h2>
          <p className="page-subtitle">Inventory management for production components</p>
        </div>
        <button className="primary add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Add Material</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>{editingId ? 'Edit Material' : 'New Component'}</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group grid-span-full">
              <label>Material Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Steel Sheets" />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Unit Price</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>{editingId ? 'Update Stock' : 'Save Material'}</span>
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
              placeholder="Search materials by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-pill" style={{ padding: '0 12px' }}>
            <Filter size={16} />
            <select 
              value={filterStock} 
              onChange={(e) => setFilterStock(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', padding: '8px 4px', fontSize: '0.8125rem' }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Stock Levels</option>
              <option value="low" style={{ background: '#0f172a' }}>Low Stock</option>
              <option value="in_stock" style={{ background: '#0f172a' }}>In Stock</option>
            </select>
          </div>
        </div>

        {loading ? <div className="loading">Checking inventory...</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Material Detail</th>
                <th>Volume in Stock</th>
                <th>Unit Cost</th>
                <th>Total Valuation</th>
                <th>Inventory Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(mat => (
                <tr key={mat.material_id}>
                  <td><span className="id-pill">#{mat.material_id}</span></td>
                  <td>
                    <div className="mat-cell">
                      <div className="mat-icon-mini"><Package size={14}/></div>
                      <span className="font-bold text-primary">{mat.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stock-info">
                      <span className={`stock-val ${mat.quantity < 10 ? 'low' : ''}`}>{mat.quantity}</span>
                      <span className="stock-label">units</span>
                    </div>
                  </td>
                  <td className="text-secondary font-mono">${parseFloat(mat.price).toLocaleString()}</td>
                  <td className="text-primary font-bold font-mono">${(mat.quantity * mat.price).toLocaleString()}</td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn edit" onClick={() => handleEdit(mat)}><Edit2 size={18}/></button>
                      <button className="row-action-btn delete" onClick={() => handleDelete(mat.material_id)}><Trash2 size={18}/></button>
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
        
        .mat-cell { display: flex; align-items: center; gap: 12px; }
        .mat-icon-mini { width: 28px; height: 28px; background: rgba(16, 185, 129, 0.1); color: var(--success); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stock-info { display: flex; align-items: baseline; gap: 4px; }
        .stock-val { font-size: 1.125rem; font-weight: 800; color: var(--accent-color); }
        .stock-val.low { color: var(--error); }
        .stock-label { font-size: 0.625rem; text-transform: uppercase; font-weight: 700; color: var(--text-secondary); }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .table-controls { display: flex; gap: 16px; margin-bottom: 24px; }
        .search-pill, .filter-pill { display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 12px; color: var(--text-secondary); }
        .search-pill input { background: none; border: none; padding: 0; font-size: 0.8125rem; color: white; width: 100%; }
        .search-pill input:focus { outline: none; }

        .id-pill { font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); padding: 2px 6px; background: rgba(15, 23, 42, 0.4); border-radius: 4px; }
        .close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255, 255, 255, 0.03); color: var(--text-secondary); }
        .close-btn:hover { background: var(--error); color: white; }
      `}} />
    </div>
  );
}

export default Materials;
