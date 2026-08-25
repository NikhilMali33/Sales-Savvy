package com.salessavvy.app.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class UserDetailsResponseDTO {

    private int userid;

    private String username;

    private String email;

    private String role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private int totalOrders;

    private double totalSpent;

    private List<UserOrderResponseDTO> orders;


    public UserDetailsResponseDTO() {
    }


    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
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


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }


    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }


    public double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(double totalSpent) {
        this.totalSpent = totalSpent;
    }


    public List<UserOrderResponseDTO> getOrders() {
        return orders;
    }

    public void setOrders(List<UserOrderResponseDTO> orders) {
        this.orders = orders;
    }
}