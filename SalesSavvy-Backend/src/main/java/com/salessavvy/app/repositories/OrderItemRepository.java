package com.salessavvy.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);
}