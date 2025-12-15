package net.naour.clientservice.controller;

import lombok.RequiredArgsConstructor;
import net.naour.clientservice.entities.Client;
import net.naour.clientservice.services.ClientService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class ClientController {
    private final ClientService clientService;

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .orElseThrow();
    }

    @GetMapping("/email/{email}")
    public List<Client> getClientByEmail(@PathVariable String email) {
        return clientService.getClientByEmail(email);

    }

    @GetMapping("/search")
    public List<Client> searchClients(@RequestParam String nom) {
        return clientService.searchClientsByName(nom);
    }

    @GetMapping("/city/{ville}")
    public List<Client> getClientsByCity(@PathVariable String ville) {
        return clientService.getClientsByCity(ville);
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.createClient(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id,  @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }

    @GetMapping("/exists")
    public boolean checkEmailExists(@RequestParam String email) {
        return clientService.existsByEmail(email);
    }
}
