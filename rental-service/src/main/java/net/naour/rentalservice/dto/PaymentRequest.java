package net.naour.rentalservice.dto;



/**
 * DTO for payment request to payment-service.
 */
public class PaymentRequest {
    

    private String paymentMethod; // "stripe" or "paypal"


    private Double amount;

    private String clientId;


    private String description;

    public PaymentRequest() {
    }

    public PaymentRequest(String paymentMethod, Double amount, String clientId, String description) {
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.clientId = clientId;
        this.description = description;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

