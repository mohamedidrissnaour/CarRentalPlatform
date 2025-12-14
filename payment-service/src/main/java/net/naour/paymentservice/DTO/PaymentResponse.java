package net.naour.paymentservice.DTO;

import net.naour.paymentservice.entities.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private String transactionId;
    private PaymentStatus statut;
    private String message;
    private String clientSecret; // Pour Paypal (frontend)
    private double montant;
}