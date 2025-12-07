package net.naour.carservice.entities;


import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cars")
@Data
@Builder @AllArgsConstructor @NoArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     //required
    @Column(nullable = false)
    private String brand;


    @Column(nullable = false)
    private String model;



    @Column(name = "car_year", nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarStatus status = CarStatus.AVAILABLE;



    @Column(name = "price_per_day", nullable = false)
    private Double pricePerDay;
}