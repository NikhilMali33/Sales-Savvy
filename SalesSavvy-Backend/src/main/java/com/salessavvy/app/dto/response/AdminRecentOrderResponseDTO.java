package com.salessavvy.app.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminRecentOrderResponseDTO {

    private String orderId;
    private Integer userId;
    private String username;
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private LocalDateTime createdAt;

    public AdminRecentOrderResponseDTO() {
    }

    public AdminRecentOrderResponseDTO(
            String orderId,
            Integer userId,
            String username,
            BigDecimal totalAmount,
            String status,
            String paymentStatus,
            LocalDateTime createdAt) {

        this.orderId = orderId;
        this.userId = userId;
        this.username = username;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}