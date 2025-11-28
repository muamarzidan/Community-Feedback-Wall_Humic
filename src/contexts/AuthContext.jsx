import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authAPI } from '../lib/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token_community-feedback');
        const savedUser = localStorage.getItem('user-data_community-feedback');
        
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                authAPI.getCurrentUser()
                    .then(response => {
                        setUser(response.data.user);
                        localStorage.setItem('user-data_community-feedback', JSON.stringify(response.data.user));
                    })
                    .catch(() => {
                        localStorage.removeItem('token_community-feedback');
                        localStorage.removeItem('user-data_community-feedback');
                        setUser(null);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } catch (error) {
                localStorage.removeItem('user-data_community-feedback');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token_community-feedback', token);
            localStorage.setItem('user-data_community-feedback', JSON.stringify(user));
            setUser(user);
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
            return { success: false, message: errorMessage };
        }
    };
    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data;
            
            localStorage.setItem('token_community-feedback', token);
            localStorage.setItem('user-data_community-feedback', JSON.stringify(user));
            setUser(user);
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
            return { success: false, message: errorMessage };
        }
    };
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token_community-feedback');
            localStorage.removeItem('user-data_community-feedback');
            setUser(null);
            navigate('/login');
        }
    };
    const updateUserData = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user-data_community-feedback', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    };

    return context;
};