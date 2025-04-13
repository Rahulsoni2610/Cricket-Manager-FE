import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeModernIcon className="h-5 w-5" /> },
    { name: 'Teams', href: '/teams', icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: 'Players', href: '/players', icon: <UserIcon className="h-5 w-5" /> },
    { name: 'Matches', href: '/matches', icon: <CalendarDaysIcon className="h-5 w-5" /> },
    { name: 'Tournaments', href: '/tournaments', icon: <TrophyIcon className="h-5 w-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
    { name: 'Settings', href: '/settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed h-full border-r border-gray-200 bg-white shadow-sm z-10">
        {/* Logo */}
        <div className="flex items-center h-20 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <TrophyIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Cricket Manager</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeItem === item.name
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <span className={`mr-3 ${activeItem === item.name ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                  {item.icon}
                </span>
                {item.name}
                {activeItem === item.name && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium shadow-inner">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <button
                onClick={handleLogout}
                className="flex items-center text-xs text-gray-500 hover:text-indigo-600 transition-colors duration-150 mt-1"
              >
                <ArrowLeftOnRectangleIcon className="h-3.5 w-3.5 mr-1" />
                Sign out
              </button>
            </div>
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
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
              <div className="flex items-center">
                <TrophyIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-800">Cricket Manager</h1>
              </div>
              <button
                type="button"
                className="rounded-md text-gray-500 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setActiveItem(item.name);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeItem === item.name
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className={`mr-3 ${activeItem === item.name ? 'text-indigo-600' : 'text-gray-500'
                      }`}>
                      {item.icon}
                    </span>
                    {item.name}
                    {activeItem === item.name && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium shadow-inner">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-xs text-gray-500 hover:text-indigo-600 transition-colors duration-150 mt-1"
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
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 hover:text-gray-600 focus:outline-none transition-colors duration-200 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">{activeItem}</h2>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}