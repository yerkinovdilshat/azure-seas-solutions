const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new ApiError(response.status, error.error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),
  
  me: () =>
    apiRequest('/auth/me'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// About API
export const aboutApi = {
  getGeneral: (locale = 'en') =>
    apiRequest(`/about/general?locale=${locale}`),
  
  getItems: (kind: string, locale = 'en') =>
    apiRequest(`/about/items?kind=${kind}&locale=${locale}`),
};

// Catalog API
export const catalogApi = {
  getProducts: (params: { page?: number; pageSize?: number; locale?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.pageSize) query.set('pageSize', params.pageSize.toString());
    if (params.locale) query.set('locale', params.locale);
    
    return apiRequest(`/catalog?${query.toString()}`);
  },
  
  getProduct: (slug: string, locale = 'en') =>
    apiRequest(`/catalog/${slug}?locale=${locale}`),
};

// Contacts API
export const contactsApi = {
  getContactInfo: (locale = 'en') =>
    apiRequest(`/contacts?locale=${locale}`),
  
  submitForm: (formData: FormData) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    }),
};

// Admin API
export const adminApi = {
  aboutItems: {
    list: (params: { kind?: string; search?: string; page?: number; pageSize?: number } = {}) => {
      const query = new URLSearchParams();
      if (params.kind) query.set('kind', params.kind);
      if (params.search) query.set('search', params.search);
      if (params.page) query.set('page', params.page.toString());
      if (params.pageSize) query.set('pageSize', params.pageSize.toString());
      
      return apiRequest(`/admin/about/items?${query.toString()}`);
    },
    
    create: (data: any) =>
      apiRequest('/admin/about/items', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      apiRequest(`/admin/about/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      apiRequest(`/admin/about/items/${id}`, {
        method: 'DELETE',
      }),
    
    reorder: (items: { id: string; order_index: number }[]) =>
      apiRequest('/admin/about/items/reorder', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      }),
  },
  
  getSection: (section: string, locale = 'en') =>
    apiRequest(`/admin/about/${section}?locale=${locale}`),
};

// Upload API
export const uploadApi = {
  single: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/uploads/single', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },
  
  multiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return apiRequest('/uploads/multiple', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },
};