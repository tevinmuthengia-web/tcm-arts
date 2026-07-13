// frontend/src/utils/api.js

const API_BASE = import.meta.env.VITE_API_URL || 'https://tcm-arts-backend.onrender.com';

// Helper function for API requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('tcm_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};

// Auth API
const auth = {
  register: (name, email, password) => 
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  login: (email, password) => 
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  me: async () => {
    const token = localStorage.getItem('tcm_token');
    if (!token) {
      throw new Error('No token found');
    }
    return request('/api/auth/me');
  },
};

// Content API
const content = {
  get: () => request('/api/content'),
  update: (data) => 
    request('/api/content', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Gallery API
const gallery = {
  get: () => request('/api/gallery'),
  add: (formData) => {
    const token = localStorage.getItem('tcm_token');
    return fetch(`${API_BASE}/api/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    });
  },
  edit: (id, formData) => {
    const token = localStorage.getItem('tcm_token');
    return fetch(`${API_BASE}/api/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    });
  },
  delete: (id) => 
    request(`/api/gallery/${id}`, { method: 'DELETE' }),
};

// Classes API
const classes = {
  get: () => request('/api/classes'),
  add: (data) => 
    request('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  edit: (id, data) => 
    request(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => 
    request(`/api/classes/${id}`, { method: 'DELETE' }),
};

// Bookings API
const bookings = {
  create: (classId) => 
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ classId }),
    }),
  getMy: () => request('/api/bookings/my'),
};

// Commissions API
const commissions = {
  create: (data) => 
    request('/api/commissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMy: () => request('/api/commissions/my'),
  getAll: () => request('/api/admin/commissions'),
  updateStatus: (id, status) => 
    request(`/api/admin/commissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Admin API
const admin = {
  getUsers: () => request('/api/admin/users'),
  deleteUser: (userId) => 
    request(`/api/admin/users/${userId}`, { method: 'DELETE' }),
};

export const api = {
  auth,
  content,
  gallery,
  classes,
  bookings,
  commissions,
  admin,
};
