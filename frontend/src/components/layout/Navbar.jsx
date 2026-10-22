import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  Sparkles,
  History,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  FileCheck2,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Job Tracker', path: '/jobs', icon: Briefcase },
    { name: 'CV Management', path: '/cv', icon: FileText },
    { name: 'AI CV Analysis', path: '/ai-analysis', icon: Sparkles, highlight: true },
    { name: 'Analysis History', path: '/ai-history', icon: History },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  Career<span className="text-brand-600">Tech</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                  AI Job Application Tracker
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1 ml-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                        : link.highlight
                        ? 'text-brand-600 hover:bg-brand-50/60 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mr-1.5 ${
                        active
                          ? 'text-brand-600'
                          : link.highlight
                          ? 'text-brand-500'
                          : 'text-slate-400'
                      }`}
                    />
                    {link.name}
                    {link.highlight && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-brand-600 to-indigo-600 text-white tracking-wide uppercase">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side Profile & Logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user?.mainCV ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FileCheck2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Main CV Ready
              </span>
            ) : (
              <Link
                to="/cv"
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
              >
                Upload CV
              </Link>
            )}

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm text-slate-700 hover:text-brand-600 font-medium transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm text-slate-700 font-medium"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>{user?.name} (Profile)</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
