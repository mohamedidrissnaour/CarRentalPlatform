package net.naour.rentalservice.dto;

/**
 * DTO for payment response from payment-service.
 */
public class PaymentResponse {
    private String paymentId;
    private String status;
    private String message;
    private Double amount;

    public PaymentResponse() {
    }

    public PaymentResponse(String paymentId, String status, String message, Double amount) {
        this.paymentId = paymentId;
        this.status = status;
        this.message = message;
        this.amount = amount;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}

