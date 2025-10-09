// Utilitário para requisições API com interceptors
class ApiClient {
  constructor(baseURL = 'https://delivery-api-zdnu.onrender.com/api') {
    this.baseURL = baseURL;
  }

  // Interceptor para adicionar token automaticamente
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Headers padrão
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Adicionar token apropriado baseado na rota
    if (endpoint.startsWith('/cliente-auth')) {
      const clienteToken = localStorage.getItem('clienteToken');
      if (clienteToken) {
        defaultHeaders.Authorization = `Bearer ${clienteToken}`;
      }
    } else {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        defaultHeaders.Authorization = `Bearer ${adminToken}`;
      }
    }

    // Configurações da requisição
    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Verificar se token expirou
      if (response.status === 401 && data.message?.includes('token')) {
        if (endpoint.startsWith('/cliente-auth')) {
          localStorage.removeItem('clienteToken');
          localStorage.removeItem('clienteData');
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          window.location.href = '/admin/login';
        }
        throw new Error('Sessão expirada');
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      // Tratamento específico de erros
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instância singleton
const apiClient = new ApiClient();

// Métodos específicos da API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },
  getProfile: () => apiClient.get('/auth/profile'),
};

export const pedidosAPI = {
  listar: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/pedidos${query ? `?${query}` : ''}`);
  },
  buscarPendentes: () => apiClient.get('/admin/pedidos/pendentes'),
  atualizarStatus: (id, data) => apiClient.patch(`/admin/pedidos/${id}/status`, data),
  buscarStats: () => apiClient.get('/admin/pedidos/stats/dashboard'),
};

export const cardapioAPI = {
  listar: () => apiClient.get('/cardapio'),
  criar: (item) => apiClient.post('/cardapio', item),
  atualizar: (id, item) => apiClient.put(`/cardapio/${id}`, item),
  deletar: (id) => apiClient.delete(`/cardapio/${id}`),
};

// API para autenticação de clientes
export const clienteAuthAPI = {
  login: (credentials) => apiClient.post('/cliente-auth/login', credentials),
  register: (dados) => apiClient.post('/cliente-auth/register', dados),
  logout: () => {
    localStorage.removeItem('clienteToken');
    localStorage.removeItem('clienteData');
    return apiClient.post('/cliente-auth/logout');
  },
  verificarToken: () => apiClient.get('/cliente-auth/verify'),
  obterPerfil: () => apiClient.get('/cliente-auth/profile'),
  atualizarPerfil: (dados) => apiClient.put('/cliente-auth/profile', dados),
  obterPedidos: () => apiClient.get('/cliente-auth/pedidos'),
};

export default apiClient;