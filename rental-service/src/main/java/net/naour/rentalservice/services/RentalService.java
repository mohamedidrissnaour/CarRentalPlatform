package net.naour.rentalservice.services;


import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.dto.PaymentRequest;
import net.naour.rentalservice.dto.PaymentResponse;
import net.naour.rentalservice.dto.RentalRequest;
import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.entities.RentalStatus;
import net.naour.rentalservice.feign.CarRestClient;
import net.naour.rentalservice.repository.RentalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final CarRestClient carRestClient;


    public RentalService(RentalRepository rentalRepository, CarRestClient carRestClient) {
        this.rentalRepository = rentalRepository;
        this.carRestClient = carRestClient;
    }


    @Transactional
    public Rental createRental(RentalRequest request) {
        // Date validations are now handled by @ValidDateRange and @FutureOrPresent annotations

        // Check car availability via FeignClient
        ResponseEntity<Car> carResponse = carRestClient.findCarById(request.getCarId());

        if (carResponse.getStatusCode() != HttpStatus.OK || carResponse.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Car not found with ID: " + request.getCarId());
        }

        Car car = carResponse.getBody();

        // Check if car is available
        if (!"AVAILABLE".equalsIgnoreCase(car.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Car is not available for rental");
        }

        // Check for overlapping rentals
        List<Rental> overlappingRentals = rentalRepository
                .findActiveRentalsForCarInDateRange(
                        request.getCarId(),
                        request.getStartDate(),
                        request.getEndDate()
                );

        if (!overlappingRentals.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Car is already rented for the requested dates");
        }

        // Calculate total amount
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        Double totalAmount = car.getPricePerDay() * days;

        // Process payment via WebClient
        PaymentRequest paymentRequest = new PaymentRequest(
                "stripe", // Default payment method
                totalAmount,
                request.getClientId(),
                String.format("Rental for car %d (%s %s)", car.getId(), car.getBrand(), car.getModel())
        );

        try {
            PaymentResponse paymentResponse = paymentServiceClient.processPayment(paymentRequest)
                    .block(); // Blocking call for synchronous processing

            if (paymentResponse == null || !"SUCCESS".equalsIgnoreCase(paymentResponse.getStatus())) {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED,
                        "Payment processing failed: " + (paymentResponse != null ? paymentResponse.getMessage() : "Unknown error"));
            }

            // Create rental
            Rental rental = new Rental();
            rental.setCar(request.getCarId());
            rental.setClientId(request.getClientId());
            rental.setStartDate(request.getStartDate());
            rental.setEndDate(request.getEndDate());
            rental.setStatus(RentalStatus.ACTIVE);
            rental.setPaymentId(paymentResponse.getPaymentId());
            rental.setTotalAmount(totalAmount);

            Rental savedRental = rentalRepository.save(rental);

            // Update car status to RENTED
            car.setStatus("RENTED");
            // Set ID explicitly as it might be null in the response from Spring Data REST
            car.setId(request.getCarId());
            carRestClient.updateCar(request.getCarId(), car);

            return savedRental;

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing payment: " + e.getMessage(), e);
        }
    }

    /**
     * Get all rentals.
     */
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    /**
     * Get rental by ID.
     */
    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Rental not found with ID: " + id));
    }


    /**
     * Get rentals by car ID.
     */
    public List<Rental> getRentalsByCarId(Long carId) {
        return rentalRepository.findByCarId(carId);
    }
}

