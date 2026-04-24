import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AppLayout from './ui/AppLayout';
import Collecte from './pages/Collecte';
import Vendeurs from './pages/Vendeurs';
import Taxes from './pages/Taxes';
import Signalements from './pages/Signalements';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected/Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/taxes" element={<Taxes />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'agent']} />}>
              <Route path="/collecte" element={<Collecte />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'vendeur']} />}>
              <Route path="/vendeurs" element={<Vendeurs />} />
              <Route path="/signalements" element={<Signalements />} />
            </Route>
            
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
