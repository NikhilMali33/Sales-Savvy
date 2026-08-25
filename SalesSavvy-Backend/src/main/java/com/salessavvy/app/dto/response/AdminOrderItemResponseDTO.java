package com.salessavvy.app.dto.response;

import java.math.BigDecimal;

public class AdminOrderItemResponseDTO {

    private Integer id;

    private String productId;

    private String productName;

    private Integer quantity;

    private BigDecimal pricePerUnit;

    private BigDecimal totalPrice;

    // CONSTRUCTORS
    public AdminOrderItemResponseDTO() {
    }


    public AdminOrderItemResponseDTO(
            Integer id,
            String productId,
            String productName,
            Integer quantity,
            BigDecimal pricePerUnit,
            BigDecimal totalPrice) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.totalPrice = totalPrice;
    }


    // GETTERS & SETTERS
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }


    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}