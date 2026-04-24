const API_URL = 'http://localhost:8000';

export const authApi = {
  login: async (identifier: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', identifier);
    formData.append('password', password);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!response.ok) throw new Error('Identifiant ou mot de passe incorrect');
    return response.json();
  }
};

export const usersApi = {
  register: async (payload: any) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        full_name: payload.fullName, 
        email: payload.email,
        password: payload.password,
        is_admin: payload.role === 'Autorité Locale'
      }),
    });
    if (!response.ok) throw new Error('Erreur lors de la création du compte');
    return response.json();
  },
  checkEmail: async (email: string) => {
    const response = await fetch(`${API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
    return response.json();
  },
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/users/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  update: async (userId: number, payload: any, token: string) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  }
};

export const vendeursApi = {
  login: async (identifiantNational: string) => {
    const response = await fetch(`${API_URL}/vendeurs/by-identifiant/${encodeURIComponent(identifiantNational)}`);
    return response.json();
  },
  search: async (query: string) => {
    const response = await fetch(`${API_URL}/vendeurs/search/${encodeURIComponent(query)}`);
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_URL}/vendeurs/`);
    return response.json();
  },
  update: async (vendeurId: number, payload: any, token: string) => {
    const response = await fetch(`${API_URL}/vendeurs/${vendeurId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  }
};

export const taxesApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/taxes/`);
    return response.json();
  },
  create: async (payload: any) => {
    const response = await fetch(`${API_URL}/taxes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  update: async (taxId: number, payload: any, token: string) => {
    const response = await fetch(`${API_URL}/taxes/${taxId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  }
};

export const paiementsApi = {
  create: async (payload: any, token: string) => {
    const response = await fetch(`${API_URL}/paiements/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  getByVendeur: async (vendeurId: number) => {
    const response = await fetch(`${API_URL}/paiements/vendeur/${vendeurId}`);
    return response.json();
  }
};

export const signalementsApi = {
  create: async (payload: any, token: string) => {
    const response = await fetch(`${API_URL}/signalements/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_URL}/signalements/`);
    return response.json();
  },
  update: async (sigId: number, payload: any, token: string) => {
    const response = await fetch(`${API_URL}/signalements/${sigId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  }
};

export const notificationsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/notifications/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  markAsRead: async (notifId: number, token: string) => {
    const response = await fetch(`${API_URL}/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

export const statsApi = {
  getDashboard: async () => {
    const response = await fetch(`${API_URL}/stats/dashboard`);
    return response.json();
  }
};
