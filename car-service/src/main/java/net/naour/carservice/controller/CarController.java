package net.naour.carservice.controller;

import lombok.RequiredArgsConstructor;
import net.naour.carservice.entities.Car;
import net.naour.carservice.repository.CarRepository;
import net.naour.carservice.service.CarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")


@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public Car getCarById(@PathVariable Long id) {
        return carService.getCarById(id).orElseThrow();
    }

    @GetMapping("/available")
    public List<Car> getAvailableCars() {
        return carService.getAvailableCars();
    }

    @GetMapping("/category/{categorie}")
    public List<Car> getCarsByCategory(@PathVariable String categorie) {
        return carService.getCarsByCategory(categorie);
    }


    @PostMapping
    public Car createCar(@RequestBody Car car) {
        return carService.createCar(car);
    }

    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id ,@RequestBody Car car) {
        return carService.updateCar(id ,car);
    }

    @PatchMapping("/{id}/availability")
    public Car UpdateAvailability(@PathVariable Long id , @RequestParam boolean availability) {
        return carService.updateAvailability(id, availability);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }




}


