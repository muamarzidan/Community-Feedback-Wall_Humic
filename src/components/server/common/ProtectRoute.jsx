import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext.jsx';


export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    };
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};
export const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    };

    return !isAuthenticated ? children : <Navigate to="/" />;
};