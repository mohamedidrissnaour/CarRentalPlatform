package net.naour.rentalservice.feign;

import net.naour.rentalservice.dto.Car;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service" , url = "${car.service.url:http://localhost:8081}")
public interface CarRestClient {


    @GetMapping("/api/cars/{id}")
    Car getCarById(@PathVariable("id") Long id);

    @PutMapping("/api/cars/{id}")
    ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car);

    @GetMapping("/api/cars")
    PagedModel<Car> getAllCars();

    @GetMapping("/api/cars/available")
    List<Car> getAvailableCars();

    @PatchMapping("/api/cars/{id}/availability")
    Car updateAvailability(@PathVariable("id") Long id, @RequestParam("disponible") boolean disponible);
//PagedModel<T> est une classe fournie par Spring HATEOAS
// pour représenter une collection paginée avec des métadonnées :
//
//_embedded → les objets réels (customers)
//
//_links → les liens de navigation (HATEOAS)
//
//page → les infos de pagination
}