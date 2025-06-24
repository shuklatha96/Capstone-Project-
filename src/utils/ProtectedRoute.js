// src/utils/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) {
    return <Navigate to="/user-login" />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
