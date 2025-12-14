/**
 * Utilitaires pour le formatage des données
 */

/**
 * Formate un prix en EUR
 * @param {number} price - Le prix à formater
 * @returns {string} Prix formaté
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Formate une date en français
 * @param {Date|string} date - La date à formater
 * @param {string} format - Le format souhaité (par défaut: 'dd/MM/yyyy')
 * @returns {string} Date formatée
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  const { format } = require('date-fns');
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return date;
  }
};

/**
 * Calcule le nombre de jours entre deux dates
 * @param {Date|string} startDate - Date de début
 * @param {Date|string} endDate - Date de fin
 * @returns {number} Nombre de jours
 */
export const calculateDays = (startDate, endDate) => {
  const { differenceInDays } = require('date-fns');
  try {
    return differenceInDays(new Date(endDate), new Date(startDate));
  } catch (error) {
    return 0;
  }
};

