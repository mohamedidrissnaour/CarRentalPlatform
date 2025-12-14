import api, { API_URLS } from './api';

const BASE_URL = `${API_URLS.RENTAL_SERVICE}/api/reservations`;

export const rentalService = {
  // Récupérer toutes les réservations
  getAllReservations: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Récupérer une réservation par ID
  getReservationById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer les détails enrichis d'une réservation
  getReservationDetails: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}/details`);
    return response.data;
  },

  // Récupérer les réservations d'un client
  getReservationsByClient: async (clientId) => {
    const response = await api.get(`${BASE_URL}/client/${clientId}`);
    return response.data;
  },

  // Récupérer les réservations d'une voiture
  getReservationsByCar: async (carId) => {
    const response = await api.get(`${BASE_URL}/car/${carId}`);
    return response.data;
  },

  // Récupérer les réservations actives
  getActiveReservations: async () => {
    const response = await api.get(`${BASE_URL}/active`);
    return response.data;
  },

  // Créer une réservation
  createReservation: async (reservationData) => {
    const response = await api.post(BASE_URL, reservationData);
    return response.data;
  },

  // Changer le statut d'une réservation
  updateReservationStatus: async (id, statut) => {
    const response = await api.patch(`${BASE_URL}/${id}/statut`, null, {
      params: { statut },
    });
    return response.data;
  },

  // Supprimer une réservation
  deleteReservation: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Vérifier la disponibilité
  checkAvailability: async (carId, startDate, endDate) => {
    const response = await api.get(`${BASE_URL}/check-availability`, {
      params: { carId, startDate, endDate },
    });
    return response.data;
  },
};

