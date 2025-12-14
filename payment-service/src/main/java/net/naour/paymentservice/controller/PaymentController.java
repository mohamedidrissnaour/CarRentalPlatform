package net.naour.paymentservice.controller;

import lombok.RequiredArgsConstructor;
import net.naour.paymentservice.DTO.PaymentRequest;
import net.naour.paymentservice.DTO.PaymentResponse;
import net.naour.paymentservice.entities.MethodePaiement;
import net.naour.paymentservice.entities.Payment;
import net.naour.paymentservice.entities.PaymentStatus;
import net.naour.paymentservice.repositories.PaymentRepository;
import net.naour.paymentservice.services.PaymentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Optional<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/reservation/{reservationId}")
    public List<Payment> getPaymentsByReservation(@PathVariable Long reservationId) {
        return paymentService.getPaymentsByReservation(reservationId);
    }

    @GetMapping("/client/{clientId}")
    public List<Payment> getPaymentsByClient(@PathVariable Long clientId) {
        return paymentService.getPaymentsByClient(clientId);
    }

    @GetMapping("/statut/{statut}")
    public List<Payment> getPaymentsByStatut(@PathVariable PaymentStatus statut) {
        return paymentService.getPaymentsByStatut(statut);
    }

    @GetMapping("/methode/{methode}")
    public List<Payment> getPaymentsByMethode(@PathVariable MethodePaiement methode) {
        return paymentService.getPaymentsByMethode(methode);
    }

    @GetMapping("/transaction/{transactionId}")
    public List<Payment> getPaymentByTransaction(@PathVariable String transactionId) {
        return paymentService.getPaymentByTransaction(transactionId);
    }

    @GetMapping("/revenue")
    public Double getTotalRevenue() {
        return paymentService.getTotalRevenue();
    }

    @GetMapping("/period")
    public List<Payment> getPaymentsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return paymentService.getPaymentsBetweenDates(startDate, endDate);
    }

    @PostMapping("/process")
    public PaymentResponse processPayment(@RequestBody PaymentRequest request) {
         return paymentService.processPayment(request);

    }

    @PostMapping("/{id}/refund")
    public Payment refundPayment(@PathVariable Long id) {
        return  paymentService.refundPayment(id);
    }

    @PostMapping("/{id}/confirm")
    public Payment confirmManualPayment(@PathVariable Long id) {
        return paymentService.confirmManualPayment(id);
    }
}