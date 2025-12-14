package net.naour.rentalservice.entities;

public enum StatutReservation {
    EN_ATTENTE,      // Réservation en attente de confirmation
    CONFIRMEE,       // Réservation confirmée
    EN_COURS,        // Location en cours
    TERMINEE,        // Location terminée
    ANNULEE          // Réservation annulée
}