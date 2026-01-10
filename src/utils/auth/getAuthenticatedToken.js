export const isTokenAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
};