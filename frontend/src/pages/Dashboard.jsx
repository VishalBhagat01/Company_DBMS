import { useState, useEffect } from 'react';
import { Users, Package, AlertCircle, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

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

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    pendingDefects: 0
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
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div className="title-section">
          <h2 className="page-title">Operational Intel</h2>
          <p className="page-subtitle">Real-time metrics and system health monitoring</p>
        </div>
        <div className="header-actions">
          <button className="secondary icon-btn-centered"><Activity size={20} /> System Status: Optimal</button>
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
        <div className="glass promo-card alternate-card">
           <div className="promo-content">
              <h3>Database Integration</h3>
              <p>Connected to Supabase PostgreSQL Cluster v15.4</p>
           </div>
           <ArrowUpRight size={28} className="promo-icon" />
        </div>
      </div>

      <div className="dashboard-overview-grid">
        <div className="glass section-card welcome-hero">
           <div className="hero-text">
              <h1>Welcome, Administrator</h1>
              <p>Your company management system is tracking <strong>{stats.totalProducts + stats.totalEmployees}</strong> total entities. There are currently <strong>{stats.pendingDefects}</strong> pending defects requiring your immediate attention.</p>
              <div className="hero-actions">
                 <button className="primary">Execute Review</button>
                 <button className="secondary">Generate Report</button>
              </div>
           </div>
           <div className="hero-graphic">
              <TrendingUp size={120} />
           </div>
        </div>

        <div className="glass section-card quick-actions">
           <h3>Quick Action Hub</h3>
           <div className="actions-stack">
              <div className="action-item">
                 <div className="action-bullet blue"></div>
                 <span>Sync Database Cache</span>
              </div>
              <div className="action-item">
                 <div className="action-bullet green"></div>
                 <span>Backup System Logs</span>
              </div>
              <div className="action-item">
                 <div className="action-bullet red"></div>
                 <span>Clear Temp Folders</span>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .page-subtitle { color: var(--text-secondary); margin-top: -24px; font-weight: 500; font-size: 0.875rem; }
        
        .stats-grid-premium { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card-premium { padding: 32px; border-radius: 20px; border: 1px solid var(--border-color); }
        .stat-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .stat-icon-wrapper { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
        .stat-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #34d399; border-radius: 999px; font-size: 0.75rem; font-weight: 800; }
        .stat-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; color: var(--text-secondary); margin: 0; }
        .stat-value { font-size: 2.5rem; font-weight: 800; margin: 4px 0 0 0; color: var(--text-primary); }
        .stat-progress-bg { width: 100%; height: 4px; background: rgba(255, 255, 255, 0.03); border-radius: 2px; margin-top: 16px; overflow: hidden; }
        .stat-progress-fill { height: 100%; border-radius: 2px; }

        .alternate-card { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent); display: flex; align-items: center; justify-content: space-between; padding: 32px; border-radius: 20px; text-decoration: none; }
        .promo-content h3 { margin: 0; font-size: 1.125rem; font-weight: 800; }
        .promo-content p { margin: 4px 0 0 0; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
        .promo-icon { color: var(--accent-color); opacity: 0.6; }

        .dashboard-overview-grid { display: grid; grid-template-columns: 2.5fr 1fr; gap: 32px; }
        .welcome-hero { padding: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; position: relative; }
        .hero-text h1 { font-size: 2.25rem; font-weight: 900; margin-top: 0; line-height: 1.1; letter-spacing: -0.02em; }
        .hero-text p { color: var(--text-secondary); max-width: 500px; line-height: 1.6; margin: 16px 0 32px; font-size: 1rem; }
        .hero-text strong { color: var(--text-primary); font-weight: 800; }
        .hero-actions { display: flex; gap: 16px; }
        .hero-graphic { color: var(--accent-color); opacity: 0.08; transform: rotate(-5deg); pointer-events: none; }

        .quick-actions h3 { font-size: 1.125rem; font-weight: 800; margin-top: 0; margin-bottom: 24px; color: var(--text-primary); }
        .actions-stack { display: flex; flex-direction: column; gap: 12px; }
        .action-item { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; background: rgba(255, 255, 255, 0.02); font-size: 0.875rem; font-weight: 700; color: var(--text-secondary); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; border: 1px solid transparent; }
        .action-item:hover { color: var(--text-primary); background: rgba(255, 255, 255, 0.05); transform: translateX(8px); border-color: var(--border-color); }
        .action-bullet { width: 8px; height: 8px; border-radius: 50%; }
        .action-bullet.blue { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .action-bullet.green { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .action-bullet.red { background: #ef4444; box-shadow: 0 0 10px #ef4444; }
      `}} />
    </div>
  );
}

export default Dashboard;
