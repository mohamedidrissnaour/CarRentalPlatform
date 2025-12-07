package net.naour.rentalservice.repository;

import net.naour.rentalservice.entities.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {



    @RestResource(path = "/ByCarId")
    List<Rental> findByCarId(@Param("carid") Long carId);

    @Query("SELECT r FROM Rental r WHERE r.carId = :carId " +
            "AND r.status = 'ACTIVE' " +
            "AND ((r.startDate <= :endDate AND r.endDate >= :startDate))")
    List<Rental> findActiveRentalsForCarInDateRange(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}

