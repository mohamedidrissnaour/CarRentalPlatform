package net.naour.rentalservice.repository;

import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.entities.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {



    // Trouver toutes les réservations d'un client
    List<Rental> findByClientId(Long clientId);

    // Trouver toutes les réservations d'une voiture
    List<Rental> findByCarId(Long carId);

    // Trouver les réservations par statut
    List<Rental> findByStatut(StatutReservation statut);

    // Vérifier les conflits de réservation pour une voiture
    @Query("SELECT r FROM Rental r WHERE r.carId = :carId " +
            "AND r.statut IN ('EN_ATTENTE', 'CONFIRMEE', 'EN_COURS') " +
            "AND ((r.startDate <= :dateFin AND r.endDate >= :dateDebut))")
    List<Rental> findConflictingReservations(
            @Param("carId") Long carId,
            @Param("dateDebut") LocalDate startDate,
            @Param("dateFin") LocalDate endDate
    );

    // Trouver les réservations entre deux dates
    @Query("SELECT r FROM Rental r WHERE r.startDate >= :startDate AND r.endDate <= :endDate")
    List<Rental> findReservationsBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Trouver les réservations actives
    @Query("SELECT r FROM Rental r WHERE r.statut IN ('CONFIRMEE', 'EN_COURS') " +
            "AND r.startDate <= :today AND r.endDate >= :today")
    List<Rental> findActiveReservations(@Param("today") LocalDate today);
}

