package net.naour.carservice.repository;

import net.naour.carservice.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;


@RepositoryRestResource(collectionResourceRel = "cars", path = "cars")
public interface CarRepository extends JpaRepository<Car, Long> {


    @RestResource(path = "disponible", rel = "disponible")
    List<Car> findByDisponibleTrue();

    @RestResource(path = "brand", rel = "brand")
    List<Car> findByBrand(@Param("brand") String brand);

    @RestResource(path = "category", rel = "category")
    List<Car> findByCategorie(String categorie);
}

