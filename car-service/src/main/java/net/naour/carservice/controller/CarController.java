package net.naour.carservice.controller;

import lombok.RequiredArgsConstructor;
import net.naour.carservice.entities.Car;
import net.naour.carservice.repository.CarRepository;
import net.naour.carservice.service.CarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")

@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/cars/{id}")
    public Car getCarById(@PathVariable Long id) {
        return carService.getCarById(id).orElseThrow();
    }

    @GetMapping("/cars/available")
    public List<Car> getAvailableCars() {
        return carService.getAvailableCars();
    }

    @GetMapping("/cars/category/{categorie}")
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

    @PatchMapping("/{id}/availability}")
    public Car UpdateAvailability(@PathVariable Long id , @RequestParam boolean availability) {
        return carService.updateAvailability(id, availability);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }




}


