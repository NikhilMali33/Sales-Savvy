package com.salessavvy.app.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.request.VerifyPaymentRequest;
import com.salessavvy.app.dto.response.PaymentOrderResponseDTO;
import com.salessavvy.app.services.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ============================================================
    // CREATE RAZORPAY ORDER
    // ============================================================

    @PostMapping("/create-order/{orderId}")
    public ResponseEntity<PaymentOrderResponseDTO> createPaymentOrder(
            @PathVariable String orderId) {

        PaymentOrderResponseDTO response =
                paymentService.createRazorpayOrder(orderId);

        return ResponseEntity.ok(response);
    }
    
    
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody VerifyPaymentRequest request) {

        paymentService.verifyPayment(
                request.getOrderId(),
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        return ResponseEntity.ok(
                "Payment verified successfully"
        );
    }
}