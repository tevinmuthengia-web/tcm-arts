const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // Configurable via Vite env var in production

// Helper to set headers
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('tcm_token');
  const headers = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic request wrapper
const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(options.body instanceof FormData),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text };
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const api = {
  // 1. AUTHENTICATION APIs
  auth: {
    register: async (name, email, password) => {
      const data = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      if (data.token) {
        localStorage.setItem('tcm_token', data.token);
        localStorage.setItem('tcm_user', JSON.stringify(data.user));
      }
      return data;
    },

    login: async (email, password) => {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        localStorage.setItem('tcm_token', data.token);
        localStorage.setItem('tcm_user', JSON.stringify(data.user));
      }
      return data;
    },

    logout: () => {
      localStorage.removeItem('tcm_token');
      localStorage.removeItem('tcm_user');
    },

    getCurrentUser: async () => {
      const token = localStorage.getItem('tcm_token');
      if (!token) return null;
      try {
        const data = await request('/api/auth/me');
        localStorage.setItem('tcm_user', JSON.stringify(data.user));
        return data.user;
      } catch (err) {
        localStorage.removeItem('tcm_token');
        localStorage.removeItem('tcm_user');
        return null;
      }
    },
  },

  // 2. DYNAMIC CONTENT & CMS APIs
  content: {
    get: () => request('/api/content'),
    update: (contentData) => request('/api/content', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    }),
  },

  // 3. ART GALLERY APIs
  gallery: {
    get: () => request('/api/gallery'),
    add: (formData) => request('/api/gallery', {
      method: 'POST',
      body: formData, // FormData containing details and file
    }),
    edit: (id, formData) => request(`/api/gallery/${id}`, {
      method: 'PUT',
      body: formData, // FormData for potential image edit
    }),
    delete: (id) => request(`/api/gallery/${id}`, {
      method: 'DELETE',
    }),
  },

  // 4. CLASSES & BOOKINGS APIs
  classes: {
    get: () => request('/api/classes'),
    add: (classData) => request('/api/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),
    edit: (id, classData) => request(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),
    delete: (id) => request(`/api/classes/${id}`, {
      method: 'DELETE',
    }),
  },

  bookings: {
    create: (classId) => request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ classId }),
    }),
    getMy: () => request('/api/bookings/my'),
  },

  commissions: {
    create: (commissionData) => request('/api/commissions', {
      method: 'POST',
      body: JSON.stringify(commissionData),
    }),
    getMy: () => request('/api/commissions/my'),
    getAll: () => request('/api/admin/commissions'),
    updateStatus: (id, status) => request(`/api/admin/commissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  },

  // 5. USER VIEWER (Admin only)
  admin: {
    getUsers: () => request('/api/admin/users'),
  },
};
