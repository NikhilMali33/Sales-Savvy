package com.salessavvy.app.controllers.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.response.AdminOrderResponseDTO;
import com.salessavvy.app.services.AdminOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {

        this.adminOrderService = adminOrderService;
    }


    // GET ALL ORDERS
    @GetMapping
    public ResponseEntity<List<AdminOrderResponseDTO>> getAllOrders() {

        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }


    // GET SINGLE ORDER
    @GetMapping("/{orderId}")
    public ResponseEntity<AdminOrderResponseDTO> getOrder( @PathVariable String orderId) {

        return ResponseEntity.ok(adminOrderService.getOrder(orderId));
    }


    // UPDATE ORDER STATUS
    @PutMapping("/{orderId}/status")
    public ResponseEntity<AdminOrderResponseDTO> updateOrderStatus(@PathVariable String orderId, @RequestBody String status) {

        return ResponseEntity.ok(adminOrderService.updateOrderStatus(orderId, status));
    }
}