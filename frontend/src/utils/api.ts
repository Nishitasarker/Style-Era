const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  email: string;
  ageGroup: 'child' | 'young' | 'old';
  stylePreferences: string[];
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  category: 'child' | 'young' | 'old';
  price: number;
  imageUrl: string;
  tags: string[];
  styleAttributes?: {
    color?: string;
    material?: string;
    vibe?: string;
  };
  createdBy?: string;
  createdAt?: string;
}

export interface AIAdviceResponse {
  advice: string;
  recommendedItemIds: string[];
  styleTip: string;
}

export interface AIRecommendationResponse {
  theme: string;
  intro: string;
  recommendedIds: string[];
  reasonings: Record<string, string>;
}

// Client fetch helper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('style_era_token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Auth API
  register: (body: any) => request<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  
  login: (body: any) => request<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  
  getCurrentUser: () => request<{ user: User }>('/auth/me'),

  // Items API
  getItems: (params?: { category?: string; search?: string }) => {
    let url = '/items';
    const queryParts: string[] = [];
    if (params?.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (queryParts.length > 0) url += `?${queryParts.join('&')}`;
    return request<Item[]>(url);
  },

  getItemById: (id: string) => request<Item>(`/items/${id}`),
  
  addItem: (body: any) => request<Item>('/items', {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  
  updateItem: (id: string, body: any) => request<Item>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  }),
  
  deleteItem: (id: string) => request<{ message: string }>(`/items/${id}`, {
    method: 'DELETE'
  }),

  // AI API
  getStyleAdvice: (message: string, history: any[] = []) => request<AIAdviceResponse>('/ai/advisor', {
    method: 'POST',
    body: JSON.stringify({ message, history })
  }),
  
  getSmartRecommendations: () => request<AIRecommendationResponse>('/ai/recommend')
};
