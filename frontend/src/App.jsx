import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';

import DashboardPage from './pages/DashboardPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import CVManagementPage from './pages/CVManagementPage.jsx';
import AIAnalysisPage from './pages/AIAnalysisPage.jsx';
import AIHistoryPage from './pages/AIHistoryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pb-16">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        CareerTech • MERN Stack Edition • AI-Powered Job Application Tracker
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JobsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CVManagementPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-analysis"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AIAnalysisPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AIHistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
