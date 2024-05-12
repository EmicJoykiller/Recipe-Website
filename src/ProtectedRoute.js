import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  // Check if `user` is not null or undefined
  if (!user) {
    // Redirect to the login page if there's no user
    return <Navigate to="/auth" replace />;
  }

  // If there's a user, render the children components
  return children;
}
