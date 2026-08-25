package com.salessavvy.app.serviceImplementation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.dto.response.UserDetailsResponseDTO;
import com.salessavvy.app.dto.response.UserOrderResponseDTO;
import com.salessavvy.app.dto.response.UserResponseDTO;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.AdminUserService;

@Service
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;


    // CONSTRUCTOR
    public AdminUserServiceImpl(
            UserRepository userRepository,
            OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }


    // GET ALL USERS
    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserResponseDTO> response = new ArrayList<>();


        for (User user : users) {

            UserResponseDTO dto = new UserResponseDTO();

            dto.setUserid(user.getUserId());

            dto.setUsername( user.getUsername());

            dto.setEmail(user.getEmail());

            dto.setRole(user.getRole().name() );

            response.add(dto);
        }


        return response;
    }


    // GET SINGLE USER WITH DETAILS
    @Override
    @Transactional(readOnly = true)
    public UserDetailsResponseDTO getUserById(
            int userId) {


        // Find user
        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->new RuntimeException("User not found"));


        // Find user's orders
        List<Order> orders =  orderRepository.findByUserOrderByCreatedAtDesc(user);


        // Create response DTO
        UserDetailsResponseDTO dto = new UserDetailsResponseDTO();


        // Account information
        dto.setUserid(user.getUserId());

        dto.setUsername(user.getUsername());

        dto.setEmail(user.getEmail());

        dto.setRole(user.getRole().name());

        dto.setCreatedAt(user.getCreatedAt());

        dto.setUpdatedAt(user.getUpdatedAt());

        // Order count
        dto.setTotalOrders(orders.size());


        // Total amount spent
        BigDecimal totalSpent = orders.stream().map(Order::getTotalAmount).filter(amount -> amount != null).reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        dto.setTotalSpent(totalSpent.doubleValue());


        // Convert orders to response DTOs
        List<UserOrderResponseDTO> orderResponses = new ArrayList<>();

        for (Order order : orders) {

            UserOrderResponseDTO orderDTO = new UserOrderResponseDTO();

            orderDTO.setOrderId(order.getOrderId());

            orderDTO.setTotalAmount(order.getTotalAmount());

            orderDTO.setStatus(order.getStatus() != null ? order.getStatus().name() : null);

            orderDTO.setPaymentStatus(
                    order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null);


            orderDTO.setCreatedAt(order.getCreatedAt());


            orderResponses.add(orderDTO);
        }


        dto.setOrders(orderResponses);

        return dto;
    }
}