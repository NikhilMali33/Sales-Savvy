package com.salessavvy.app.services;

import com.salessavvy.app.dto.request.AddToCartRequest;
import com.salessavvy.app.dto.request.UpdateCartItemRequest;
import com.salessavvy.app.dto.response.CartResponseDTO;

public interface CartService {

    CartResponseDTO getCart();

    CartResponseDTO addToCart(
            AddToCartRequest request);

    CartResponseDTO updateCartItem(
            Integer cartItemId,
            UpdateCartItemRequest request);

    void removeCartItem(
            Integer cartItemId);

    void clearCart();
}