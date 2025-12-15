package net.naour.rentalservice.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.dto.Client;
import net.naour.rentalservice.dto.RentalDTO;
import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.entities.StatutReservation;
import net.naour.rentalservice.feign.CarRestClient;
import net.naour.rentalservice.feign.ClientRestClient;
import net.naour.rentalservice.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j //@Slf4j est une annotation fournie par Lombok pour générer automatiquement un logger dans ta classe.
public class RentalService {
    private final RentalRepository rentalRepository;
    private final CarRestClient carRestClient;
    private final ClientRestClient clientRestClient;

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Optional<Rental> getRentalById(Long id) {
        return rentalRepository.findById(id);
    }

    public List<Rental> getRentalsByClientId(Long clientId) {
        return rentalRepository.findByClientId(clientId);
    }

    public List<Rental> getRentalByCarId(Long carId) {
        return rentalRepository.findByCarId(carId);
    }

    public List<Rental> getRentalsByStatut(StatutReservation statut) {
        return rentalRepository.findByStatut(statut);
    }

    public List<Rental> getRentalsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return rentalRepository.findRentalsBetweenDates(startDate, endDate);
    }

    public List<Rental> getActiveRentals() {
        return rentalRepository.findActiveRentals(LocalDate.now());
    }


    @Transactional //@Transactional est une annotation de Spring (ou JPA)
    // qui sert à gérer les transactions sur la base de données , en cas dechoue ROllback.
    public Rental createRental(Rental rental) {
        log.info("Création d'une réservation pour le client {} et la voiture {}",
                rental.getClientId(), rental.getCarId());

        // 3. Vérifier que la voiture existe et est disponible
        Car car = carRestClient.getCarById(rental.getCarId());
        if (car == null || !car.isDisponible()) {
            throw new RuntimeException("La voiture n'est pas disponible");
        }


        // 4. Calculer le montant total
        long nombreJours = rental.getNombreJours();
        if (nombreJours <= 0) {
            nombreJours = 1;
        }
        double montant = nombreJours * car.getPricePerDay();
        rental.setMontantTotal(Math.round(montant * 100.0) / 100.0);

        log.info("Montant calculé: {} EUR pour {} jour(s)", rental.getMontantTotal(), nombreJours);

        // 5. Sauvegarder la réservation
        Rental savedrental = rentalRepository.save(rental);

        // 6. Marquer la voiture comme non disponible
        try {
            carRestClient.updateAvailability(rental.getCarId(), false);
            log.info("Voiture {} marquée comme non disponible", rental.getCarId());
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de la disponibilité: {}", e.getMessage());
        }

        return savedrental;

        }

    @Transactional
    public Rental updateRentalStatut(Long id, StatutReservation statut) {
        Rental reservation = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));

        log.info("Changement de statut de la réservation {} : {} -> {}",
                id, reservation.getStatut(), statut);

        // Si annulation ou terminée, remettre la voiture disponible
        if (statut == StatutReservation.ANNULEE || statut == StatutReservation.TERMINEE) {
            try {
                carRestClient.updateAvailability(reservation.getCarId(), true);
                log.info("Voiture {} remise disponible", reservation.getCarId());
            } catch (Exception e) {
                log.error("Erreur lors de la remise à disponible: {}", e.getMessage());
            }
        }

        reservation.setStatut(statut);
        return rentalRepository.save(reservation);
    }


    @Transactional
    public void deleteReservation(Long id) {
        Rental reservation = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));

        // Remettre la voiture disponible
        try {
            carRestClient.updateAvailability(reservation.getCarId(), true);
            log.info("Voiture {} remise disponible après suppression", reservation.getCarId());
        } catch (Exception e) {
            log.error("Erreur lors de la remise à disponible: {}", e.getMessage());
        }

        rentalRepository.deleteById(id);
    }


    public boolean isCarAvailable(Long carId, LocalDate dateDebut, LocalDate dateFin) {
        List<Rental> conflits = rentalRepository.findConflictingRentals(
                carId, dateDebut, dateFin
        );
        return conflits.isEmpty();
    }


    public RentalDTO getReservationDetails(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        Client client = clientRestClient.getClientById(rental.getClientId());
        Car car = carRestClient.getCarById(rental.getCarId());

        return RentalDTO.builder()
                .id(rental.getId())
                .clientId(rental.getClientId())
                .clientNom(client.getNom())
                .clientPrenom(client.getPrenom())
                .carId(rental.getCarId())
                .carMarque(car.getBrand() != null ? car.getBrand() : (car.getMarque() != null ? car.getMarque() : ""))
                .carModele(car.getModel() != null ? car.getModel() : (car.getModele() != null ? car.getModele() : ""))
                .startDate(rental.getStartDate())
                .endDate(rental.getEndDate())
                .dateDebut(rental.getStartDate())  // Pour compatibilité
                .dateFin(rental.getEndDate())       // Pour compatibilité
                .nombreJours(rental.getNombreJours())
                .montantTotal(rental.getMontantTotal())
                .statut(rental.getStatut())
                .build();
    }

    public List<RentalDTO> getAllReservationsWithDetails() {
        return rentalRepository.findAll().stream()
                .map(reservation -> {
                    try {
                        return getReservationDetails(reservation.getId());
                    } catch (Exception e) {
                        log.error("Erreur lors de la récupération des détails: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}

