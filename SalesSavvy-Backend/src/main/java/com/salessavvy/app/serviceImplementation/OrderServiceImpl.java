package com.salessavvy.app.serviceImplementation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.dto.request.CreateOrderRequest;
import com.salessavvy.app.dto.response.OrderItemResponseDTO;
import com.salessavvy.app.dto.response.OrderResponseDTO;
import com.salessavvy.app.entities.CartItem;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.OrderItem;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.OrderService;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public OrderServiceImpl(
            OrderRepository orderRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }


    // ============================================================
    // GET LOGGED-IN USER
    // ============================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated");
        }

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"));
    }


    // ============================================================
    // CREATE ORDER FROM CART
    // ============================================================

    @Override
    public OrderResponseDTO createOrder(
            CreateOrderRequest request) {

        User user = getLoggedInUser();

        List<CartItem> cartItems =
                cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cannot create order because cart is empty");
        }

        BigDecimal orderTotal =
                BigDecimal.ZERO;

        List<OrderItem> orderItems =
                new ArrayList<>();


        // ========================================================
        // PROCESS CART ITEMS
        // ========================================================

        for (CartItem cartItem : cartItems) {

            Product product =
                    cartItem.getProduct();


            // ----------------------------------------------------
            // Check product status
            // ----------------------------------------------------

            if (product.getStatus() == null ||
                    !product.getStatus()
                            .name()
                            .equals("ACTIVE")) {

                throw new RuntimeException(
                        "Product is currently unavailable: "
                                + product.getName());
            }


            // ----------------------------------------------------
            // Check stock
            // ----------------------------------------------------

            if (product.getStock() == null ||
                    product.getStock() <= 0) {

                throw new RuntimeException(
                        "Product is out of stock: "
                                + product.getName());
            }


            // ----------------------------------------------------
            // Check requested quantity
            // ----------------------------------------------------

            if (cartItem.getQuantity() >
                    product.getStock()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName());
            }


            // ----------------------------------------------------
            // Determine effective price
            // ----------------------------------------------------

            BigDecimal effectivePrice =
                    product.getPrice();

            if (product.getDiscountPrice() != null &&
                    product.getDiscountPrice()
                            .compareTo(product.getPrice()) < 0) {

                effectivePrice =
                        product.getDiscountPrice();
            }


            // ----------------------------------------------------
            // Calculate item total
            // ----------------------------------------------------

            BigDecimal itemTotal =
                    effectivePrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()));


            // ----------------------------------------------------
            // Create OrderItem
            // ----------------------------------------------------

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setProduct(product);

            orderItem.setQuantity(
                    cartItem.getQuantity());

            orderItem.setPricePerUnit(
                    effectivePrice);

            orderItem.setTotalPrice(
                    itemTotal);

            orderItems.add(orderItem);


            // ----------------------------------------------------
            // Add to order total
            // ----------------------------------------------------

            orderTotal =
                    orderTotal.add(itemTotal);


            // ----------------------------------------------------
            // REDUCE PRODUCT STOCK
            // ----------------------------------------------------

            product.setStock(
                    product.getStock()
                            - cartItem.getQuantity());

            productRepository.save(product);
        }


        // ========================================================
        // CREATE ORDER
        // ========================================================

        String orderId =
                "SS-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        Order order =
                new Order();

        order.setOrderId(orderId);

        order.setUser(user);

        order.setTotalAmount(orderTotal);


        // --------------------------------------------------------
        // Order lifecycle starts at PLACED
        // --------------------------------------------------------

        order.setStatus(
                OrderStatus.PLACED);


        // --------------------------------------------------------
        // Payment status remains PENDING
        // Order.java initializes it as PENDING
        // --------------------------------------------------------


        // ========================================================
        // CONNECT ORDER ITEMS TO ORDER
        // ========================================================

        for (OrderItem orderItem : orderItems) {

            orderItem.setOrder(order);
        }

        order.setOrderItems(orderItems);


        // ========================================================
        // SAVE ORDER
        // ========================================================

        Order savedOrder =
                orderRepository.save(order);


        // ========================================================
        // CLEAR CART
        // ========================================================

        cartItemRepository.deleteByUser(user);


        // ========================================================
        // RETURN RESPONSE
        // ========================================================

        return mapToResponseDTO(savedOrder);
    }


    // ============================================================
    // GET MY ORDERS
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getMyOrders() {

        User user =
                getLoggedInUser();

        List<Order> orders =
                orderRepository.findByUser(user);

        List<OrderResponseDTO> response =
                new ArrayList<>();

        for (Order order : orders) {

            response.add(
                    mapToResponseDTO(order));
        }

        return response;
    }


    // ============================================================
    // GET SINGLE ORDER
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getMyOrder(
            String orderId) {

        User user =
                getLoggedInUser();

        Order order =
                orderRepository
                        .findByOrderIdAndUser(
                                orderId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));

        return mapToResponseDTO(order);
    }


    // ============================================================
    // CANCEL ORDER
    // ============================================================

    @Override
    public void cancelOrder(
            String orderId) {

        User user =
                getLoggedInUser();


        // --------------------------------------------------------
        // Find order
        // --------------------------------------------------------

        Order order =
                orderRepository
                        .findByOrderIdAndUser(
                                orderId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));


        // --------------------------------------------------------
        // Only PLACED orders can be cancelled
        // --------------------------------------------------------

        if (order.getStatus() !=
                OrderStatus.PLACED) {

            throw new RuntimeException(
                    "Order cannot be cancelled at this stage");
        }


        // ========================================================
        // RESTORE PRODUCT STOCK
        // ========================================================

        if (order.getOrderItems() != null) {

            for (OrderItem orderItem :
                    order.getOrderItems()) {

                Product product =
                        orderItem.getProduct();

                if (product != null) {

                    int currentStock =
                            product.getStock() == null
                                    ? 0
                                    : product.getStock();

                    int restoredStock =
                            currentStock
                                    + orderItem.getQuantity();

                    product.setStock(
                            restoredStock);

                    productRepository.save(
                            product);
                }
            }
        }


        // ========================================================
        // MARK ORDER AS CANCELLED
        // ========================================================

        order.setStatus(
                OrderStatus.CANCELLED);

        orderRepository.save(order);
    }


    // ============================================================
    // MAP ORDER → RESPONSE DTO
    // ============================================================

    private OrderResponseDTO mapToResponseDTO(
            Order order) {

        OrderResponseDTO dto =
                new OrderResponseDTO();


        // --------------------------------------------------------
        // Basic order information
        // --------------------------------------------------------

        dto.setOrderId(
                order.getOrderId());

        dto.setTotalAmount(
                order.getTotalAmount());

        dto.setStatus(
                order.getStatus());

        dto.setPaymentStatus(
                order.getPaymentStatus());

        dto.setCreatedAt(
                order.getCreatedAt());


        // ========================================================
        // ORDER ITEMS
        // ========================================================

        List<OrderItemResponseDTO> itemResponses =
                new ArrayList<>();

        if (order.getOrderItems() != null) {

            for (OrderItem item :
                    order.getOrderItems()) {

                OrderItemResponseDTO itemDTO =
                        new OrderItemResponseDTO();


                itemDTO.setId(
                        item.getId());


                itemDTO.setProductId(
                        item.getProduct()
                                .getProductId());


                itemDTO.setProductName(
                        item.getProduct()
                                .getName());


                itemDTO.setQuantity(
                        item.getQuantity());


                itemDTO.setPricePerUnit(
                        item.getPricePerUnit());


                itemDTO.setTotalPrice(
                        item.getTotalPrice());


                itemResponses.add(
                        itemDTO);
            }
        }


        dto.setItems(
                itemResponses);


        return dto;
    }
}