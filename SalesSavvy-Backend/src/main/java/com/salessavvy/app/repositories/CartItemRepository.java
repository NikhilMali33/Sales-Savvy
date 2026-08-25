package com.salessavvy.app.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salessavvy.app.entities.CartItem;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.User;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // Get all cart items belonging to a user
    List<CartItem> findByUser(User user);

    // Check whether the product is already in the user's cart
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    // Find a specific cart item belonging to the logged-in user
    Optional<CartItem> findByIdAndUser(Integer id, User user);

    // Clear the user's entire cart
    void deleteByUser(User user);

    // Remove only a specific product from the user's cart
    void deleteByUserAndProduct(User user, Product product);
}