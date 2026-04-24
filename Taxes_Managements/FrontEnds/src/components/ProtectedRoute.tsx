import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'agent' | 'vendeur')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role } = useAppSelector((state) => state.auth);

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their default page if role not authorized for this specific route
    const defaultPath = role === 'vendeur' ? '/vendeurs' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}
