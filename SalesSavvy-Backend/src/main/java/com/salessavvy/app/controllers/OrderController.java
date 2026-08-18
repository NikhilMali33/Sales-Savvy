package com.salessavvy.app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.request.CreateOrderRequest;
import com.salessavvy.app.dto.response.OrderResponseDTO;
import com.salessavvy.app.services.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    // ============================================================
    // CREATE ORDER FROM CART
    // ============================================================

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @RequestBody CreateOrderRequest request) {

        OrderResponseDTO response =
                orderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================================================
    // GET ALL ORDERS OF LOGGED-IN USER
    // ============================================================

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {

        return ResponseEntity.ok(
                orderService.getMyOrders()
        );
    }


    // ============================================================
    // GET SINGLE ORDER
    // ============================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getMyOrder(
            @PathVariable String orderId) {

        return ResponseEntity.ok(
                orderService.getMyOrder(orderId)
        );
    }


    // ============================================================
    // CANCEL ORDER
    // ============================================================

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> cancelOrder(
            @PathVariable String orderId) {

        orderService.cancelOrder(orderId);

        return ResponseEntity.ok(
                "Order cancelled successfully"
        );
    }
}