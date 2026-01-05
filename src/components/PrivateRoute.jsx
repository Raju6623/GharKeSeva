import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Checks if the user is authenticated
const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    // Redirect to Login page if user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Render the requested component if authenticated
    return children;
};

export default PrivateRoute;
