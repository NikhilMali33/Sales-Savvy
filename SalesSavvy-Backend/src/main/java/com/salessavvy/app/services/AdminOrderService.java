package com.salessavvy.app.services;

import java.util.List;

import com.salessavvy.app.dto.response.AdminOrderResponseDTO;

public interface AdminOrderService {

    List<AdminOrderResponseDTO> getAllOrders();

    AdminOrderResponseDTO getOrder(String orderId);

    AdminOrderResponseDTO updateOrderStatus(String orderId, String status);
}