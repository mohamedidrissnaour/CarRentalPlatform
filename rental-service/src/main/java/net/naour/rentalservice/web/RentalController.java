package net.naour.rentalservice.web;

import net.naour.rentalservice.entities.Rental;
import net.naour.rentalservice.feign.CarRestClient;
import net.naour.rentalservice.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RentalController {
    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private CarRestClient carRestClient;



    @GetMapping(path = "/cars/{id}")
    private Rental getRental(@PathVariable Long id){
        Rental rental = rentalRepository.findById(id).get();
        rental.setCar(carRestClient.findCarById(rental.getId()));
        return rental;
    }



}
