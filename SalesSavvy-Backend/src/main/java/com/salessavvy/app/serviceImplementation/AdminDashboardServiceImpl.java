package com.salessavvy.app.serviceImplementation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.dto.response.AdminDashboardResponseDTO;
import com.salessavvy.app.dto.response.AdminLowStockProductResponseDTO;
import com.salessavvy.app.dto.response.AdminRecentOrderResponseDTO;
import com.salessavvy.app.dto.response.AdminRecentUserResponseDTO;
import com.salessavvy.app.dto.response.AdminSalesDataDTO;
import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.OrderStatus;
import com.salessavvy.app.enums.PaymentStatus;
import com.salessavvy.app.repositories.OrderRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.AdminDashboardService;

@Service
@Transactional
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponseDTO getDashboard() {

        List<User> users = userRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();

        long totalUsers = users.size();

        long totalOrders = orders.size();

        long totalProducts = products.size();

        BigDecimal totalRevenue = orders.stream()
                .filter(order ->
                        order.getPaymentStatus() == PaymentStatus.SUCCESS)
                .map(Order::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long placedOrders = countOrdersByStatus(
                orders,
                OrderStatus.PLACED
        );

        long confirmedOrders = countOrdersByStatus(
                orders,
                OrderStatus.CONFIRMED
        );

        long shippedOrders = countOrdersByStatus(
                orders,
                OrderStatus.SHIPPED
        );

        long deliveredOrders = countOrdersByStatus(
                orders,
                OrderStatus.DELIVERED
        );

        long cancelledOrders = countOrdersByStatus(
                orders,
                OrderStatus.CANCELLED
        );

        List<AdminRecentOrderResponseDTO> recentOrders =
                orders.stream()
                        .sorted(
                                Comparator.comparing(
                                        Order::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(5)
                        .map(this::convertToRecentOrderDTO)
                        .collect(Collectors.toList());

        List<AdminRecentUserResponseDTO> recentUsers =
                users.stream()
                        .sorted(
                                Comparator.comparing(
                                        User::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(5)
                        .map(this::convertToRecentUserDTO)
                        .collect(Collectors.toList());

        List<AdminLowStockProductResponseDTO> lowStockProducts =
                products.stream()
                        .filter(product ->
                                product.getStock() != null &&
                                product.getStock() <= 5)
                        .sorted(
                                Comparator.comparing(
                                        Product::getStock,
                                        Comparator.nullsLast(
                                                Comparator.naturalOrder()
                                        )
                                )
                        )
                        .limit(5)
                        .map(this::convertToLowStockProductDTO)
                        .collect(Collectors.toList());

        List<AdminSalesDataDTO> salesData =
                generateSalesData(orders);

        return new AdminDashboardResponseDTO(
                totalUsers,
                totalOrders,
                totalRevenue,
                totalProducts,
                placedOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                recentOrders,
                recentUsers,
                lowStockProducts,
                salesData
        );
    }

    private List<AdminSalesDataDTO> generateSalesData(
            List<Order> orders) {

        LocalDate today = LocalDate.now();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<LocalDate, BigDecimal> revenueByDate =
                new LinkedHashMap<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate date = today.minusDays(i);

            revenueByDate.put(
                    date,
                    BigDecimal.ZERO
            );
        }

        orders.stream()
                .filter(order ->
                        order.getPaymentStatus() == PaymentStatus.SUCCESS)
                .filter(order ->
                        order.getCreatedAt() != null)
                .forEach(order -> {

                    LocalDate orderDate =
                            order.getCreatedAt().toLocalDate();

                    if (revenueByDate.containsKey(orderDate)) {

                        BigDecimal currentRevenue =
                                revenueByDate.get(orderDate);

                        BigDecimal orderAmount =
                                order.getTotalAmount() != null
                                        ? order.getTotalAmount()
                                        : BigDecimal.ZERO;

                        revenueByDate.put(
                                orderDate,
                                currentRevenue.add(orderAmount)
                        );
                    }
                });

        List<AdminSalesDataDTO> salesData =
                new ArrayList<>();

        revenueByDate.forEach((date, revenue) -> {

            salesData.add(
                    new AdminSalesDataDTO(
                            date.format(formatter),
                            revenue
                    )
            );
        });

        return salesData;
    }

    private long countOrdersByStatus(
            List<Order> orders,
            OrderStatus status) {

        return orders.stream()
                .filter(order -> order.getStatus() == status)
                .count();
    }

    private AdminRecentOrderResponseDTO convertToRecentOrderDTO(
            Order order) {

        return new AdminRecentOrderResponseDTO(
                order.getOrderId(),
                order.getUser().getUserId(),
                order.getUser().getUsername(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getPaymentStatus().name(),
                order.getCreatedAt()
        );
    }

    private AdminRecentUserResponseDTO convertToRecentUserDTO(
            User user) {

        return new AdminRecentUserResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }

    private AdminLowStockProductResponseDTO convertToLowStockProductDTO(
            Product product) {

        return new AdminLowStockProductResponseDTO(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getStock(),
                product.getStatus().name()
        );
    }
}