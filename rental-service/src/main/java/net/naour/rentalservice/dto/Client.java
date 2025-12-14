package net.naour.rentalservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
}
