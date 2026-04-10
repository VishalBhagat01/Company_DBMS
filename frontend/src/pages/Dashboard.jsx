import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  AlertCircle, 
  Activity, 
  ArrowUpRight, 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Network,
  GitBranch,
  Layers,
  Building2,
  Truck,
  UserCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, percent }) => (
  <div className="stat-card-premium glass">
    <div className="stat-card-top">
      <div className="stat-icon-wrapper" style={{ backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
        <Icon size={28} />
      </div>
      {percent && (
        <div className="stat-badge">
          <TrendingUp size={14} />
          <span>{percent}%</span>
        </div>
      )}
    </div>
    <div className="stat-card-info">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
    <div className="stat-card-footer">
      <div className="stat-progress-bg">
        <div className="stat-progress-fill" style={{ width: '65%', backgroundColor: `rgb(${color})` }}></div>
      </div>
    </div>
  </div>
);

const SchemaNode = ({ title, fields, color, icon: Icon }) => (
  <div className="schema-node glass">
    <div className="node-header" style={{ borderLeft: `4px solid ${color}` }}>
      <Icon size={18} style={{ color }} />
      <span>{title}</span>
    </div>
    <div className="node-fields">
      {fields.map(f => (
        <div key={f} className="node-field">
          <div className="field-dot"></div>
          <span>{f}</span>
        </div>
      ))}
    </div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    pendingDefects: 0,
    totalDefects: 0,
    totalDepartments: 0,
    totalMaterials: 0,
    totalCustomers: 0,
    totalSuppliers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in dashboard-page">
      <div className="dashboard-header">
        <div className="title-section">
          <h2 className="page-title">Operational Intel</h2>
          <p className="page-subtitle">Real-time metrics and system health monitoring</p>
        </div>
        <div className="header-actions">
          <div className="system-health">
            <div className="health-pulse"></div>
            <span className="health-text">System Status: Optimal</span>
          </div>
        </div>
      </div>
      
      <div className="stats-grid-premium">
        <StatCard 
          title="Active Personnel" 
          value={loading ? '...' : stats.totalEmployees} 
          icon={Users} 
          color="59, 130, 246" 
          percent="12.5"
        />
        <StatCard 
          title="Inventory Assets" 
          value={loading ? '...' : stats.totalProducts} 
          icon={Package} 
          color="16, 185, 129" 
          percent="8.2"
        />
        <StatCard 
          title="Critical Incidents" 
          value={loading ? '...' : stats.pendingDefects} 
          icon={AlertCircle} 
          color="239, 68, 68" 
        />
        <StatCard 
          title="Supply Network" 
          value={loading ? '...' : stats.totalSuppliers} 
          icon={Truck} 
          color="245, 158, 11" 
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="glass section-card schema-architect-section">
          <div className="section-header">
            <div className="header-icon"><Network size={20} /></div>
            <div className="header-text">
               <h3>System Data Model</h3>
               <p>Relational architecture and entity mapping</p>
            </div>
          </div>
          
          <div className="er-diagram-container">
            <div className="er-canvas">
              {/* Row 1 */}
              <div className="er-row">
                <SchemaNode 
                  title="Departments" 
                  color="#3b82f6" 
                  icon={Building2}
                  fields={['dept_id (PK)', 'name', 'head_of_dept']} 
                />
                <div className="connector-h"><div className="line"></div><div className="label">1:M</div></div>
                <SchemaNode 
                  title="Employees" 
                  color="#10b981" 
                  icon={Users}
                  fields={['emp_id (PK)', 'name', 'dept_id (FK)']} 
                />
                <div className="connector-h"><div className="line"></div><div className="label">1:M</div></div>
                <SchemaNode 
                  title="Emp_Product" 
                  color="#6366f1" 
                  icon={GitBranch}
                  fields={['emp_id (PFK)', 'prod_id (PFK)']} 
                />
              </div>

              {/* Transition 1 */}
              <div className="er-row-connector">
                <div className="line-v centered"></div>
                <div className="line-v right"></div>
              </div>

              {/* Row 2 */}
              <div className="er-row">
                <SchemaNode 
                  title="Customers" 
                  color="#ec4899" 
                  icon={UserCircle}
                  fields={['cust_id (PK)', 'name', 'address']} 
                />
                <div className="connector-h" style={{ opacity: 0 }}></div>
                <SchemaNode 
                  title="Defects" 
                  color="#ef4444" 
                  icon={AlertCircle}
                  fields={['defect_id (PK)', 'prod_id (FK)', 'handled_by (FK)']} 
                />
                <div className="connector-h"><div className="line"></div><div className="label">M:1</div></div>
                <SchemaNode 
                  title="Products" 
                  color="#f59e0b" 
                  icon={Package}
                  fields={['prod_id (PK)', 'type', 'mfd_date']} 
                />
              </div>

              {/* Transition 2 */}
              <div className="er-row-connector">
                <div className="line-v right"></div>
              </div>

              {/* Row 3 */}
              <div className="er-row">
                <SchemaNode 
                  title="Suppliers" 
                  color="#8b5cf6" 
                  icon={Truck}
                  fields={['sup_id (PK)', 'name', 'address']} 
                />
                <div className="connector-h" style={{ opacity: 0 }}></div>
                <SchemaNode 
                  title="Raw Materials" 
                  color="#14b8a6" 
                  icon={Layers}
                  fields={['mat_id (PK)', 'name', 'quantity']} 
                />
                <div className="connector-h"><div className="line"></div><div className="label">1:M</div></div>
                <SchemaNode 
                  title="Prod_Material" 
                  color="#0ea5e9" 
                  icon={GitBranch}
                  fields={['prod_id (PFK)', 'mat_id (PFK)', 'qty']} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="right-sidebar-grid">
          <div className="glass section-card tech-stack-card">
            <h3>System Architecture</h3>
            <div className="tech-items">
              <div className="tech-item">
                <div className="tech-icon"><Cpu size={16} /></div>
                <div className="tech-info">
                  <span className="tech-name">Engine</span>
                  <span className="tech-val">Node.js / Express</span>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon"><Database size={16} /></div>
                <div className="tech-info">
                  <span className="tech-name">Storage</span>
                  <span className="tech-val">PostgreSQL v15</span>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon"><ShieldCheck size={16} /></div>
                <div className="tech-info">
                  <span className="tech-name">Provider</span>
                  <span className="tech-val">Supabase Cloud</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass section-card quick-metrics">
            <h3>Network Pulse</h3>
            <div className="pulse-metric">
              <span className="pulse-label">Stakeholders</span>
              <span className="pulse-val">{stats.totalCustomers} Clients</span>
            </div>
            <div className="pulse-metric">
              <span className="pulse-label">Supply Chain</span>
              <span className="pulse-val">{stats.totalSuppliers} Vendors</span>
            </div>
            <div className="pulse-metric">
              <span className="pulse-label">Asset Health</span>
              <span className="pulse-val">{((stats.totalProducts - stats.totalDefects) / (stats.totalProducts || 1) * 100).toFixed(1)}% Optimal</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-page { padding-bottom: 40px; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .page-subtitle { color: var(--text-secondary); margin-top: -24px; font-weight: 500; font-size: 0.875rem; }
        
        .system-health { display: flex; align-items: center; gap: 12px; background: rgba(16, 185, 129, 0.05); color: #10b981; padding: 10px 20px; border-radius: 999px; border: 1px solid rgba(16, 185, 129, 0.1); }
        .health-pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 12px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
        .health-text { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

        .stats-grid-premium { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card-premium { padding: 32px; border-radius: 20px; border: 1px solid var(--border-color); }
        .stat-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .stat-icon-wrapper { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
        .stat-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #34d399; border-radius: 999px; font-size: 0.75rem; font-weight: 800; }
        .stat-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; color: var(--text-secondary); margin: 0; }
        .stat-value { font-size: 2.5rem; font-weight: 800; margin: 4px 0 0 0; color: var(--text-primary); }
        .stat-progress-bg { width: 100%; height: 4px; background: rgba(255, 255, 255, 0.03); border-radius: 2px; margin-top: 16px; overflow: hidden; }
        .stat-progress-fill { height: 100%; border-radius: 2px; }

        .dashboard-main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
        .section-header { display: flex; items-center; gap: 16px; margin-bottom: 40px; }
        .header-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(59, 130, 246, 0.1); color: var(--accent-color); display: flex; align-items: center; justify-content: center; }
        .header-text h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
        .header-text p { margin: 4px 0 0 0; font-size: 0.875rem; color: var(--text-secondary); }

        .er-diagram-container { padding: 40px 20px; color: white; }
        .er-canvas { display: flex; flex-direction: column; align-items: center; gap: 0; }
        .er-row { display: flex; align-items: center; justify-content: center; width: 100%; }
        .er-row.centered { justify-content: center; }
        
        .schema-node { padding: 14px; border-radius: 14px; width: 180px; border: 1px solid var(--border-color); background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); }
        .node-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-weight: 800; font-size: 0.8125rem; }
        .node-fields { display: flex; flex-direction: column; gap: 6px; }
        .node-field { display: flex; align-items: center; gap: 8px; font-size: 0.6875rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; }
        .field-dot { width: 4px; height: 4px; background: currentColor; opacity: 0.4; border-radius: 50%; }

        .connector-h { width: 80px; display: flex; flex-direction: column; align-items: center; position: relative; }
        .connector-h .line { width: 100%; height: 1px; background: rgba(255,255,255,0.1); }
        .connector-h .label { font-size: 9px; font-weight: 800; color: var(--text-secondary); background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color); position: absolute; top: -10px; }

        .er-row-connector { height: 40px; width: 100%; position: relative; }
        .line-v { width: 1px; height: 100%; background: rgba(255,255,255,0.1); position: absolute; left: calc(50% - 260px); }
        .line-v.right { left: calc(50% + 260px); }
        .line-v.centered { left: 50%; }

        .tech-items { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }
        .tech-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 16px; border: 1px solid transparent; transition: all 0.3s; }
        .tech-item:hover { border-color: var(--border-color); background: rgba(255, 255, 255, 0.05); transform: scale(1.02); }
        .tech-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 255, 255, 0.03); display: flex; align-items: center; justify-content: center; color: var(--accent-color); }
        .tech-info { display: flex; flex-direction: column; }
        .tech-name { font-size: 0.625rem; text-transform: uppercase; font-weight: 800; color: var(--text-secondary); letter-spacing: 0.5px; }
        .tech-val { font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); }

        .quick-metrics { margin-top: 24px; }
        .quick-metrics h3 { margin-bottom: 24px; }
        .pulse-metric { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
        .pulse-metric:last-child { border: none; }
        .pulse-label { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }
        .pulse-val { font-size: 0.875rem; font-weight: 800; color: var(--text-primary); }
      `}} />

    </div>
  );
}

export default Dashboard;
