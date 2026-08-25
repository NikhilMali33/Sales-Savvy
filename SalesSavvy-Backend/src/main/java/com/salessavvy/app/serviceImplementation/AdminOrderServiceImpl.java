package com.salessavvy.app.serviceImplementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.dto.response.AdminOrderItemResponseDTO;
import com.salessavvy.app.dto.response.AdminOrderResponseDTO;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.OrderItem;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.services.AdminOrderService;

@Service
@Transactional
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderServiceImpl(OrderRepository orderRepository) {

        this.orderRepository = orderRepository;
    }


    // GET ALL ORDERS
    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderResponseDTO> getAllOrders() {

        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // GET SINGLE ORDER
    @Override
    @Transactional(readOnly = true)
    public AdminOrderResponseDTO getOrder(String orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found: " + orderId
                        )
                );

        return convertToDTO(order);
    }


 // UPDATE ORDER STATUS
 @Override
 @Transactional
 public AdminOrderResponseDTO updateOrderStatus(
         String orderId,
         String status) {

     Order order = orderRepository.findById(orderId)
             .orElseThrow(() ->
                     new RuntimeException(
                             "Order not found: " + orderId
                     )
             );

     // Remove JSON quotes if the request body contains them
     String cleanStatus = status
             .replace("\"", "")
             .trim()
             .toUpperCase();

     try {

         order.setStatus(
                 com.salessavvy.app.enums.OrderStatus.valueOf(
                         cleanStatus
                 )
         );

     } catch (IllegalArgumentException e) {

         throw new RuntimeException(
                 "Invalid order status: " + status
         );
     }

     Order updatedOrder = orderRepository.save(order);

     return convertToDTO(updatedOrder);
 }

    // CONVERT ORDER TO DTO
    private AdminOrderResponseDTO convertToDTO(Order order) {

        List<AdminOrderItemResponseDTO> orderItems =
                order.getOrderItems()
                        .stream()
                        .map(this::convertOrderItemToDTO)
                        .collect(Collectors.toList());


        return new AdminOrderResponseDTO(

                order.getOrderId(),

                order.getUser().getUserId(),

                order.getUser().getUsername(),

                order.getUser().getEmail(),

                order.getTotalAmount(),

                order.getStatus().name(),

                order.getPaymentStatus().name(),

                order.getCreatedAt(),

                orderItems
        );
    }


    // CONVERT ORDER ITEM TO DTO
    private AdminOrderItemResponseDTO convertOrderItemToDTO(
            OrderItem orderItem) {

        return new AdminOrderItemResponseDTO(

                orderItem.getId(),

                String.valueOf(
                        orderItem.getProduct().getProductId()
                ),

                orderItem.getProduct().getName(),

                orderItem.getQuantity(),

                orderItem.getPricePerUnit(),

                orderItem.getTotalPrice()
        );
    }
}