import api, { API_URLS } from './api';

const BASE_URL = `${API_URLS.CAR_SERVICE}/api/cars`;

export const carService = {
  // Récupérer toutes les voitures
  getAllCars: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Récupérer une voiture par ID
  getCarById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer les voitures disponibles
  getAvailableCars: async () => {
    const response = await api.get(`${BASE_URL}/available`);
    return response.data;
  },

  // Récupérer les voitures par catégorie
  getCarsByCategory: async (category) => {
    const response = await api.get(`${BASE_URL}/category/${category}`);
    return response.data;
  },

  // Créer une voiture
  createCar: async (carData) => {
    const response = await api.post(BASE_URL, carData);
    return response.data;
  },

  // Modifier une voiture
  updateCar: async (id, carData) => {
    const response = await api.put(`${BASE_URL}/${id}`, carData);
    return response.data;
  },

  // Supprimer une voiture
  deleteCar: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Changer la disponibilité d'une voiture
  updateAvailability: async (id, available) => {
    const response = await api.patch(`${BASE_URL}/${id}/availability`, null, {
      params: { available },
    });
    return response.data;
  },
};

