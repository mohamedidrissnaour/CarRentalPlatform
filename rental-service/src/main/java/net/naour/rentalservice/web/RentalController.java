package net.naour.rentalservice.web;

import lombok.RequiredArgsConstructor;
import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.dto.CarStatus;
import net.naour.rentalservice.dto.RentalDTO;
import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.entities.StatutReservation;
import net.naour.rentalservice.feign.CarRestClient;
import net.naour.rentalservice.repository.RentalRepository;
import net.naour.rentalservice.services.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RentalController {
    private final RentalService rentalService;

    @GetMapping
    public List<Rental> getAllReservations() {
        return rentalService.getAllReservations();
    }

    @GetMapping("/details")
    public List<RentalDTO> getAllReservationsWithDetails() {
        return rentalService.getAllReservationsWithDetails();
    }

    @GetMapping("/{id}")
    public Rental getReservationById(@PathVariable Long id) {
        return rentalService.getReservationById(id).orElseThrow();
    }

    @GetMapping("/{id}/details")
    public RentalDTO getReservationDetails(@PathVariable Long id) {
        return rentalService.getReservationDetails(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Rental> getReservationsByClient(@PathVariable Long clientId) {
        return rentalService.getReservationsByClientId(clientId);
    }

    @GetMapping("/car/{carId}")
    public List<Rental> getReservationsByCar(@PathVariable Long carId) {
        return rentalService.getReservationsByCarId(carId);
    }

    @GetMapping("/statut/{statut}")
    public List<Rental> getReservationsByStatut(@PathVariable StatutReservation statut) {
        return rentalService.getReservationsByStatut(statut);
    }

    @GetMapping("/active")
    public List<Rental> getActiveReservations() {
        return rentalService.getActiveReservations();
    }

    @GetMapping("/period")
    public List<Rental> getReservationsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            //ISO.DATE correspond au format yyyy-MM-dd
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return rentalService.getReservationsBetweenDates(startDate, endDate);
    }

    @PostMapping
    public Rental createReservation(@RequestBody Rental rental) {
        return rentalService.createReservation(rental);

    }

    @PatchMapping("/{id}/statut")
    public Rental updateStatut (@PathVariable Long id, @RequestParam StatutReservation statut) {
        return rentalService.updateReservationStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
          rentalService.deleteReservation(id);

    }

    @GetMapping("/check-availability")
    public boolean checkAvailability(
            @RequestParam Long carId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return rentalService.isCarAvailable(carId, dateDebut, dateFin);

    }
}





