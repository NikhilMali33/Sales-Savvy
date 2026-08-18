package com.salessavvy.app.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.salessavvy.app.app.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id")
    private String orderId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;


    @Column(
        name = "total_amount",
        nullable = false,
        precision = 10,
        scale = 2
    )
    private BigDecimal totalAmount;


    @Enumerated(EnumType.STRING)
    @Column(
        name = "status"
    )
    private OrderStatus status =
            OrderStatus.PENDING;


    @CreationTimestamp
    @Column(
        name = "created_at",
        updatable = false
    )
    private LocalDateTime createdAt;


    @UpdateTimestamp
    @Column(
        name = "updated_at"
    )
    private LocalDateTime updatedAt;


    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<OrderItem> orderItems =
            new ArrayList<>();


    // ============================================================
    // CONSTRUCTORS
    // ============================================================

    public Order() {
    }


    public Order(
            String orderId,
            User user,
            BigDecimal totalAmount,
            OrderStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<OrderItem> orderItems) {

        this.orderId = orderId;
        this.user = user;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderItems = orderItems;
    }


    // ============================================================
    // GETTERS & SETTERS
    // ============================================================

    public String getOrderId() {
        return orderId;
    }


    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public BigDecimal getTotalAmount() {
        return totalAmount;
    }


    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }


    public OrderStatus getStatus() {
        return status;
    }


    public void setStatus(OrderStatus status) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }


    public List<OrderItem> getOrderItems() {
        return orderItems;
    }


    public void setOrderItems(
            List<OrderItem> orderItems) {

        this.orderItems = orderItems;
    }
}