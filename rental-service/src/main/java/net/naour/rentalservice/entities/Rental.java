package net.naour.rentalservice.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.dto.Client;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rentals")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "car_id", nullable = false)
    private Long carId;
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    @Column(name = "montant_total")
    private double montantTotal;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public long getNombreJours() {
        if (startDate != null && endDate != null) {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }
        return 0;
    }

}
