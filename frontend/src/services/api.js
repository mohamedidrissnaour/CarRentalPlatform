import axios from 'axios';

// Configuration de base pour Axios
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter un token d'authentification si disponible
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

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log de l'erreur pour le débogage
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('Erreur réseau:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      console.error('Erreur API:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }

    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si non autorisé
      localStorage.removeItem('token');
      // Ne pas rediriger vers /login qui n'existe pas
      console.warn('Non autorisé - token invalide');
    }
    return Promise.reject(error);
  }
);

// URLs des services (depuis les variables d'environnement)
export const API_URLS = {
  CAR_SERVICE: import.meta.env.VITE_CAR_SERVICE_URL || 'http://localhost:8081',
  CLIENT_SERVICE: import.meta.env.VITE_CLIENT_SERVICE_URL || 'http://localhost:8082',
  RENTAL_SERVICE: import.meta.env.VITE_RENTAL_SERVICE_URL || 'http://localhost:8083',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084',
};

// Log des URLs configurées (en développement seulement)
if (import.meta.env.DEV) {
  console.log('URLs des services API configurées:', API_URLS);
}

export default api;

