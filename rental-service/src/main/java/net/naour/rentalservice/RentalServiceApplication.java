package net.naour.rentalservice;

import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.entities.RentalStatus;
import net.naour.rentalservice.feign.CarRestClient;
import net.naour.rentalservice.repository.RentalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
@EnableFeignClients(basePackages = "net.naour.rentalservice.feign")
public class RentalServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentalServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(RentalRepository rentalRepository, CarRestClient carRestClient) {
        return args -> {

            // Liste d'IDs de voitures pour initialiser les locations
            List<Long> carIds = List.of(1L, 2L, 3L); // adapte selon tes voitures réelles

            for (Long carId : carIds) {
                // Récupérer les infos de la voiture via Feign
                Car car = carRestClient.findCarById(carId);

                // Créer un Rental
                Rental rental = Rental.builder()
                        .id(car.getId())
                        .clientId("CLIENT-" + car.getId()) // exemple de clientId
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusDays(5))
                        .status(RentalStatus.ACTIVE)
                        .totalAmount(car.getPricePerDay() * 5) // prix total sur 5 jours
                        .paymentId(null) // à remplir selon ton système
                        .build();

                rentalRepository.save(rental);

                System.out.println("Rental created for car: " + car.getBrand() + " " + car.getModel());
            }
        };

    }
}
