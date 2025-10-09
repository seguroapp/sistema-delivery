import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://delivery-api-zdnu.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API

// Cardápio
export const cardapioAPI = {
  listar: (params = {}) => api.get('/cardapio', { params }),
  buscarPorId: (id) => api.get(`/cardapio/${id}`),
  categorias: () => api.get('/cardapio/categorias'),
  criar: (data) => api.post('/cardapio', data),
  atualizar: (id, data) => api.put(`/cardapio/${id}`, data),
  deletar: (id) => api.delete(`/cardapio/${id}`),
  alterarDisponibilidade: (id, disponivel) => api.patch(`/cardapio/${id}/disponibilidade`, { disponivel }),
};

// Clientes
export const clientesAPI = {
  cadastrar: (data) => api.post('/clientes', data),
  listar: (params = {}) => api.get('/clientes', { params }),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  buscarPorEmail: (email) => api.get(`/clientes/email/${email}`),
  atualizar: (id, data) => api.put(`/clientes/${id}`, data),
  alterarStatus: (id, ativo) => api.patch(`/clientes/${id}/status`, { ativo }),
  deletar: (id) => api.delete(`/clientes/${id}`),
};

// Pedidos
export const pedidosAPI = {
  criar: (data) => api.post('/pedidos', data),
  listar: (params = {}) => api.get('/pedidos', { params }),
  buscarPorId: (id) => api.get(`/pedidos/${id}`),
  buscarPorNumero: (numero) => api.get(`/pedidos/numero/${numero}`),
  listarPendentes: () => api.get('/pedidos/pendentes'),
  atualizarStatus: (id, status, observacao) => api.patch(`/pedidos/${id}/status`, { status, observacao }),
  reenviarWhatsApp: (id) => api.post(`/pedidos/${id}/whatsapp`),
  estatisticas: () => api.get('/pedidos/stats/dashboard'),
};

// Autenticação
export const authAPI = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  register: (nome, email, senha) => api.post('/auth/register', { nome, email, senha }),
  me: () => api.get('/auth/me'),
  alterarSenha: (senhaAtual, novaSenha) => api.patch('/auth/alterar-senha', { senhaAtual, novaSenha }),
  criarAdmin: (nome, email, senha) => api.post('/auth/criar-admin', { nome, email, senha }),
  listarAdmins: () => api.get('/auth/admins'),
  alterarStatusAdmin: (id, ativo) => api.patch(`/auth/admins/${id}/status`, { ativo }),
};

// Utilitários
export const utilsAPI = {
  health: () => api.get('/health'),
};

// Funções auxiliares
export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const formatarTelefone = (telefone) => {
  const numero = telefone.replace(/\D/g, '');
  if (numero.length === 11) {
    return numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numero.length === 10) {
    return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

export const formatarCEP = (cep) => {
  const numero = cep.replace(/\D/g, '');
  return numero.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefone = (telefone) => {
  const numero = telefone.replace(/\D/g, '');
  return numero.length >= 10 && numero.length <= 11;
};

export const validarCEP = (cep) => {
  const numero = cep.replace(/\D/g, '');
  return numero.length === 8;
};

export default api;