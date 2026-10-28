const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('krishi_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth & Profiles
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (data: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getProfiles: () => request<any[]>('/auth/profiles'),
  createProfile: (data: any) => request<any>('/auth/profiles', { method: 'POST', body: JSON.stringify(data) }),
  switchProfile: (id: number) => request<any>(`/auth/profiles/${id}/switch`, { method: 'POST' }),

  // Crops
  getCrops: () => request<any[]>('/crops'),
  addCrop: (data: any) => request<any>('/crops', { method: 'POST', body: JSON.stringify(data) }),
  updateCrop: (id: number, data: any) => request<any>(`/crops/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCrop: (id: number) => request<any>(`/crops/${id}`, { method: 'DELETE' }),

  // Disease Detection
  analyzeDisease: async (cropName: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('crop_name', cropName);
    formData.append('file', file);

    const headers: Record<string, string> = {
      ...getAuthHeader()
    };

    const response = await fetch(`${API_BASE}/disease/analyze`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ detail: 'Failed to analyze crop image' }));
      throw new Error(errorJson.detail || 'Analysis error');
    }
    return response.json();
  },
  getDiseaseHistory: () => request<any[]>('/disease/history'),

  // Pesticides
  getPesticides: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return request<any[]>(`/pesticides${q ? `?${q}` : ''}`);
  },
  getPesticideDetail: (id: number) => request<any>(`/pesticides/${id}`),

  // Organic Alternatives
  getOrganicAlternatives: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return request<any[]>(`/organic${q ? `?${q}` : ''}`);
  },
  getOrganicDetail: (id: number) => request<any>(`/organic/${id}`),

  // Comparison
  getComparisons: (crop?: string, pest?: string) => {
    const params = new URLSearchParams();
    if (crop) params.append('crop', crop);
    if (pest) params.append('pest', pest);
    const q = params.toString();
    return request<any[]>(`/comparison${q ? `?${q}` : ''}`);
  },

  // Weather
  getWeather: (district: string = 'Bengaluru Rural') =>
    request<any>(`/weather?district=${encodeURIComponent(district)}`),

  // Regional
  getRegionalAdvisories: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return request<any[]>(`/regional${q ? `?${q}` : ''}`);
  },

  // Chat AI Assistant
  askAssistant: (message: string, sessionId: string = 'default-session', language: string = 'en') =>
    request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sessionId, language })
    }),
  getChatHistory: (sessionId: string = 'default-session') =>
    request<any[]>(`/chat/history?session_id=${encodeURIComponent(sessionId)}`),

  // Activities
  getActivities: (crop?: string, isOrganic?: boolean) => {
    const params = new URLSearchParams();
    if (crop) params.append('crop', crop);
    if (isOrganic !== undefined) params.append('is_organic', String(isOrganic));
    const q = params.toString();
    return request<any[]>(`/activities${q ? `?${q}` : ''}`);
  },
  logActivity: (data: any) => request<any>('/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id: number, data: any) => request<any>(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id: number) => request<any>(`/activities/${id}`, { method: 'DELETE' }),

  // Education Hub
  getArticles: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const q = params.toString();
    return request<any[]>(`/education${q ? `?${q}` : ''}`);
  },
  getArticleDetail: (id: number) => request<any>(`/education/${id}`),

  // Notifications
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: number) => request<any>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'POST' }),

  // Dashboard Summary
  getDashboard: () => request<any>('/dashboard')
};
