package net.naour.rentalservice.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.naour.rentalservice.dto.Car;

import java.time.LocalDate;

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


    @Transient  //cette attribut est dans la classe mais auccun e relation avec la base de donnée
    private Car car;


    @Column(name = "client_id", nullable = false)
    private String clientId;


    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;


    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.ACTIVE;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "total_amount")
    private Double totalAmount;

}
