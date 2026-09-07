package com.salessavvy.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.request.AddToCartRequest;
import com.salessavvy.app.dto.request.UpdateCartItemRequest;
import com.salessavvy.app.dto.response.CartResponseDTO;
import com.salessavvy.app.services.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    // GET CART
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart() {

        return ResponseEntity.ok(
                cartService.getCart()
        );
    }


    // ADD PRODUCT TO CART
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(@Valid @RequestBody AddToCartRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        cartService.addToCart(request)
                );
    }


    // UPDATE CART ITEM QUANTITY
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @PathVariable Integer cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        cartItemId,
                        request
                )
        );
    }


    // REMOVE CART ITEM
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<String> removeCartItem(
            @PathVariable Integer cartItemId) {

        cartService.removeCartItem(cartItemId);

        return ResponseEntity.ok(
                "Product removed from cart"
        );
    }


    // CLEAR CART
    @DeleteMapping
    public ResponseEntity<String> clearCart() {

        cartService.clearCart();

        return ResponseEntity.ok(
                "Cart cleared successfully"
        );
    }
}