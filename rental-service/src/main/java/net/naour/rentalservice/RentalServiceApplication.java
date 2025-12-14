package net.naour.rentalservice;

import net.naour.rentalservice.dto.Car;
import net.naour.rentalservice.entities.Rental;
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



    }

