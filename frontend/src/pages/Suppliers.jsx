import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Search, Truck, Globe, Phone, Filter } from 'lucide-react';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchSuppliers = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/suppliers')
      .then(res => res.json())
      .then(data => {
        setSuppliers(data);
        setLoading(false);
      });
  };

  useEffect(() => fetchSuppliers(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/suppliers/${editingId}`
      : 'http://localhost:5000/api/suppliers';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchSuppliers();
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', contact: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (sup) => {
    setFormData({ name: sup.name, address: sup.address || '', contact: sup.contact || '' });
    setEditingId(sup.supplier_id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Terminate vendor contract?')) {
      fetch(`http://localhost:5000/api/suppliers/${id}`, { method: 'DELETE' })
        .then(() => fetchSuppliers());
    }
  };

  const uniqueLocations = [...new Set(suppliers.map(s => s.address).filter(Boolean))];

  const filteredSuppliers = suppliers.filter(sup => 
    (filterLocation === '' || sup.address === filterLocation) &&
    (sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sup.address && sup.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sup.supplier_id.toString().includes(searchTerm))
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Supply Network</h2>
          <p className="page-subtitle">Vendor partnerships and logistics management</p>
        </div>
        <button className="primary add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Onboard Vendor</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>{editingId ? 'Update Partnership' : 'New Supply Profile'}</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group grid-span-full">
              <label>Company Name</label>
              <div className="input-with-icon">
                <Truck size={14} className="input-icon" />
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Steel Dynamics Inc." />
              </div>
            </div>
            <div className="form-group">
               <label>Headquarters</label>
              <div className="input-with-icon">
                <Globe size={14} className="input-icon" />
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Main HQ Address" />
              </div>
            </div>
            <div className="form-group">
               <label>Vendor Support Line</label>
              <div className="input-with-icon">
                <Phone size={14} className="input-icon" />
                <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+1 (800) LOGISTICS" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>Confirm Partnership</span>
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
              placeholder="Search suppliers by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-pill" style={{ padding: '0 12px' }}>
            <Filter size={16} />
            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', padding: '8px 4px', fontSize: '0.8125rem' }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Locations</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc} style={{ background: '#0f172a' }}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <div className="loading">Auditing network...</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Partner</th>
                <th>Main Headquarters</th>
                <th>Contact Line</th>
                <th>Partnership Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(sup => (
                <tr key={sup.supplier_id}>
                  <td><span className="id-pill">#{sup.supplier_id}</span></td>
                  <td>
                    <div className="sup-cell">
                       <div className="sup-icon-mini"><Truck size={14}/></div>
                       <span className="font-bold text-primary">{sup.name}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{sup.address || 'Global'}</td>
                  <td>
                    <span className="contact-tag"><Phone size={12}/> {sup.contact || 'No Line'}</span>
                  </td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn edit" onClick={() => handleEdit(sup)}><Edit2 size={18}/></button>
                      <button className="row-action-btn delete" onClick={() => handleDelete(sup.supplier_id)}><Trash2 size={18}/></button>
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
        
        .sup-cell { display: flex; align-items: center; gap: 12px; }
        .sup-icon-mini { width: 28px; height: 28px; background: rgba(59, 130, 246, 0.1); color: var(--accent-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .contact-tag { display: flex; align-items: center; gap: 8px; padding: 4px 10px; background: rgba(148, 163, 184, 0.08); color: var(--text-secondary); border-radius: 6px; font-weight: 700; font-size: 0.75rem; }
        .font-bold { font-weight: 700; color: var(--text-primary); }
        .input-with-icon { position: relative; width: 100%; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); opacity: 0.5; }
        .input-with-icon input { padding-left: 40px; }
        
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

export default Suppliers;
