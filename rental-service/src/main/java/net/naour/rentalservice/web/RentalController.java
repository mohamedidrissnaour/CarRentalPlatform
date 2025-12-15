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
@RequestMapping("/rentals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RentalController {
    private final RentalService rentalService;

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    @GetMapping("/details")
    public List<RentalDTO> getAllRentalsWithDetails() {
        return rentalService.getAllReservationsWithDetails();
    }

    @GetMapping("/{id}")
    public Rental getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id).orElseThrow();
    }

    @GetMapping("/{id}/details")
    public RentalDTO getRentalsDetails(@PathVariable Long id) {
        return rentalService.getReservationDetails(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Rental> getRentalByClient(@PathVariable Long clientId) {
        return rentalService.getRentalsByClientId(clientId);
    }

    @GetMapping("/car/{carId}")
    public List<Rental> getRentalsByCar(@PathVariable Long carId) {
        return rentalService.getRentalByCarId(carId);
    }

    @GetMapping("/statut/{statut}")
    public List<Rental> getRentalsByStatut(@PathVariable StatutReservation statut) {
        return rentalService.getRentalsByStatut(statut);
    }

    @GetMapping("/active")
    public List<Rental> getActiveRentals() {
        return rentalService.getActiveRentals();
    }

    @GetMapping("/period")
    public List<Rental> getRentalsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            //ISO.DATE correspond au format yyyy-MM-dd
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return rentalService.getRentalsBetweenDates(startDate, endDate);
    }

    @PostMapping
    public Rental createRental(@RequestBody Rental rental) {
        return rentalService.createRental(rental);

    }

    @PatchMapping("/{id}/statut")
    public Rental updateStatut (@PathVariable Long id, @RequestParam StatutReservation statut) {
        return rentalService.updateRentalStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    public void deleteRental(@PathVariable Long id) {
          rentalService.deleteReservation(id);

    }

    @GetMapping("/check-availability")
    public boolean checkAvailability(
            @RequestParam Long carId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        // Support both old (dateDebut/dateFin) and new (startDate/endDate) parameter names
        LocalDate start = startDate != null ? startDate : dateDebut;
        LocalDate end = endDate != null ? endDate : dateFin;
        return rentalService.isCarAvailable(carId, start, end);

    }
}





