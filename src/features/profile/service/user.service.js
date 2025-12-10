import { api } from "@/lib/api";


// export const userAPI = {
//   getUser: () => api.get('/api/user'),
//   updateProfile: (userData) => api.put('/api/profile', userData),
//   updatePassword: (passwordData) => api.put('/api/password', passwordData),
//   getMyNotes: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', params.page);
//     if (params.per_page) queryParams.append('per_page', params.per_page);
//     if (params.sort) queryParams.append('sort', params.sort);
//     return api.get(`/api/notes/my-notes?${queryParams.toString()}`);
//   },
//   getMyReactions: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', params.page);
//     if (params.per_page) queryParams.append('per_page', params.per_page);
//     if (params.reaction_type) queryParams.append('reaction_type', params.reaction_type);
//     return api.get(`/api/notes/my-reactions?${queryParams.toString()}`);
//   },
// };

export const getUser = async () => {
    try {
        const response = await api.get('/api/user');
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data pengguna:', error);
        throw error;
    };
};
export const updateProfile = async (userData) => {
    try {
        const response = await api.put('/api/profile', userData);
        return { success: true, data: response.data };
    } catch (error) { 
        const errorMessage = error.response?.data?.message || 'Pembaruan profil gagal. Silakan coba lagi.';
        return { success: false, message: errorMessage };
    };
};
export const updatePassword = async (passwordData) => {
    try {
        const response = await api.put('/api/password', passwordData);
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Pembaruan kata sandi gagal. Silakan coba lagi.';
        return { success: false, message: errorMessage };
    };
};