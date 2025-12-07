package net.naour.carservice;

import net.naour.carservice.entities.Car;
import net.naour.carservice.entities.CarStatus;
import net.naour.carservice.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Random;

@SpringBootApplication
public class CarServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(CarRepository carRepository) {
        return args -> {
            List<String> brands = List.of("Toyota", "BMW", "Mercedes");
            List<String> models = List.of("Model A", "Model B", "Model C");
            Random random = new Random();

            for (String brand : brands) {
                for (String model : models) {
                    Car car = Car.builder()
                            .brand(brand)
                            .model(model)
                            .year(2000 + random.nextInt(24)) // random year 2000-2023
                            .status(CarStatus.AVAILABLE) // par défaut
                            .pricePerDay(50 + random.nextDouble() * 150) // prix entre 50 et 200
                            .build();

                    carRepository.save(car);
                }
            }
        };
    }
}
