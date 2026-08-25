package com.salessavvy.app.dto.response;

import java.math.BigDecimal;

public class AdminLowStockProductResponseDTO {

    private Integer productId;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String status;

    public AdminLowStockProductResponseDTO() {
    }

    public AdminLowStockProductResponseDTO(
            Integer productId,
            String name,
            BigDecimal price,
            Integer stock,
            String status) {

        this.productId = productId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.status = status;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}