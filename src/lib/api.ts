class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `http://localhost:3000/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
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
  getGeneral: (locale?: string) =>
    apiRequest(`/about/general?locale=${locale || 'en'}`),
  
  getItems: (kind: string, locale?: string) =>
    apiRequest(`/about/items?kind=${kind}&locale=${locale || 'en'}`),
};

// Catalog API
export const catalogApi = {
  getProducts: (params: { page?: number; pageSize?: number; locale?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params.locale) searchParams.set('locale', params.locale);
    
    return apiRequest(`/catalog?${searchParams.toString()}`);
  },
  
  getProduct: (slug: string, locale?: string) =>
    apiRequest(`/catalog/${slug}?locale=${locale || 'en'}`),
};

// Contacts API
export const contactsApi = {
  getContactInfo: (locale?: string) =>
    apiRequest(`/contacts?locale=${locale || 'en'}`),
  
  submitForm: (formData: FormData) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    }),
};

// Admin API
export const adminApi = {
  // About Items
  getAboutItems: (params: { kind?: string; search?: string; page?: number; pageSize?: number } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.kind) searchParams.set('kind', params.kind);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    
    return apiRequest(`/admin/about/items?${searchParams.toString()}`);
  },
  
  createAboutItem: (data: any) =>
    apiRequest('/admin/about/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateAboutItem: (id: string, data: any) =>
    apiRequest(`/admin/about/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteAboutItem: (id: string) =>
    apiRequest(`/admin/about/items/${id}`, {
      method: 'DELETE',
    }),
  
  reorderAboutItems: (items: { id: string; order_index: number }[]) =>
    apiRequest('/admin/about/items/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  
  // Admin Sections
  getAdminSection: (section: string, locale?: string) =>
    apiRequest(`/admin/about/${section}?locale=${locale || 'en'}`),
};

// Upload API
export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/admin/uploads', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },
  
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return apiRequest('/admin/uploads', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },
};