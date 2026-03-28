import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLabel } from '../utils/format';
import {
  Bars3Icon,
  XMarkIcon,
  HomeModernIcon,
  UserGroupIcon,
  UserIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(formatLabel(location.pathname.split('/')[1] || 'Dashboard'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeModernIcon className="h-5 w-5" /> },
    { name: 'Players', href: '/players', icon: <UserIcon className="h-5 w-5" /> },
    { name: 'Teams', href: '/teams', icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: 'Matches', href: '/matches', icon: <CalendarDaysIcon className="h-5 w-5" /> },
    { name: 'Tournaments', href: '/tournaments', icon: <TrophyIcon className="h-5 w-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
    { name: 'Settings', href: '/settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ];

  const isTournamentActive = location.pathname.startsWith('/tournaments');

  return (
    <div className="min-h-screen text-[color:var(--text)] bg-[radial-gradient(1200px_circle_at_15%_-10%,_rgba(15,118,110,0.10),_transparent_55%),radial-gradient(900px_circle_at_100%_0%,_rgba(245,158,11,0.12),_transparent_55%)]">
      {/* Sidebar (Desktop) */}
      <div className={"hidden md:flex md:flex-col fixed h-full border-r border-[color:var(--border)] bg-white/90 backdrop-blur z-10 transition-all duration-200 " + (sidebarCollapsed ? "md:w-20" : "md:w-64")}>
        {/* Logo */}
        <div className="flex items-center h-20 px-6 border-b border-[color:var(--border)] justify-between">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'max-w-[2.25rem]' : ''}`}>
            <div className="h-9 w-9 rounded-xl bg-[color:var(--accent-2)] flex items-center justify-center shadow-sm border border-[color:var(--border)]">
              <TrophyIcon className="h-5 w-5 text-[color:var(--accent)]" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-[color:var(--text)] whitespace-nowrap truncate">Cricket Manager</h1>
                <p className="text-xs text-[color:var(--muted)] whitespace-nowrap">Control room</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors duration-200 ml-4"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setActiveItem(item.name)}
                title={item.name}
                className={`flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200 border ${sidebarCollapsed ? 'px-3 justify-center' : 'px-4'} ${activeItem === item.name
                  ? 'bg-[color:var(--accent-2)] text-[color:var(--text)] border-[color:var(--border)]'
                  : 'text-[color:var(--muted)] border-transparent hover:bg-white hover:border-[color:var(--border)]'
                  }`}
              >
                <span className={`${activeItem === item.name ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)]'} ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && item.name}
                {activeItem === item.name && (
                  <span className={`h-2 w-2 rounded-full bg-[color:var(--accent)] ${sidebarCollapsed ? 'ml-0' : 'ml-auto'}`}></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[color:var(--border)]">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 rounded-full bg-[color:var(--accent-2)] flex items-center justify-center text-[color:var(--text)] font-medium shadow-inner border border-[color:var(--border)]">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-[color:var(--text)]">{user?.username}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-xs text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors duration-150 mt-1"
                >
                  <ArrowLeftOnRectangleIcon className="h-3.5 w-3.5 mr-1" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex flex-col w-80 max-w-xs h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between h-20 px-6 border-b border-[color:var(--border)]">
              <div className="flex items-center">
                <TrophyIcon className="h-6 w-6 text-[color:var(--accent)] mr-2" />
                <h1 className="text-xl font-bold text-[color:var(--text)]">Cricket Manager</h1>
              </div>
              <button
                type="button"
                className="rounded-md text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setActiveItem(item.name);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border ${activeItem === item.name
                      ? 'bg-[color:var(--accent-2)] text-[color:var(--text)] border-[color:var(--border)]'
                      : 'text-[color:var(--muted)] border-transparent hover:bg-white hover:border-[color:var(--border)]'
                      }`}
                  >
                    <span className={`mr-3 ${activeItem === item.name ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)]'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                    {activeItem === item.name && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-[color:var(--border)]">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-[color:var(--accent-2)] flex items-center justify-center text-[color:var(--text)] font-medium shadow-inner border border-[color:var(--border)]">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[color:var(--text)]">{user?.username}</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-xs text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors duration-150 mt-1"
                  >
                    <ArrowLeftOnRectangleIcon className="h-3.5 w-3.5 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={"flex flex-col flex-1 transition-all duration-200 " + (sidebarCollapsed ? "md:pl-[5rem]" : "md:pl-[16rem]")}>
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur border-b border-[color:var(--border)]">
          <button
            type="button"
            className="px-4 border-r border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--text)] focus:outline-none transition-colors duration-200 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--text)]">{activeItem}</h2>
              <p className="text-xs text-[color:var(--muted)]">Manage your cricket operations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--accent-2)] text-[color:var(--text)] text-xs border border-[color:var(--border)]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)] animate-pulse"></span>
                <span className="font-medium">Live Center</span>
              </div>
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-2)] text-[color:var(--text)] text-xs border border-[color:var(--border)]">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors duration-200"
                title="Sign out"
                aria-label="Sign out"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white/95 rounded-2xl border border-[color:var(--border)] shadow-sm p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
