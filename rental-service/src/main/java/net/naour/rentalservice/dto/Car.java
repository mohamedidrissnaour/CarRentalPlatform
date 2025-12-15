package net.naour.rentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {
    private Long id;
    private String brand;  // Utiliser brand au lieu de marque pour correspondre à l'entité
    private String model;   // Utiliser model au lieu de modele pour correspondre à l'entité
    private String marque;  // Garder pour compatibilité
    private String modele;  // Garder pour compatibilité
    private String immatriculation;
    private String categorie;
    private int year;
    private double pricePerDay;
    private boolean disponible;
    private String imageUrl;




}

