import { api } from "@/lib/api";


export const login = async (credentials) => {
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
    };
};
export const register = async (userData) => {
    try {
        const response = await api.post('/api/register', userData);
        const { token, user } = response.data;
        
        localStorage.setItem('token_community-feedback', token);
        localStorage.setItem('user-data_community-feedback', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
        return { success: false, message: errorMessage };
    };
}; 
export const logout = async () => {
    try {
        await api.post('/api/logout');
        localStorage.removeItem('token_community-feedback');
        localStorage.removeItem('user-data_community-feedback');
        setUser(null);
        navigate('/login');
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Logout gagal. Silakan coba lagi.';
        console.error('Logout error:', errorMessage);
    };
};
export const getCurrentUser = async () => {
    try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
        localStorage.setItem('user-data_community-feedback', JSON.stringify(response.data.user));
    } catch (error) {
        localStorage.removeItem('token_community-feedback');
        localStorage.removeItem('user-data_community-feedback');
        setUser(null);
    };
};