import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  Truck, 
  UserSquare2, 
  AlertCircle, 
  Layers,
  ChevronRight,
  LogOut,
  Search,
  Bell
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Products from './pages/Products';
import Materials from './pages/Materials';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Defects from './pages/Defects';

const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`sidebar-link ${isActive ? 'active' : ''}`}
    >
      <Icon size={20} className="nav-icon" />
      <span>{label}</span>
      {isActive && <ChevronRight size={16} className="active-chevron" />}
    </Link>
  );
};

function App() {
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'dashboard';

  return (
    <div className="layout">
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="logo-icon">C</div>
          <div className="brand-info">
            <h1>CMS PRO</h1>
            <span className="brand-tag">v1.0.2</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-label">Main</div>
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/departments" icon={Building2} label="Departments" />
          <SidebarLink to="/employees" icon={Users} label="Employees" />
          
          <div className="nav-label mt-6">Inventory</div>
          <SidebarLink to="/products" icon={Package} label="Products" />
          <SidebarLink to="/materials" icon={Layers} label="Materials" />
          <SidebarLink to="/defects" icon={AlertCircle} label="Defects" />
          
          <div className="nav-label mt-6">Partners</div>
          <SidebarLink to="/customers" icon={UserSquare2} label="Customers" />
          <SidebarLink to="/suppliers" icon={Truck} label="Suppliers" />
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="top-bar glass">
          <div className="top-bar-left">
            <span className="current-path">{currentPath}</span>
          </div>
          
          <div className="top-bar-center">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Quick search..." />
            </div>
          </div>

          <div className="top-bar-right">
            <button className="icon-btn-round"><Bell size={20} /></button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-status">Online</span>
              </div>
              <div className="user-avatar">A</div>
            </div>
          </div>
        </header>

        <div className="page-container animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/products" element={<Products />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/defects" element={<Defects />} />
          </Routes>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }
        .sidebar {
          width: 270px;
          height: 100%;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          z-index: 10;
          border-radius: 0;
          border: none;
          border-right: 1px solid var(--border-color);
          background: var(--sidebar-color);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 40px;
          padding: 0 12px;
        }
        .brand-info h1 {
          font-size: 1.125rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .brand-tag {
          font-size: 0.625rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 700;
        }
        .logo-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }
        .nav-label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          margin-bottom: 8px;
          padding-left: 14px;
          font-weight: 700;
          opacity: 0.5;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          color: var(--text-secondary);
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }
        .sidebar-link.active {
          color: white;
          background: rgba(59, 130, 246, 0.1);
        }
        .active-chevron {
          margin-left: auto;
          opacity: 0.5;
        }
        .mt-6 { margin-top: 24px; }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }
        .logout-btn {
          width: 100%;
          justify-content: flex-start;
          color: var(--error);
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .top-bar {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          margin: 0;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid var(--border-color);
          background: rgba(2, 6, 23, 0.8);
        }
        .current-path {
          text-transform: uppercase;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        .search-bar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 300px;
          color: var(--text-secondary);
        }
        .search-bar input {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.8125rem;
          width: 100%;
        }
        .search-bar input:focus { box-shadow: none; }
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .icon-btn-round {
          width: 42px;
          height: 42px;
          padding: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .user-name { font-weight: 700; font-size: 0.875rem; }
        .user-status { font-size: 0.625rem; color: var(--success); font-weight: 700; }
        .user-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .page-container {
          padding: 40px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
      `}} />
    </div>
  );
}

export default App;
