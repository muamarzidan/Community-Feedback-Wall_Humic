import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  getMeCurrentUser: () => api.get('/api/me'),
};

export const passwordResetAPI = {
  // Send verification code to email (Step 1)
  sendResetEmail: (email) => api.post('/api/forgot-password', { email }),
  // Verify OTP code (Step 2)
  verifyResetCode: (email, token) => api.post('/api/verify-reset-code', { email, token }),
  // Reset password with new password (Step 3)
  resetPassword: (data) => api.post('/api/reset-password', data), // { email, token, password, password_confirmation }
};

export const userAPI = {
  getUser: () => api.get('/api/user'),
  updateProfile: (userData) => api.put('/api/profile', userData),
  updatePassword: (passwordData) => api.put('/api/password', passwordData),
  getMyNotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.sort) queryParams.append('sort', params.sort);
    return api.get(`/api/notes/my-notes?${queryParams.toString()}`);
  },
  getMyReactions: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.reaction_type) queryParams.append('reaction_type', params.reaction_type);
    return api.get(`/api/notes/my-reactions?${queryParams.toString()}`);
  },
};
export const canvasNotesAPI = {
  // getCurrentCanvasNotes: () => api.get('/api/canvas/current/notes'),
  getCurrentCanvasNotes: () => api.get('/api/notes/spiral'),
  getCanvasById: (canvasId) => api.get(`/api/canvas/${canvasId}`),
  getCanvasNotesByID: (canvasId) => api.get(`/api/canvas/${canvasId}/notes`),
  createNote: (noteData) => {
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('description', noteData.description);
    formData.append('color', noteData.color);
    formData.append('height', noteData.height || 0);
    if (noteData.email) {
      formData.append('email', noteData.email);
    };
    if (noteData.image instanceof File) {
      formData.append('image', noteData.image);
    };
    
    console.log('API CALL - CREATE NOTE:', {
      title: noteData.title,
      height: noteData.height,
      color: noteData.color,
      hasImage: noteData.image instanceof File,
      timestamp: new Date().toISOString()
    });

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
    formData.append('height', noteData.height || 0);
    
    if (noteData.image instanceof File) {
      formData.append('image', noteData.image);
    }
    if (noteData.delete_image) {
      formData.append('delete_image', noteData.delete_image);
    }
    
    console.log('API CALL - UPDATE NOTE:', {
      noteId: noteId,
      title: noteData.title,
      height: noteData.height,
      color: noteData.color,
      hasNewImage: noteData.image instanceof File,
      deleteImage: noteData.delete_image,
      timestamp: new Date().toISOString()
    });
    
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
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.from_date) queryParams.append('from_date', params.from_date);
    if (params.to_date) queryParams.append('to_date', params.to_date);
    
    return api.get(`/api/notes/filter?${queryParams.toString()}`);
  },
  toggleReaction: (noteId, reactionType) => 
    api.post(`/api/notes/${noteId}/reaction`, { reaction_type: reactionType }),
};
export const adminApi = {
  getDataExcel: () => api.get('/api/notes/export/csv', { 
    responseType: 'text'
  }),
};
export default api;