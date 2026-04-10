import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Search, UserCircle, MapPin, Phone, Filter } from 'lucide-react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      });
  };

  useEffect(() => fetchCustomers(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/customers/${editingId}`
      : 'http://localhost:5000/api/customers';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      fetchCustomers();
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', contact: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (cust) => {
    setFormData({ name: cust.name, address: cust.address || '', contact: cust.contact || '' });
    setEditingId(cust.customer_id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove customer from CRM?')) {
      fetch(`http://localhost:5000/api/customers/${id}`, { method: 'DELETE' })
        .then(() => fetchCustomers());
    }
  };

  const uniqueLocations = [...new Set(customers.map(c => c.address).filter(Boolean))];

  const filteredCustomers = customers.filter(cust => 
    (filterLocation === '' || cust.address === filterLocation) &&
    (cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cust.address && cust.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cust.customer_id.toString().includes(searchTerm))
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="title-section">
          <h2 className="page-title">Customers CRM</h2>
          <p className="page-subtitle">Client relationship management and communications</p>
        </div>
        <button className="primary add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>New Client</span>
        </button>
      </div>

      {showForm && (
        <div className="glass section-card form-popover">
          <div className="form-header">
            <h3>{editingId ? 'Edit Client Data' : 'Onboard New Client'}</h3>
            <button className="close-btn icon-btn-centered" onClick={() => setShowForm(false)}><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="entry-form-grid">
            <div className="form-group grid-span-full">
              <label>Full Name / Company Name</label>
              <div className="input-with-icon">
                <UserCircle size={14} className="input-icon" />
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
            </div>
            <div className="form-group">
              <label>Communication Line</label>
              <div className="input-with-icon">
                <Phone size={14} className="input-icon" />
                <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+1 (000) 000-0000" />
              </div>
            </div>
            <div className="form-group">
              <label>Service Address</label>
              <div className="input-with-icon">
                <MapPin size={14} className="input-icon" />
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="City, State" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="primary submit-btn">
                <Check size={18} />
                <span>Save Client</span>
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
              placeholder="Search clients by name or address..." 
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

        {loading ? <div className="loading">Syncing CRM...</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Service Location</th>
                <th>Contact Hub</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(cust => (
                <tr key={cust.customer_id}>
                  <td><span className="id-pill">#{cust.customer_id}</span></td>
                  <td><span className="font-bold text-primary">{cust.name}</span></td>
                  <td className="text-secondary">
                    <div className="icon-row"><MapPin size={12}/> {cust.address || 'Global'}</div>
                  </td>
                  <td>
                    <span className="contact-pill"><Phone size={12}/> {cust.contact || 'No Contact'}</span>
                  </td>
                  <td>
                    <div className="row-actions-group">
                      <button className="row-action-btn edit" onClick={() => handleEdit(cust)}><Edit2 size={18}/></button>
                      <button className="row-action-btn delete" onClick={() => handleDelete(cust.customer_id)}><Trash2 size={18}/></button>
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
        
        .icon-row { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; }
        .contact-pill { display: flex; align-items: center; gap: 8px; padding: 4px 10px; background: rgba(59, 130, 246, 0.08); color: var(--accent-color); border-radius: 6px; font-weight: 700; font-size: 0.75rem; }
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

export default Customers;
