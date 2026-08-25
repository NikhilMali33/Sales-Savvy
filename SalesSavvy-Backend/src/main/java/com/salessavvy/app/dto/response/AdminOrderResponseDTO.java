package com.salessavvy.app.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderResponseDTO {

    private String orderId;

    private Integer userId;

    private String username;

    private String email;

    private BigDecimal totalAmount;

    private String status;

    private String paymentStatus;

    private LocalDateTime createdAt;

    private List<AdminOrderItemResponseDTO> orderItems;


    // CONSTRUCTORS
    public AdminOrderResponseDTO() {
    }


    public AdminOrderResponseDTO(
            String orderId,
            Integer userId,
            String username,
            String email,
            BigDecimal totalAmount,
            String status,
            String paymentStatus,
            LocalDateTime createdAt,
            List<AdminOrderItemResponseDTO> orderItems) {

        this.orderId = orderId;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
        this.orderItems = orderItems;
    }


    // GETTERS & SETTERS
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


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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


    public List<AdminOrderItemResponseDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(
            List<AdminOrderItemResponseDTO> orderItems) {

        this.orderItems = orderItems;
    }
}