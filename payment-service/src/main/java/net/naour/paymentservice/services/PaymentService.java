package net.naour.paymentservice.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.naour.paymentservice.DTO.*;
import net.naour.paymentservice.entities.*;
import net.naour.paymentservice.repositories.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PayPalService payPalService;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByReservation(Long reservationId) {
        return paymentRepository.findByReservationId(reservationId);
    }

    public List<Payment> getPaymentsByClient(Long clientId) {
        return paymentRepository.findByClientId(clientId);
    }

    public List<Payment> getPaymentsByStatut(PaymentStatus statut) {
        return paymentRepository.findByStatut(statut);
    }

    public List<Payment> getPaymentsByMethode(MethodePaiement methode) {
        return paymentRepository.findByMethodePaiement(methode);
    }

    public List<Payment> getPaymentByTransaction(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    public Double getTotalRevenue() {
        Double revenue = paymentRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public List<Payment> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findPaymentsBetweenDates(startDate, endDate);
    }

    //Traiter un nouveau paiement
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Traitement d'un paiement de " + request.getMontant() + "DIRHAM via" + request.getMethodePaiement()
        );

        // Validation du montant
        if (request.getMontant() <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }

        if (request.getRentalId() == null) {
            throw new RuntimeException("L'ID de réservation est obligatoire");
        }

        if (request.getClientId() == null) {
            throw new RuntimeException("L'ID du client est obligatoire");
        }

        // Créer l'entité Payment
        Payment payment = new Payment();
        payment.setRentalId(request.getRentalId());
        payment.setClientId(request.getClientId());
        payment.setMontant(request.getMontant());
        payment.setMethodePaiement(request.getMethodePaiement());
        payment.setStatut(PaymentStatus.EN_COURS);

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Paiement enregistré avec l'ID: " + savedPayment.getId());

        try {
            String transactionId;
            boolean success;
            String clientSecret = null;

            // Traiter selon la méthode de paiement
            switch (request.getMethodePaiement()) {
                case CARTE_CREDIT:
                case PAYPAL:
                    transactionId = payPalService.createOrder(request);
                    success = payPalService.capturePayment(transactionId);
                    break;

                case VIREMENT_BANCAIRE:
                case ESPECES:

                    transactionId = "MANUAL-" + savedPayment.getId();
                    success = true;
                    payment.setStatut(PaymentStatus.EN_ATTENTE);
                    log.info("Paiement manuel - en attente de confirmation");
                    break;

                default:
                    throw new RuntimeException("Méthode de paiement non supportée: " + request.getMethodePaiement());
            }

            payment.setTransactionId(transactionId);

            if (success) {
                payment.setStatut(PaymentStatus.REUSSI);
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);

                log.info("Paiement " + savedPayment.getId() + " traité avec succès");

                return PaymentResponse.builder()
                        .paymentId(savedPayment.getId())
                        .transactionId(transactionId)
                        .statut(PaymentStatus.REUSSI)
                        .message("Paiement effectué avec succès")
                        .clientSecret(clientSecret)
                        .montant(request.getMontant())
                        .build();
            } else {
                payment.setStatut(PaymentStatus.ECHOUE);
                paymentRepository.save(payment);

                log.warn("Échec du paiement " + savedPayment.getId());

                return PaymentResponse.builder()
                        .paymentId(savedPayment.getId())
                        .transactionId(transactionId)
                        .statut(PaymentStatus.ECHOUE)
                        .message("Le paiement a échoué. Veuillez réessayer.")
                        .montant(request.getMontant())
                        .build();
            }

        } catch (Exception e) {
            payment.setStatut(PaymentStatus.ECHOUE);
            paymentRepository.save(payment);

            log.error("Erreur lors du traitement du paiement:" + e.getMessage());

            return PaymentResponse.builder()
                    .paymentId(savedPayment.getId())
                    .statut(PaymentStatus.ECHOUE)
                    .message("Erreur lors du traitement: " + e.getMessage())
                    .montant(request.getMontant())
                    .build();
        }
    }


    @Transactional
    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID: " + paymentId));

        if (payment.getStatut() != PaymentStatus.REUSSI) {
            throw new RuntimeException("Seuls les paiements réussis peuvent être remboursés. Statut actuel: " + payment.getStatut());
        }

        log.info("Remboursement du paiement " + paymentId + "de DIRHAM " + payment.getMontant());

        boolean refundSuccess = false;

        try {
            switch (payment.getMethodePaiement()) {
                case CARTE_CREDIT:


                case PAYPAL:
                    refundSuccess = payPalService.refund(payment.getTransactionId(), payment.getMontant());
                    break;

                case VIREMENT_BANCAIRE:
                case ESPECES:

                    refundSuccess = true;
                    log.info("Remboursement manuel approuvé");
                    break;
            }

            if (refundSuccess) {
                payment.setStatut(PaymentStatus.REMBOURSE);
                log.info("Paiement" + paymentId + "remboursé avec succès");
            } else {
                throw new RuntimeException("Échec du remboursement auprès du fournisseur de paiement");
            }

        } catch (Exception e) {
            log.error(" Erreur lors du remboursement: {}", e.getMessage());
            throw new RuntimeException("Erreur lors du remboursement: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }


    @Transactional
    public Payment confirmManualPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID: " + paymentId));

        if (payment.getStatut() != PaymentStatus.EN_ATTENTE) {
            throw new RuntimeException("Seuls les paiements en attente peuvent être confirmés");
        }

        payment.setStatut(PaymentStatus.REUSSI);
        payment.setPaidAt(LocalDateTime.now());

        log.info("✅ Paiement manuel" + paymentId + " confirmé");
        return paymentRepository.save(payment);
    }

}