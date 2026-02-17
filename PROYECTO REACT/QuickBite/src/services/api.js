import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};

// Servicios de restaurantes
export const restauranteService = {
  getAll: (page = 0, size = 10) => 
    api.get(`/restaurantes?page=${page}&size=${size}`),
  
  getById: (id) => 
    api.get(`/restaurantes/${id}`),
  
  create: (data) => 
    api.post('/restaurantes', data),
  
  update: (id, data) => 
    api.put(`/restaurantes/${id}`, data),
  
  delete: (id) => 
    api.delete(`/restaurantes/${id}`)
};

// Servicios de categorías
export const categoriaService = {
  getAll: () => 
    api.get('/categorias'),
  
  getById: (id) => 
    api.get(`/categorias/${id}`),
  
  create: (data) => 
    api.post('/categorias', data),
  
  update: (id, data) => 
    api.put(`/categorias/${id}`, data),
  
  delete: (id) => 
    api.delete(`/categorias/${id}`)
};

// Servicios de productos
export const productoService = {
  getAll: (page = 0, size = 10) => 
    api.get(`/productos?page=${page}&size=${size}`),
  
  getById: (id) => 
    api.get(`/productos/${id}`),
  
  create: (data) => 
    api.post('/productos', data),
  
  update: (id, data) => 
    api.put(`/productos/${id}`, data),
  
  delete: (id) => 
    api.delete(`/productos/${id}`),
  
  updateStock: (id, stock) => 
    api.patch(`/productos/${id}/stock?stock=${stock}`),
  
  filtrar: (restauranteId, categoriaId, disponible, page = 0, size = 10) => {
    let url = `/productos/filtrar?page=${page}&size=${size}`;
    if (restauranteId) url += `&restauranteId=${restauranteId}`;
    if (categoriaId) url += `&categoriaId=${categoriaId}`;
    if (disponible !== null) url += `&disponible=${disponible}`;
    return api.get(url);
  }
};

// Servicios de clientes
export const clienteService = {
  getAll: (page = 0, size = 10) => 
    api.get(`/clientes?page=${page}&size=${size}`),
  
  getById: (id) => 
    api.get(`/clientes/${id}`),
  
  getMiPerfil: () => 
    api.get('/clientes/mi-perfil'),
  
  create: (data) => 
    api.post('/clientes', data),
  
  update: (id, data) => 
    api.put(`/clientes/${id}`, data),
  
  delete: (id) => 
    api.delete(`/clientes/${id}`),
  
  buscar: (texto, page = 0, size = 10) => 
    api.get(`/clientes/buscar?texto=${texto}&page=${page}&size=${size}`)
};

// Servicios de repartidores
export const repartidorService = {
  getAll: (page = 0, size = 10) => 
    api.get(`/repartidores?page=${page}&size=${size}`),
  
  getActivos: (page = 0, size = 10) => 
    api.get(`/repartidores/activos?page=${page}&size=${size}`),
  
  getById: (id) => 
    api.get(`/repartidores/${id}`),
  
  create: (data) => 
    api.post('/repartidores', data),
  
  update: (id, data) => 
    api.put(`/repartidores/${id}`, data),
  
  cambiarEstado: (id, activo) => 
    api.patch(`/repartidores/${id}/estado?activo=${activo}`),
  
  delete: (id) => 
    api.delete(`/repartidores/${id}`)
};

// Servicios de pedidos
export const pedidoService = {
  getAll: (page = 0, size = 10) => 
    api.get(`/pedidos?page=${page}&size=${size}`),
  
  getMisPedidos: (page = 0, size = 10) => 
    api.get(`/pedidos/mis-pedidos?page=${page}&size=${size}`),
  
  getSinRepartidor: (page = 0, size = 10) => 
    api.get(`/pedidos/sin-repartidor?page=${page}&size=${size}`),
  
  getById: (id) => 
    api.get(`/pedidos/${id}`),
  
  create: (data) => 
    api.post('/pedidos', data),
  
  actualizarEstado: (id, estado) => 
    api.patch(`/pedidos/${id}/estado?estado=${estado}`),
  
  asignarRepartidor: (id, repartidorId) => 
    api.patch(`/pedidos/${id}/asignar-repartidor?repartidorId=${repartidorId}`),
  
  delete: (id) => 
    api.delete(`/pedidos/${id}`),
  
  getPorCliente: (clienteId, estado, page = 0, size = 10) => {
    let url = `/pedidos/cliente/${clienteId}?page=${page}&size=${size}`;
    if (estado) url += `&estado=${estado}`;
    return api.get(url);
  }
};

export default api;