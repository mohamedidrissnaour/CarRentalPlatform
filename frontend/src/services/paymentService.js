import api, { API_URLS } from './api';

const BASE_URL = `${API_URLS.PAYMENT_SERVICE}/api/payments`;

export const paymentService = {
  // Récupérer tous les paiements
  getAllPayments: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Récupérer un paiement par ID
  getPaymentById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer les paiements d'une réservation
  getPaymentsByReservation: async (rentalId) => {
    const response = await api.get(`${BASE_URL}/reservation/${rentalId}`);
    return response.data;
  },

  // Récupérer les revenus totaux
  getTotalRevenue: async () => {
    const response = await api.get(`${BASE_URL}/revenue`);
    return response.data;
  },

  // Traiter un paiement
  processPayment: async (paymentData) => {
    const response = await api.post(`${BASE_URL}/process`, paymentData);
    return response.data;
  },

  // Rembourser un paiement
  refundPayment: async (id) => {
    const response = await api.post(`${BASE_URL}/${id}/refund`);
    return response.data;
  },

  // Confirmer un paiement manuel
  confirmPayment: async (id) => {
    const response = await api.post(`${BASE_URL}/${id}/confirm`);
    return response.data;
  },
};

