export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user-data_community-feedback');
    return userStr ? JSON.parse(userStr) : null;
};