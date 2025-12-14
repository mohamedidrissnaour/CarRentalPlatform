package net.naour.paymentservice.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rental_id", nullable = false)
    private Long rentalId;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private double montant;

    @Enumerated(EnumType.STRING)
    @Column(name = "methode_paiement", nullable = false)
    private MethodePaiement methodePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus statut;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;


}