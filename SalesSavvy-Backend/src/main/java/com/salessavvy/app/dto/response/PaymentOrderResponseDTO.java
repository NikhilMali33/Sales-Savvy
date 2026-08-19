package com.salessavvy.app.dto.response;

public class PaymentOrderResponseDTO {

    private String orderId;

    private String razorpayOrderId;

    private String keyId;

    private long amount;

    private String currency;


    // ============================================================
    // CONSTRUCTORS
    // ============================================================

    public PaymentOrderResponseDTO() {
    }


    public PaymentOrderResponseDTO(
            String orderId,
            String razorpayOrderId,
            String keyId,
            long amount,
            String currency) {

        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.keyId = keyId;
        this.amount = amount;
        this.currency = currency;
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


    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }


    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }


    public String getKeyId() {
        return keyId;
    }


    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }


    public long getAmount() {
        return amount;
    }


    public void setAmount(long amount) {
        this.amount = amount;
    }


    public String getCurrency() {
        return currency;
    }


    public void setCurrency(String currency) {
        this.currency = currency;
    }
}