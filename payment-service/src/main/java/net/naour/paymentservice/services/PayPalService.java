package net.naour.paymentservice.services;

import net.naour.paymentservice.DTO.PaymentRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@Slf4j
public class PayPalService {


     //Simule la création d'une commande PayPal

    public String createOrder(PaymentRequest request) {
        log.info("PAYPAL: Création d'une commande pour " + request.getMontant() + "DIRHAM" );

        // Simulation : génération d'un ID de commande PayPal
        String orderId = "PAYPAL-" + UUID.randomUUID().toString().toUpperCase().substring(0, 17);

        log.info("PAYPAL: Commande créée avec succès:" +  orderId);
        return orderId;
    }

    // Simule la capture d'un paiement PayPal

    public boolean capturePayment(String orderId) {
        log.info("PAYPAL: Capture du paiement: " +  orderId);

        // Simulation : 95% de taux de réussite
        boolean success = Math.random() > 0.05;

        if (success) {
            log.info("PAYPAL: Paiement capturé avec succès");
        } else {
            log.warn("PAYPAL: Échec de la capture du paiement");
        }

        return success;
    }


     //Simule un remboursement PayPal

    public boolean refund(String orderId, double amount) {
        log.info("PAYPAL: Demande de remboursement de" + amount +  "EUR pour"+ orderId);


        // Simulation : 95% de taux de réussite
        boolean success = Math.random() > 0.05;

        if (success) {
            log.info("PAYPAL: Remboursement effectué avec succès");
        } else {
            log.warn("PAYPAL: Échec du remboursement");
        }

        return success;
    }
}