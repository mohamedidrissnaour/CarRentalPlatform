package net.naour.rentalservice.feign;

import net.naour.rentalservice.dto.Car;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "car-service" , url = "${car.service.url:http://localhost:8081}")
public interface CarRestClient {
    @GetMapping("/api/cars/{id}")
    Car findCarById(@PathVariable Long id);

    @PutMapping("/api/cars/{id}")
    ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car);

    @GetMapping("/api/cars")
    PagedModel<Car> getAllCars();
//PagedModel<T> est une classe fournie par Spring HATEOAS
// pour représenter une collection paginée avec des métadonnées :
//
//_embedded → les objets réels (customers)
//
//_links → les liens de navigation (HATEOAS)
//
//page → les infos de pagination
}