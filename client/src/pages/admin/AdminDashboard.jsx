import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  FilmIcon,
  UserIcon,
  TicketIcon,
  HomeIcon,
  BluetoothIcon as Cog6ToothIcon,
  LogOut
} from 'lucide-react';
import useAuth from '../../context/useAuth';
import AdminHome from './AdminHome';
import AdminMovies from './AdminMovies';
import AdminBookings from './AdminBookings';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Movies', href: '/admin/movies', icon: FilmIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: TicketIcon },
    { name: 'Users', href: '/admin/users', icon: UserIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 bg-gray-800 transition-all duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 relative">
            <Link to="/admin" className="text-xl font-bold text-white flex items-center whitespace-nowrap overflow-hidden">
              <span className="text-red-500 mr-1">{!collapsed && 'Admin'}</span>
              {!collapsed && <span>Panel</span>}
            </Link>

            {/* Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {collapsed ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="md:ml-64">
        {/* Mobile Header */}
        <div className="bg-gray-800 md:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <button className="text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-bold text-white">Admin Panel</span>
          <div className="w-6"></div>
        </div>

        {/* Page Routes */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/movies" element={<AdminMovies />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
