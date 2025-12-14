package net.naour.paymentservice.DTO;

import net.naour.paymentservice.entities.MethodePaiement;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long rentalId;
    private Long clientId;
    private double montant;
    private MethodePaiement methodePaiement;
    private String token; // Token PayPal pour sécurité
    private String description;
}