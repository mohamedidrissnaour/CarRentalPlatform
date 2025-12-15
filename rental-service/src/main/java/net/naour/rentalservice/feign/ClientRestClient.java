package net.naour.rentalservice.feign;

import net.naour.rentalservice.dto.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "client-service", url = "${client.service.url:http://localhost:8082}")
public interface ClientRestClient {

    @GetMapping("/clients/{id}")
    Client getClientById(@PathVariable("id") Long id);
}