import api, { API_URLS } from './api';

const BASE_URL = `${API_URLS.CLIENT_SERVICE}/api/clients`;

export const clientService = {
  // Récupérer tous les clients
  getAllClients: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Récupérer un client par ID
  getClientById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer un client par email
  getClientByEmail: async (email) => {
    const response = await api.get(`${BASE_URL}/email/${email}`);
    return response.data;
  },

  // Créer un client
  createClient: async (clientData) => {
    const response = await api.post(BASE_URL, clientData);
    return response.data;
  },

  // Modifier un client
  updateClient: async (id, clientData) => {
    const response = await api.put(`${BASE_URL}/${id}`, clientData);
    return response.data;
  },

  // Supprimer un client
  deleteClient: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};

