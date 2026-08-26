package com.salessavvy.app.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardResponseDTO {

    private long totalUsers;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalProducts;

    private long placedOrders;
    private long confirmedOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private long cancelledOrders;

    private List<AdminRecentOrderResponseDTO> recentOrders;
    private List<AdminRecentUserResponseDTO> recentUsers;
    private List<AdminLowStockProductResponseDTO> lowStockProducts;
    private List<AdminSalesDataDTO> salesData;

    public AdminDashboardResponseDTO() {
    }

    public AdminDashboardResponseDTO(
            long totalUsers,
            long totalOrders,
            BigDecimal totalRevenue,
            long totalProducts,
            long placedOrders,
            long confirmedOrders,
            long shippedOrders,
            long deliveredOrders,
            long cancelledOrders,
            List<AdminRecentOrderResponseDTO> recentOrders,
            List<AdminRecentUserResponseDTO> recentUsers,
            List<AdminLowStockProductResponseDTO> lowStockProducts,
            List<AdminSalesDataDTO> salesData) {

        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalProducts = totalProducts;
        this.placedOrders = placedOrders;
        this.confirmedOrders = confirmedOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.recentOrders = recentOrders;
        this.recentUsers = recentUsers;
        this.lowStockProducts = lowStockProducts;
        this.salesData = salesData;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getPlacedOrders() {
        return placedOrders;
    }

    public void setPlacedOrders(long placedOrders) {
        this.placedOrders = placedOrders;
    }

    public long getConfirmedOrders() {
        return confirmedOrders;
    }

    public void setConfirmedOrders(long confirmedOrders) {
        this.confirmedOrders = confirmedOrders;
    }

    public long getShippedOrders() {
        return shippedOrders;
    }

    public void setShippedOrders(long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public List<AdminRecentOrderResponseDTO> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(
            List<AdminRecentOrderResponseDTO> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<AdminRecentUserResponseDTO> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(
            List<AdminRecentUserResponseDTO> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<AdminLowStockProductResponseDTO> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(
            List<AdminLowStockProductResponseDTO> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<AdminSalesDataDTO> getSalesData() {
        return salesData;
    }

    public void setSalesData(List<AdminSalesDataDTO> salesData) {
        this.salesData = salesData;
    }
}