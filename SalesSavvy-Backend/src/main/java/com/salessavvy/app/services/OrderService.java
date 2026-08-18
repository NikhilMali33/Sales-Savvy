package com.salessavvy.app.services;

import java.util.List;

import com.salessavvy.app.dto.request.CreateOrderRequest;
import com.salessavvy.app.dto.response.OrderResponseDTO;

public interface OrderService {

    OrderResponseDTO createOrder(CreateOrderRequest request);

    List<OrderResponseDTO> getMyOrders();

    OrderResponseDTO getMyOrder(String orderId);

    void cancelOrder(String orderId);
}