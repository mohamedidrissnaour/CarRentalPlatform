package net.naour.clientservice.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.naour.clientservice.entities.*;
import net.naour.clientservice.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {
    @Autowired
    private final ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    public List<Client> getClientByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    public List<Client> searchClientsByName(String nom) {
        return clientRepository.findByNomContainingIgnoreCase(nom);
    }

    public List<Client> getClientsByCity(String ville) {
        return clientRepository.findByVille(ville);
    }

    @Transactional
    public Client createClient(Client client) {
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("Un client avec cet email existe déjà");
        }
        return clientRepository.save(client);
    }

    @Transactional
    public Client updateClient(Long id, Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));

        if (!client.getEmail().equals(clientDetails.getEmail()) &&
                clientRepository.existsByEmail(clientDetails.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé par un autre client");
        }

        client.setNom(clientDetails.getNom());
        client.setPrenom(clientDetails.getPrenom());
        client.setEmail(clientDetails.getEmail());
        client.setTelephone(clientDetails.getTelephone());
        client.setAdresse(clientDetails.getAdresse());
        client.setVille(clientDetails.getVille());
        client.setCodePostal(clientDetails.getCodePostal());
        client.setNumeroPermis(clientDetails.getNumeroPermis());

        return clientRepository.save(client);
    }

    @Transactional
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client non trouvé avec l'ID: " + id);
        }
        clientRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return clientRepository.existsByEmail(email);
    }



}
