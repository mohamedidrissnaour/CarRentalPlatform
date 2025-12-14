package net.naour.clientservice.repositories;

import net.naour.clientservice.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Client> findByNomContainingIgnoreCase(String nom);
    List<Client> findByVille(String ville);
}