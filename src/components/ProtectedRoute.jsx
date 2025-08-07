import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth'; // Import Firebase auth

const ProtectedRoute = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Check Firebase's current user

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the child route
  return <Outlet />;
};

export default ProtectedRoute;