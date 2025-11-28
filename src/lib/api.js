import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://humic.xtrahera.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_community-feedback');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token_community-feedback');
      localStorage.removeItem('user-data_community-feedback');
      
      // Redirect to login page only if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/login', credentials),
  register: (userData) => api.post('/api/register', userData),
  logout: () => api.post('/api/logout'),
  getCurrentUser: () => api.get('/api/me'),
};
export const userAPI = {
  getUser: () => api.get('/api/user'),
  updateProfile: (userData) => api.put('/api/profile', userData),
  updatePassword: (passwordData) => api.put('/api/password', passwordData),
};
export const canvasNotesAPI = {
  getCanvasNotes: (canvasId = 1) => api.get(`/api/canvas/${canvasId}/notes`),
  getNoteById: (noteId) => api.get(`/api/notes/${noteId}`),
  createNote: (noteData) => {
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('description', noteData.description);
    formData.append('color', noteData.color);
    // Email wajib untuk guest (tidak terautentikasi)
    if (noteData.email) {
      formData.append('email', noteData.email);
    };
    // Image hanya untuk authenticated users
    if (noteData.image instanceof File) {
      formData.append('image', noteData.image);
    };

    return api.post('/api/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateNote: (noteId, noteData) => {
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('description', noteData.description);
    formData.append('color', noteData.color);
    
    if (noteData.image instanceof File) {
      formData.append('image', noteData.image);
    }
    if (noteData.delete_image) {
      formData.append('delete_image', noteData.delete_image);
    }
    
    return api.put(`/api/notes/${noteId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteNote: (noteId) => api.delete(`/api/notes/${noteId}`),
  toggleReaction: (noteId, reactionType) => 
    api.post(`/api/notes/${noteId}/reaction`, { reaction_type: reactionType }),
};
export const listNotesAPI = {
  getAllNotes: () => api.get('/api/notes'),
  getFilteredNotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.filter) queryParams.append('filter', params.filter); // 'top_like' or 'newest'
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.from_date) queryParams.append('from_date', params.from_date);
    if (params.to_date) queryParams.append('to_date', params.to_date);
    
    return api.get(`/api/notes/filter?${queryParams.toString()}`);
  },
  getNoteById: (noteId) => api.get(`/api/notes/${noteId}`),
};

export default api;