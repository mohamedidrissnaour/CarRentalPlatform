package net.naour.carservice.service;

import net.naour.carservice.entities.Car;
import net.naour.carservice.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {
    private final CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByDisponibleTrue();
    }

    public List<Car> getCarsByCategory(String categorie) {
        return carRepository.findByCategorie(categorie);
    }

    public Car createCar(Car car) {
        car.setDisponible(true);
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car carDetails) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée"));

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setImmatriculation(carDetails.getImmatriculation());
        car.setCategorie(carDetails.getCategorie());
        car.setYear(carDetails.getYear());
        car.setPricePerDay(carDetails.getPricePerDay());
        car.setDisponible(carDetails.isDisponible());


        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    public Car updateAvailability(Long id, boolean disponible) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée"));
        car.setDisponible(disponible);
        return carRepository.save(car);
    }
}