package net.naour.rentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {
    private Long id;
    private String marque;
    private String modele;
    private String immatriculation;
    private String categorie;
    private int year;
    private double pricePerDay;
    private boolean disponible;
    private String imageUrl;




}

