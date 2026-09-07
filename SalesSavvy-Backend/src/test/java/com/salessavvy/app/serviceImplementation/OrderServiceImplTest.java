package com.salessavvy.app.serviceImplementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.salessavvy.app.dto.request.CreateOrderRequest;
import com.salessavvy.app.dto.response.OrderResponseDTO;
import com.salessavvy.app.entities.CartItem;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.enums.ProductStatus;
import com.salessavvy.app.exception.InsufficientStockException;
import com.salessavvy.app.exception.OrderException;
import com.salessavvy.app.exception.OrderNotFoundException;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;

/**
 * Unit tests for OrderServiceImpl.
 *
 * These tests use Mockito to fake the repositories, so no real database
 * is needed. We only test the SERVICE LOGIC — the rules around when an
 * order can be created or cancelled.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    private OrderServiceImpl orderService;

    private User testUser;

    @BeforeEach
    void setUp() {

        orderService = new OrderServiceImpl(
                orderRepository,
                cartItemRepository,
                userRepository,
                productRepository);

        testUser = new User();
        testUser.setUserId(1);
        testUser.setUsername("testuser");

        // Fake a logged-in user so getLoggedInUser() inside the service works
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
        // Always clear the security context so tests don't leak into each other
        SecurityContextHolder.clearContext();
    }

    private Product activeProductWithStock(int stock, BigDecimal price) {

        Product product = new Product();
        product.setProductId(100);
        product.setName("Test Product");
        product.setPrice(price);
        product.setStock(stock);
        product.setStatus(ProductStatus.ACTIVE);
        return product;
    }

    // ============================================================
    // createOrder
    // ============================================================

    @Test
    void createOrder_whenCartIsEmpty_throwsOrderException() {

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of());

        assertThatThrownBy(() ->
                orderService.createOrder(new CreateOrderRequest()))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("cart is empty");
    }

    @Test
    void createOrder_whenProductIsInactive_throwsOrderException() {

        Product inactiveProduct = activeProductWithStock(10, BigDecimal.valueOf(500));
        inactiveProduct.setStatus(ProductStatus.INACTIVE);

        CartItem cartItem = new CartItem();
        cartItem.setProduct(inactiveProduct);
        cartItem.setQuantity(1);

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of(cartItem));

        assertThatThrownBy(() ->
                orderService.createOrder(new CreateOrderRequest()))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("unavailable");
    }

    @Test
    void createOrder_whenProductOutOfStock_throwsInsufficientStockException() {

        Product outOfStockProduct = activeProductWithStock(0, BigDecimal.valueOf(500));

        CartItem cartItem = new CartItem();
        cartItem.setProduct(outOfStockProduct);
        cartItem.setQuantity(1);

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of(cartItem));

        assertThatThrownBy(() ->
                orderService.createOrder(new CreateOrderRequest()))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("out of stock");
    }

    @Test
    void createOrder_whenRequestedQuantityExceedsStock_throwsInsufficientStockException() {

        Product product = activeProductWithStock(2, BigDecimal.valueOf(500));

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(5); // more than available stock

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of(cartItem));

        assertThatThrownBy(() ->
                orderService.createOrder(new CreateOrderRequest()))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void createOrder_whenCartIsValid_createsOrderWithCorrectTotal() {

        Product product = activeProductWithStock(10, BigDecimal.valueOf(500));

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(3); // 3 x 500 = 1500

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of(cartItem));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponseDTO response =
                orderService.createOrder(new CreateOrderRequest());

        assertThat(response.getTotalAmount())
                .isEqualByComparingTo(BigDecimal.valueOf(1500));

        assertThat(response.getStatus())
                .isEqualTo(OrderStatus.PLACED);

        assertThat(response.getItems())
                .hasSize(1);

        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_usesDiscountPriceWhenLowerThanRegularPrice() {

        Product product = activeProductWithStock(10, BigDecimal.valueOf(500));
        product.setDiscountPrice(BigDecimal.valueOf(400));

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(2); // should use 400, not 500 -> total 800

        when(cartItemRepository.findByUser(testUser))
                .thenReturn(List.of(cartItem));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponseDTO response =
                orderService.createOrder(new CreateOrderRequest());

        assertThat(response.getTotalAmount())
                .isEqualByComparingTo(BigDecimal.valueOf(800));
    }

    // ============================================================
    // cancelOrder
    // ============================================================

    @Test
    void cancelOrder_whenOrderNotFound_throwsOrderNotFoundException() {

        when(orderRepository.findByOrderIdAndUser("SS-MISSING", testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                orderService.cancelOrder("SS-MISSING"))
                .isInstanceOf(OrderNotFoundException.class);
    }

    @Test
    void cancelOrder_whenOrderIsAlreadyShipped_throwsOrderException() {

        Order shippedOrder = new Order();
        shippedOrder.setOrderId("SS-SHIPPED1");
        shippedOrder.setStatus(OrderStatus.SHIPPED);

        when(orderRepository.findByOrderIdAndUser("SS-SHIPPED1", testUser))
                .thenReturn(Optional.of(shippedOrder));

        assertThatThrownBy(() ->
                orderService.cancelOrder("SS-SHIPPED1"))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("cannot be cancelled");
    }

    @Test
    void cancelOrder_whenOrderIsPlaced_marksOrderAsCancelled() {

        Order placedOrder = new Order();
        placedOrder.setOrderId("SS-PLACED01");
        placedOrder.setStatus(OrderStatus.PLACED);

        when(orderRepository.findByOrderIdAndUser("SS-PLACED01", testUser))
                .thenReturn(Optional.of(placedOrder));

        orderService.cancelOrder("SS-PLACED01");

        assertThat(placedOrder.getStatus())
                .isEqualTo(OrderStatus.CANCELLED);

        verify(orderRepository).save(placedOrder);
    }
}