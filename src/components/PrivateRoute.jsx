import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Checks if the user is authenticated
function PrivateRoute({ children }) {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    // Redirect to Login page if user is not authenticated, preserving current location
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render the requested component if authenticated
    return children;
}

export default PrivateRoute;
