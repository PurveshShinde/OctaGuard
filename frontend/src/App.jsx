import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ScanDetails from './pages/ScanDetails';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors expand={true} theme="dark" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes (Protected in future, currently open for UI review) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scans/:id" element={<ScanDetails />} />
          <Route path="/new-scan" element={<div className="text-white p-8">New Scan UI Placeholder</div>} />
          <Route path="/vulnerabilities" element={<div className="text-white p-8">Vulnerabilities UI Placeholder</div>} />
          <Route path="/history" element={<div className="text-white p-8">Scan History UI Placeholder</div>} />
          <Route path="/settings" element={<div className="text-white p-8">Settings UI Placeholder</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
