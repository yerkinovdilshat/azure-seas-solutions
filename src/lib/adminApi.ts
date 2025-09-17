const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

class AdminApi {
  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async me() {
    return this.request('/auth/me');
  }

  // Site Settings
  async getSiteSettings() {
    return this.request('/admin/site-settings');
  }

  async saveSiteSettings(data: any) {
    return this.request('/admin/site-settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // About Items
  async listAbout(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/about/items?${query}`);
  }

  async createAbout(data: any) {
    return this.request('/admin/about/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAbout(id: string, data: any) {
    return this.request(`/admin/about/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAbout(id: string) {
    return this.request(`/admin/about/items/${id}`, {
      method: 'DELETE',
    });
  }

  // News
  async listNews(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/news?${query}`);
  }

  async createNews(data: any) {
    return this.request('/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNews(id: string, data: any) {
    return this.request(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNews(id: string) {
    return this.request(`/admin/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async listProjects(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/projects?${query}`);
  }

  async createProject(data: any) {
    return this.request('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/admin/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Services
  async listServices(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/services?${query}`);
  }

  async createService(data: any) {
    return this.request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/admin/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminApi = new AdminApi();