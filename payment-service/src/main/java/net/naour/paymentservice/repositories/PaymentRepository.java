package net.naour.paymentservice.repositories;
import net.naour.paymentservice.entities.MethodePaiement;
import net.naour.paymentservice.entities.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import net.naour.paymentservice.entities.Payment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;
import java.util.List;


@RepositoryRestResource
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Trouver les paiements par réservation
    List<Payment> findByReservationId(Long reservationId);

    // Trouver les paiements par client
    List<Payment> findByClientId(Long clientId);

    // Trouver les paiements par statut
    List<Payment> findByStatut(PaymentStatus statut);

    // Trouver un paiement par ID de transaction
    List<Payment> findByTransactionId(String transactionId);

    // Trouver les paiements par méthode
    List<Payment> findByMethodePaiement(MethodePaiement methode);

    // Calculer le revenu total des paiements réussis
    @Query("SELECT SUM(p.montant) FROM Payment p WHERE p.statut = 'REUSSI'")
    Double getTotalRevenue();

    // Trouver les paiements entre deux dates
    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    List<Payment> findPaymentsBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Trouver les paiements réussis pour une période
    @Query("SELECT p FROM Payment p WHERE p.statut = 'REUSSI' " +
            "AND p.paidAt >= :startDate AND p.paidAt <= :endDate")
    List<Payment> findSuccessfulPaymentsBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
