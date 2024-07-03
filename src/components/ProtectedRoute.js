import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UploadPhoto from './UploadPhoto';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Update isAuthenticated based on user presence
    });

    return () => unsubscribe(); // Cleanup function
  }, [auth]);

  if (isAuthenticated === null) {
    // Optionally, you can return a loading spinner or similar while authentication state is being determined
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <UploadPhoto /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
