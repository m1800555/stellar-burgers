import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { getUserData, getRequestStatus, isAuthChecked } from '../../services/slices/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyUnauthorized?: boolean;
}

export function ProtectedRoute({ children, onlyUnauthorized }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector(getUserData);
  const requestStatus = useSelector(getRequestStatus);
  const authChecked = useSelector(isAuthChecked);

  if ((!authChecked && user !== null) || requestStatus === 'pending') {
    return <Preloader />;
  }

  if (onlyUnauthorized && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnauthorized && !user) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  return children;
}
