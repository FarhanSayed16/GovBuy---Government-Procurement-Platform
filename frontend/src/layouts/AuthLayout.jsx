import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '../features/api/user.api';
import { setCredentials, logout } from '../features/auth/authSlice';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

export default function AuthLayout({
  children,
  authentication = true,
  roles = []
}) {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const { isAuthenticated } = useSelector((s) => s.auth);
  const location = useLocation();

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data));
    }
  }, [data, dispatch]);

  // Protected routes
  if (authentication) {
    if (isLoading) return <Loader fullScreen />;
    if (error || !data?.data) {
      dispatch(logout());
      return (
        <Navigate to="/login" state={{ from: location }} replace />
      );
    }
    // Enforce roles if provided
    if (roles.length > 0 && !roles.includes(data.data.role)) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // Public (login/signup) routes
  if (!authentication && !isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
