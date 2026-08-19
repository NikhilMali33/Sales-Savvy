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
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.enums.PaymentStatus;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.PaymentService;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public PaymentServiceImpl(
            RazorpayClient razorpayClient,
            OrderRepository orderRepository,
            UserRepository userRepository,
            CartItemRepository cartItemRepository) {

        this.razorpayClient = razorpayClient;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
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

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"));
    }


    // ============================================================
    // CREATE RAZORPAY ORDER
    // ============================================================

    @Override
    public PaymentOrderResponseDTO createRazorpayOrder(
            String orderId) {

        try {

            // ----------------------------------------------------
            // Get logged-in user
            // ----------------------------------------------------

            User user = getLoggedInUser();


            // ----------------------------------------------------
            // Find Sales Savvy order
            // ----------------------------------------------------

            com.salessavvy.app.entities.Order salesSavvyOrder =
                    orderRepository
                            .findByOrderIdAndUser(
                                    orderId,
                                    user)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"));


            // ----------------------------------------------------
            // Check payment status
            // ----------------------------------------------------

            if (salesSavvyOrder.getPaymentStatus() != null &&
                    salesSavvyOrder.getPaymentStatus()
                            == PaymentStatus.SUCCESS) {

                throw new RuntimeException(
                        "Payment has already been completed");
            }


            // ----------------------------------------------------
            // Reuse existing Razorpay order
            // ----------------------------------------------------

            if (salesSavvyOrder.getRazorpayOrderId() != null &&
                    !salesSavvyOrder
                            .getRazorpayOrderId()
                            .isBlank()) {

                BigDecimal totalAmount =
                        salesSavvyOrder.getTotalAmount();

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


            // ----------------------------------------------------
            // Validate amount
            // ----------------------------------------------------

            BigDecimal totalAmount =
                    salesSavvyOrder.getTotalAmount();

            if (totalAmount == null ||
                    totalAmount.compareTo(
                            BigDecimal.ZERO) <= 0) {

                throw new RuntimeException(
                        "Invalid order amount");
            }


            // ----------------------------------------------------
            // Convert INR to paise
            // ----------------------------------------------------

            long amountInPaise =
                    totalAmount
                            .multiply(
                                    BigDecimal.valueOf(100))
                            .longValueExact();


            // ----------------------------------------------------
            // Create Razorpay order request
            // ----------------------------------------------------

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


            // ----------------------------------------------------
            // Create Razorpay order
            // ----------------------------------------------------

            Order razorpayOrder =
                    razorpayClient.orders.create(
                            orderRequest);


            // ----------------------------------------------------
            // Get Razorpay Order ID
            // ----------------------------------------------------

            String razorpayOrderId =
                    razorpayOrder.get("id");


            // ----------------------------------------------------
            // SAVE RAZORPAY ORDER ID
            // ----------------------------------------------------

            salesSavvyOrder.setRazorpayOrderId(
                    razorpayOrderId);

            orderRepository.save(
                    salesSavvyOrder);


            // ----------------------------------------------------
            // Return response
            // ----------------------------------------------------

            return new PaymentOrderResponseDTO(
                    salesSavvyOrder.getOrderId(),
                    razorpayOrderId,
                    getRazorpayKeyId(),
                    amountInPaise,
                    "INR");

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Razorpay order: "
                            + e.getMessage(),
                    e);
        }
    }


    // ============================================================
    // VERIFY RAZORPAY PAYMENT
    // ============================================================

    @Override
    public void verifyPayment(
            String orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        try {

            // ----------------------------------------------------
            // Get logged-in user
            // ----------------------------------------------------

            User user = getLoggedInUser();


            // ----------------------------------------------------
            // Find Sales Savvy order
            // ----------------------------------------------------

            com.salessavvy.app.entities.Order salesSavvyOrder =
                    orderRepository
                            .findByOrderIdAndUser(
                                    orderId,
                                    user)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"));


            // ----------------------------------------------------
            // Check if payment is already successful
            // ----------------------------------------------------

            if (salesSavvyOrder.getPaymentStatus()
                    == PaymentStatus.SUCCESS) {

                throw new RuntimeException(
                        "Payment has already been verified");
            }


            // ----------------------------------------------------
            // Validate Razorpay Order ID
            // ----------------------------------------------------

            if (salesSavvyOrder.getRazorpayOrderId() == null ||
                    !salesSavvyOrder
                            .getRazorpayOrderId()
                            .equals(razorpayOrderId)) {

                throw new RuntimeException(
                        "Invalid Razorpay order ID");
            }


            // ----------------------------------------------------
            // Validate Payment ID
            // ----------------------------------------------------

            if (razorpayPaymentId == null ||
                    razorpayPaymentId.isBlank()) {

                throw new RuntimeException(
                        "Razorpay payment ID is missing");
            }


            // ----------------------------------------------------
            // Validate Signature
            // ----------------------------------------------------

            if (razorpaySignature == null ||
                    razorpaySignature.isBlank()) {

                throw new RuntimeException(
                        "Razorpay signature is missing");
            }


            // ----------------------------------------------------
            // Verify Razorpay Signature
            // ----------------------------------------------------

            String secret =
                    getRazorpayKeySecret();

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


            // ----------------------------------------------------
            // PAYMENT FAILED
            // ----------------------------------------------------

            if (!signatureValid) {

                salesSavvyOrder.setPaymentStatus(
                        PaymentStatus.FAILED);

                orderRepository.save(
                        salesSavvyOrder);

                throw new RuntimeException(
                        "Invalid Razorpay payment signature");
            }


            // ----------------------------------------------------
            // PAYMENT SUCCESS
            // ----------------------------------------------------

            salesSavvyOrder.setPaymentStatus(
                    PaymentStatus.SUCCESS);

            salesSavvyOrder.setStatus(
                    OrderStatus.CONFIRMED);

            salesSavvyOrder.setRazorpayPaymentId(
                    razorpayPaymentId);


            // ----------------------------------------------------
            // SAVE UPDATED ORDER
            // ----------------------------------------------------

            orderRepository.save(
                    salesSavvyOrder);


            // ----------------------------------------------------
            // CLEAR CART ONLY AFTER SUCCESSFUL PAYMENT
            // ----------------------------------------------------

            cartItemRepository.deleteByUser(user);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Payment verification failed: "
                            + e.getMessage(),
                    e);
        }
    }


    // ============================================================
    // GET RAZORPAY KEY ID
    // ============================================================

    private String getRazorpayKeyId() {

        return System.getenv(
                "RAZORPAY_KEY_ID");
    }


    // ============================================================
    // GET RAZORPAY SECRET
    // ============================================================

    private String getRazorpayKeySecret() {

        return System.getenv(
                "RAZORPAY_KEY_SECRET");
    }
}