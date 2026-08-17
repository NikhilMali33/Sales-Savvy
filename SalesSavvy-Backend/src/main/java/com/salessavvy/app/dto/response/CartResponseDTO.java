package com.salessavvy.app.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class CartResponseDTO {

    private List<CartItemResponseDTO> items;

    private Integer totalItems;

    private BigDecimal totalAmount;


    public CartResponseDTO() {
    }


    public List<CartItemResponseDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponseDTO> items) {
        this.items = items;
    }


    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }


    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}