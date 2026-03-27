import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineChartPie,
  HiOutlineCreditCard,
  HiOutlinePlusCircle,
  HiOutlineBanknotes,
  HiOutlinePresentationChartBar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';

// All the navigation links for our sidebar
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineChartPie },
  { to: '/transactions', label: 'Transactions', icon: HiOutlineCreditCard },
  { to: '/transactions/new', label: 'Add Transaction', icon: HiOutlinePlusCircle },
  { to: '/budget', label: 'Budget', icon: HiOutlineBanknotes },
  { to: '/analytics', label: 'Analytics', icon: HiOutlinePresentationChartBar },
];

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* App Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">F</div>
        <div className="sidebar-logo-text">
          Fin<span>Track</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/transactions'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-link-icon">
                <Icon />
              </span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse / Expand Button */}
      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
      </button>
    </aside>
  );
}

export default Sidebar;
