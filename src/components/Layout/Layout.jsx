import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

// Layout wraps around every page
// It shows the sidebar on the left and page content on the right
function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle sidebar open/close
  function handleToggle() {
    setCollapsed(!collapsed);
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        {/* Outlet renders the current page based on the route */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
