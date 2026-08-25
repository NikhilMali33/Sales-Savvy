package com.salessavvy.app.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salessavvy.app.entities.Order;
import com.salessavvy.app.entities.User;

public interface OrderRepository extends JpaRepository<Order, String> {

	 List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByOrderIdAndUser(String orderId, User user);
   
    List<Order> findAllByOrderByCreatedAtDesc();
    
    
}