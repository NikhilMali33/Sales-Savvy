package com.salessavvy.app.serviceImplementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.OrderItem;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.enums.PaymentStatus;
import com.salessavvy.app.enums.ProductStatus;
import com.salessavvy.app.exception.InsufficientStockException;
import com.salessavvy.app.exception.OrderException;
import com.salessavvy.app.exception.PaymentException;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;

/**
 * Unit tests for PaymentServiceImpl.verifyPayment.
 *
 * This is the most important method to test in the whole app: it is the
 * one place where real money is confirmed and stock is permanently
 * reduced. All Razorpay-signature verification is mocked out using
 * Mockito's mockStatic, since Utils.verifyPaymentSignature is a static
 * method from the Razorpay SDK.
 */
@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private RazorpayClient razorpayClient;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    private PaymentServiceImpl paymentService;

    private User testUser;

    private static final String ORDER_ID = "SS-TEST0001";
    private static final String RAZORPAY_ORDER_ID = "order_TESTABC123";
    private static final String RAZORPAY_PAYMENT_ID = "pay_TESTXYZ789";
    private static final String RAZORPAY_SIGNATURE = "fake_signature_value";
    private static final String TEST_SECRET = "test_razorpay_secret";

    @BeforeEach
    void setUp() {

        paymentService = new PaymentServiceImpl(
                razorpayClient,
                orderRepository,
                userRepository,
                cartItemRepository,
                productRepository);

        // Inject the @Value fields directly since there is no Spring context in a unit test
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "test_key_id");

        testUser = new User();
        testUser.setUserId(1);
        testUser.setUsername("testuser");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "testuser", null, List.of());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private Order orderReadyForPayment(Product product, int quantity) {

        Order order = new Order();
        order.setOrderId(ORDER_ID);
        order.setUser(testUser);
        order.setTotalAmount(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setStatus(OrderStatus.PLACED);
        order.setRazorpayOrderId(RAZORPAY_ORDER_ID);

        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setPricePerUnit(product.getPrice());
        item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

        order.setOrderItems(List.of(item));

        return order;
    }

    private Product activeProduct(int stock) {

        Product product = new Product();
        product.setProductId(100);
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(999));
        product.setStock(stock);
        product.setStatus(ProductStatus.ACTIVE);
        return product;
    }

    // ============================================================
    // verifyPayment
    // ============================================================

    @Test
    void verifyPayment_whenAlreadySuccessful_throwsPaymentException() {

        Product product = activeProduct(10);
        Order order = orderReadyForPayment(product, 1);
        order.setPaymentStatus(PaymentStatus.SUCCESS); // already paid

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        assertThatThrownBy(() ->
                paymentService.verifyPayment(
                        ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE))
                .isInstanceOf(PaymentException.class)
                .hasMessageContaining("already been verified");
    }

    @Test
    void verifyPayment_whenRazorpayOrderIdDoesNotMatch_throwsPaymentException() {

        Product product = activeProduct(10);
        Order order = orderReadyForPayment(product, 1);
        order.setRazorpayOrderId("order_DIFFERENT_ID");

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        assertThatThrownBy(() ->
                paymentService.verifyPayment(
                        ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE))
                .isInstanceOf(PaymentException.class)
                .hasMessageContaining("Invalid Razorpay order ID");
    }

    @Test
    void verifyPayment_whenSignatureIsInvalid_marksOrderFailedAndThrows() {

        Product product = activeProduct(10);
        Order order = orderReadyForPayment(product, 1);

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        try (MockedStatic<Utils> utils = mockStatic(Utils.class)) {

            utils.when(() ->
                    Utils.verifyPaymentSignature(any(JSONObject.class), eq(TEST_SECRET)))
                    .thenReturn(false); // simulate a forged/invalid signature

            assertThatThrownBy(() ->
                    paymentService.verifyPayment(
                            ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Invalid Razorpay payment signature");
        }

        // Order must be marked FAILED, and stock must NOT be touched
        assertThat(order.getPaymentStatus())
                .isEqualTo(PaymentStatus.FAILED);

        verify(productRepository, org.mockito.Mockito.never())
                .save(any(Product.class));
    }

    @Test
    void verifyPayment_whenStockDroppedBelowOrderedQuantity_throwsInsufficientStockException() {

        // Product had enough stock when the order was placed, but it's now too low
        // (e.g. someone else bought the last units before this payment was confirmed)
        Product product = activeProduct(0);
        Order order = orderReadyForPayment(product, 1);

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        try (MockedStatic<Utils> utils = mockStatic(Utils.class)) {

            utils.when(() ->
                    Utils.verifyPaymentSignature(any(JSONObject.class), eq(TEST_SECRET)))
                    .thenReturn(true);

            assertThatThrownBy(() ->
                    paymentService.verifyPayment(
                            ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE))
                    .isInstanceOf(InsufficientStockException.class);
        }

        // Payment must NOT be marked successful when stock ran out
        assertThat(order.getPaymentStatus())
                .isNotEqualTo(PaymentStatus.SUCCESS);
    }

    @Test
    void verifyPayment_whenProductNoLongerActive_throwsOrderException() {

        Product product = activeProduct(10);
        product.setStatus(ProductStatus.INACTIVE);
        Order order = orderReadyForPayment(product, 1);

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        try (MockedStatic<Utils> utils = mockStatic(Utils.class)) {

            utils.when(() ->
                    Utils.verifyPaymentSignature(any(JSONObject.class), eq(TEST_SECRET)))
                    .thenReturn(true);

            assertThatThrownBy(() ->
                    paymentService.verifyPayment(
                            ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE))
                    .isInstanceOf(OrderException.class)
                    .hasMessageContaining("no longer available");
        }
    }

    @Test
    void verifyPayment_whenValid_marksOrderConfirmedAndReducesStock() {

        Product product = activeProduct(10);
        Order order = orderReadyForPayment(product, 3);

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        try (MockedStatic<Utils> utils = mockStatic(Utils.class)) {

            utils.when(() ->
                    Utils.verifyPaymentSignature(any(JSONObject.class), eq(TEST_SECRET)))
                    .thenReturn(true);

            paymentService.verifyPayment(
                    ORDER_ID, RAZORPAY_ORDER_ID, RAZORPAY_PAYMENT_ID, RAZORPAY_SIGNATURE);
        }

        // Order should now be confirmed and paid
        assertThat(order.getPaymentStatus()).isEqualTo(PaymentStatus.SUCCESS);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(order.getRazorpayPaymentId()).isEqualTo(RAZORPAY_PAYMENT_ID);

        // Stock should be reduced by the quantity that was ordered (10 - 3 = 7)
        assertThat(product.getStock()).isEqualTo(7);

        verify(productRepository).save(product);
        verify(orderRepository).save(order);
        verify(cartItemRepository).deleteByUserAndProduct(testUser, product);
    }

    @Test
    void verifyPayment_whenMissingPaymentId_throwsPaymentException() {

        Product product = activeProduct(10);
        Order order = orderReadyForPayment(product, 1);

        when(orderRepository.findByOrderIdAndUser(ORDER_ID, testUser))
                .thenReturn(Optional.of(order));

        assertThatThrownBy(() ->
                paymentService.verifyPayment(
                        ORDER_ID, RAZORPAY_ORDER_ID, "", RAZORPAY_SIGNATURE))
                .isInstanceOf(PaymentException.class)
                .hasMessageContaining("payment ID is missing");
    }
}