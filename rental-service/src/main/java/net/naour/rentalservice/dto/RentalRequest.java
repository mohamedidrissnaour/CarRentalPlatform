package net.naour.rentalservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;


import java.time.LocalDate;

/**
 * DTO for creating a new rental request.
 */

public class RentalRequest {
    

    private Long carId;


    private String clientId;


    @JsonFormat(pattern = "yyyy-M-d")

    private LocalDate startDate;


    @JsonFormat(pattern = "yyyy-M-d")
    private LocalDate endDate;

    public RentalRequest() {
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}

