package net.naour.clientservice.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clients")
public class Client {



        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank(message = "Le nom est obligatoire")
        private String nom;

        @NotBlank(message = "Le prénom est obligatoire")
        private String prenom;

        @Email(message = "Email invalide")
        @NotBlank(message = "L'email est obligatoire")
        @Column(unique = true)
        private String email;

        @NotBlank(message = "Le téléphone est obligatoire")
        private String telephone;

        private String adresse;
        private String ville;
        private String codePostal;
        private String numeroPermis;

        @Column(name = "created_at")
        private LocalDateTime createdAt;


}
