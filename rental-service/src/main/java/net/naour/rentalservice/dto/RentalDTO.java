package net.naour.rentalservice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import net.naour.rentalservice.entities.StatutReservation;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalDTO {
    private Long id;
    private Long clientId;
    private String clientNom;
    private String clientPrenom;
    private Long carId;
    private String carMarque;
    private String carModele;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private long nombreJours;
    private double montantTotal;
    private StatutReservation statut;

}