package com.salessavvy.app.serviceImplementation;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.salessavvy.app.dto.response.PaymentOrderResponseDTO;
import com.salessavvy.app.entities.OrderItem;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.enums.PaymentStatus;
import com.salessavvy.app.exception.InsufficientStockException;
import com.salessavvy.app.exception.OrderException;
import com.salessavvy.app.exception.OrderNotFoundException;
import com.salessavvy.app.exception.PaymentException;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.PaymentService;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // CONSTRUCTOR
    public PaymentServiceImpl(
            RazorpayClient razorpayClient,
            OrderRepository orderRepository,
            UserRepository userRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {

        this.razorpayClient = razorpayClient;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    // GET LOGGED-IN USER
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new PaymentException(
                    "User is not authenticated");
        }

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new PaymentException(
                                "Logged-in user not found"));
    }

    // CREATE RAZORPAY ORDER
    @Override
    public PaymentOrderResponseDTO createRazorpayOrder(
            String orderId) {

        try {

            // Get logged-in user
            User user = getLoggedInUser();

            // Find Sales Savvy order
            com.salessavvy.app.entities.Order salesSavvyOrder =
                    orderRepository
                            .findByOrderIdAndUser(
                                    orderId,
                                    user)
                            .orElseThrow(() ->
                                    new OrderNotFoundException(
                                            "Order not found"));

            // Check payment status
            if (salesSavvyOrder.getPaymentStatus() != null &&
                    salesSavvyOrder.getPaymentStatus()
                            == PaymentStatus.SUCCESS) {

                throw new PaymentException(
                        "Payment has already been completed");
            }

            // Reuse existing Razorpay order
            if (salesSavvyOrder.getRazorpayOrderId() != null &&
                    !salesSavvyOrder
                            .getRazorpayOrderId()
                            .isBlank()) {

                BigDecimal totalAmount =
                        salesSavvyOrder.getTotalAmount();

                if (totalAmount == null ||
                        totalAmount.compareTo(
                                BigDecimal.ZERO) <= 0) {

                    throw new PaymentException(
                            "Invalid order amount");
                }

                long amountInPaise =
                        totalAmount
                                .multiply(
                                        BigDecimal.valueOf(100))
                                .longValueExact();

                return new PaymentOrderResponseDTO(
                        salesSavvyOrder.getOrderId(),
                        salesSavvyOrder.getRazorpayOrderId(),
                        getRazorpayKeyId(),
                        amountInPaise,
                        "INR");
            }

            // Validate amount
            BigDecimal totalAmount =
                    salesSavvyOrder.getTotalAmount();

            if (totalAmount == null ||
                    totalAmount.compareTo(
                            BigDecimal.ZERO) <= 0) {

                throw new PaymentException(
                        "Invalid order amount");
            }

            // Convert INR to paise
            long amountInPaise =
                    totalAmount
                            .multiply(
                                    BigDecimal.valueOf(100))
                            .longValueExact();

            // Create Razorpay order request
            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    amountInPaise);

            orderRequest.put(
                    "currency",
                    "INR");

            orderRequest.put(
                    "receipt",
                    salesSavvyOrder.getOrderId());

            // Create Razorpay order
            Order razorpayOrder =
                    razorpayClient.orders
                            .create(orderRequest);

            // Get Razorpay Order ID
            String razorpayOrderId =
                    razorpayOrder.get("id");

            if (razorpayOrderId == null ||
                    razorpayOrderId.isBlank()) {

                throw new PaymentException(
                        "Failed to generate Razorpay order ID");
            }

            // SAVE RAZORPAY ORDER ID
            salesSavvyOrder
                    .setRazorpayOrderId(
                            razorpayOrderId);

            orderRepository.save(
                    salesSavvyOrder);

            // Return response
            return new PaymentOrderResponseDTO(
                    salesSavvyOrder.getOrderId(),
                    razorpayOrderId,
                    getRazorpayKeyId(),
                    amountInPaise,
                    "INR");

        } catch (
                PaymentException |
                OrderNotFoundException e) {

            // Preserve our domain exceptions
            throw e;

        } catch (Exception e) {

            // Convert unexpected Razorpay/system errors
            throw new PaymentException(
                    "Failed to create Razorpay order",
                    e);
        }
    }

    // VERIFY RAZORPAY PAYMENT
    @Override
    public void verifyPayment(
            String orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        try {

            // Get logged-in user
            User user = getLoggedInUser();

            // Find Sales Savvy order
            com.salessavvy.app.entities.Order salesSavvyOrder =
                    orderRepository
                            .findByOrderIdAndUser(
                                    orderId,
                                    user)
                            .orElseThrow(() ->
                                    new OrderNotFoundException(
                                            "Order not found"));

            // Check if payment is already successful
            if (salesSavvyOrder.getPaymentStatus()
                    == PaymentStatus.SUCCESS) {

                throw new PaymentException(
                        "Payment has already been verified");
            }

            // Validate Razorpay Order ID
            if (salesSavvyOrder.getRazorpayOrderId() == null ||
                    !salesSavvyOrder
                            .getRazorpayOrderId()
                            .equals(razorpayOrderId)) {

                throw new PaymentException(
                        "Invalid Razorpay order ID");
            }

            // Validate Payment ID
            if (razorpayPaymentId == null ||
                    razorpayPaymentId.isBlank()) {

                throw new PaymentException(
                        "Razorpay payment ID is missing");
            }

            // Validate Signature
            if (razorpaySignature == null ||
                    razorpaySignature.isBlank()) {

                throw new PaymentException(
                        "Razorpay signature is missing");
            }

            // Verify Razorpay Signature
            String secret = getRazorpayKeySecret();

            if (secret == null || secret.isBlank()) {

                throw new PaymentException(
                        "Razorpay secret is not configured");
            }

            JSONObject attributes =
                    new JSONObject();

            attributes.put(
                    "razorpay_order_id",
                    razorpayOrderId);

            attributes.put(
                    "razorpay_payment_id",
                    razorpayPaymentId);

            attributes.put(
                    "razorpay_signature",
                    razorpaySignature);

            boolean signatureValid =
                    Utils.verifyPaymentSignature(
                            attributes,
                            secret);

            // PAYMENT FAILED
            if (!signatureValid) {

                salesSavvyOrder.setPaymentStatus(
                        PaymentStatus.FAILED);

                orderRepository.save(
                        salesSavvyOrder);

                throw new PaymentException(
                        "Invalid Razorpay payment signature");
            }

            // PAYMENT SUCCESS
            if (salesSavvyOrder.getOrderItems() == null ||
                    salesSavvyOrder
                            .getOrderItems()
                            .isEmpty()) {

                throw new OrderException(
                        "Order contains no items");
            }

            // Re-check stock for every ordered product
            for (OrderItem orderItem :
                    salesSavvyOrder.getOrderItems()) {

                Product product =
                        orderItem.getProduct();

                if (product == null) {

                    throw new OrderException(
                            "Product not found for order item");
                }

                if (product.getStatus() == null ||
                        !product.getStatus()
                                .name()
                                .equals("ACTIVE")) {

                    throw new OrderException(
                            "Product is no longer available: "
                                    + product.getName());
                }

                if (product.getStock() == null ||
                        product.getStock()
                                < orderItem.getQuantity()) {

                    throw new InsufficientStockException(
                            "Insufficient stock for product: "
                                    + product.getName());
                }
            }

            // Reduce stock
            for (OrderItem orderItem :
                    salesSavvyOrder.getOrderItems()) {

                Product product =
                        orderItem.getProduct();

                int newStock =
                        product.getStock()
                                - orderItem.getQuantity();

                product.setStock(newStock);

                productRepository.save(product);
            }

            // Mark payment as successful
            salesSavvyOrder.setPaymentStatus(
                    PaymentStatus.SUCCESS);

            salesSavvyOrder.setStatus(
                    OrderStatus.CONFIRMED);

            salesSavvyOrder.setRazorpayPaymentId(
                    razorpayPaymentId);

            // Save updated order
            orderRepository.save(
                    salesSavvyOrder);

            // Remove ONLY purchased products from cart
            for (OrderItem orderItem :
                    salesSavvyOrder.getOrderItems()) {

                Product product =
                        orderItem.getProduct();

                cartItemRepository
                        .deleteByUserAndProduct(
                                user,
                                product);
            }

        } catch (
                PaymentException |
                OrderNotFoundException |
                InsufficientStockException |
                OrderException e) {

            // Preserve our domain exceptions
            throw e;

        } catch (Exception e) {

            // Convert unexpected Razorpay/system errors
            throw new PaymentException(
                    "Payment verification failed",
                    e);
        }
    }

    // GET RAZORPAY KEY ID
    private String getRazorpayKeyId() {

        return System.getenv(
                "RAZORPAY_KEY_ID");
    }

    // GET RAZORPAY SECRET
    private String getRazorpayKeySecret() {

        return System.getenv(
                "RAZORPAY_KEY_SECRET");
    }
}