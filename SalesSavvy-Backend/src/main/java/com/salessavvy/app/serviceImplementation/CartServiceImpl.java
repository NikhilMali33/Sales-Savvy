package com.salessavvy.app.serviceImplementation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.dto.request.AddToCartRequest;
import com.salessavvy.app.dto.request.UpdateCartItemRequest;
import com.salessavvy.app.dto.response.CartItemResponseDTO;
import com.salessavvy.app.dto.response.CartResponseDTO;
import com.salessavvy.app.entities.CartItem;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.ProductImage;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.exception.InsufficientStockException;
import com.salessavvy.app.repositories.CartItemRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.CartService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // ============================================================
    // GET CURRENT LOGGED-IN USER
    // ============================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"));
    }


    // ============================================================
    // GET CART
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public CartResponseDTO getCart() {

        User user = getLoggedInUser();

        List<CartItem> cartItems =
                cartItemRepository.findByUser(user);

        return buildCartResponse(cartItems);
    }


    // ============================================================
    // ADD TO CART
    // ============================================================

    @Override
    public CartResponseDTO addToCart(
            AddToCartRequest request) {

        User user = getLoggedInUser();

        if (request.getProductId() == null) {

            throw new RuntimeException(
                    "Product ID is required");
        }

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero");
        }


        // Find product

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"));


        // Check product status

        if (product.getStatus() == null ||
                !product.getStatus().name().equals("ACTIVE")) {

            throw new RuntimeException(
                    "Product is currently unavailable");
        }


        // Check stock

        if (product.getStock() <= 0) {

            throw new RuntimeException(
                    "Product is out of stock");
        }


        // Find existing cart item

        CartItem cartItem =
                cartItemRepository
                        .findByUserAndProduct(
                                user,
                                product)
                        .orElse(null);


        int requestedQuantity =
                request.getQuantity();


        // Existing cart item

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity()
                            + requestedQuantity;

            if (newQuantity > product.getStock()) {

                throw new InsufficientStockException(
                        "Requested quantity exceeds available stock");
            }

            cartItem.setQuantity(newQuantity);

        } else {

            if (requestedQuantity > product.getStock()) {

                throw new InsufficientStockException(
                        "Requested quantity exceeds available stock");
            }

            cartItem = new CartItem();

            cartItem.setUser(user);

            cartItem.setProduct(product);

            cartItem.setQuantity(requestedQuantity);
        }


        cartItemRepository.save(cartItem);


        // Return updated cart

        List<CartItem> cartItems =
                cartItemRepository.findByUser(user);

        return buildCartResponse(cartItems);
    }


    // ============================================================
    // UPDATE CART ITEM QUANTITY
    // ============================================================

    @Override
    public CartResponseDTO updateCartItem(
            Integer cartItemId,
            UpdateCartItemRequest request) {

        User user = getLoggedInUser();

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero");
        }


        CartItem cartItem =
                cartItemRepository
                        .findByIdAndUser(
                                cartItemId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"));


        Product product =
                cartItem.getProduct();


        // Check product status

        if (product.getStatus() == null ||
                !product.getStatus().name().equals("ACTIVE")) {

            throw new RuntimeException(
                    "Product is currently unavailable");
        }


        // Check stock

        if (request.getQuantity() >
                product.getStock()) {

            throw new InsufficientStockException(
                    "Requested quantity exceeds available stock");
        }


        cartItem.setQuantity(
                request.getQuantity());


        cartItemRepository.save(cartItem);


        List<CartItem> cartItems =
                cartItemRepository.findByUser(user);

        return buildCartResponse(cartItems);
    }


    // ============================================================
    // REMOVE CART ITEM
    // ============================================================

    @Override
    public void removeCartItem(
            Integer cartItemId) {

        User user = getLoggedInUser();

        CartItem cartItem =
                cartItemRepository
                        .findByIdAndUser(
                                cartItemId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"));

        cartItemRepository.delete(cartItem);
    }


    // ============================================================
    // CLEAR CART
    // ============================================================

    @Override
    public void clearCart() {

        User user = getLoggedInUser();

        cartItemRepository.deleteByUser(user);
    }


    // ============================================================
    // BUILD CART RESPONSE
    // ============================================================

    private CartResponseDTO buildCartResponse(
            List<CartItem> cartItems) {

        List<CartItemResponseDTO> responseItems =
                new ArrayList<>();

        int totalItems = 0;

        BigDecimal totalAmount =
                BigDecimal.ZERO;


        for (CartItem cartItem : cartItems) {

            Product product =
                    cartItem.getProduct();

            CartItemResponseDTO dto =
                    new CartItemResponseDTO();


            // Cart item ID

            dto.setCartItemId(
                    cartItem.getId());


            // Product information

            dto.setProductId(
                    product.getProductId());

            dto.setProductName(
                    product.getName());

            dto.setBrand(
                    product.getBrand());


            // Price

            dto.setPrice(
                    product.getPrice());

            dto.setDiscountPrice(
                    product.getDiscountPrice());


            // Quantity

            dto.setQuantity(
                    cartItem.getQuantity());


            // Product image

            String imageUrl = null;

            if (product.getImages() != null &&
                    !product.getImages().isEmpty()) {

                for (ProductImage image :
                        product.getImages()) {

                    if (Boolean.TRUE.equals(
                            image.getIsPrimary())) {

                        imageUrl =
                                image.getImageUrl();

                        break;
                    }
                }


                // If no primary image exists,
                // use the first image.

                if (imageUrl == null) {

                    imageUrl =
                            product.getImages()
                                    .get(0)
                                    .getImageUrl();
                }
            }

            dto.setImageUrl(imageUrl);


            // Effective price

            BigDecimal effectivePrice =
                    product.getPrice();

            if (product.getDiscountPrice() != null &&
                    product.getDiscountPrice()
                            .compareTo(product.getPrice()) < 0) {

                effectivePrice =
                        product.getDiscountPrice();
            }


            // Item total

            BigDecimal itemTotal =
                    effectivePrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()));

            dto.setItemTotal(itemTotal);


            // Cart totals

            totalItems +=
                    cartItem.getQuantity();

            totalAmount =
                    totalAmount.add(itemTotal);


            responseItems.add(dto);
        }


        CartResponseDTO response =
                new CartResponseDTO();

        response.setItems(responseItems);

        response.setTotalItems(totalItems);

        response.setTotalAmount(totalAmount);

        return response;
    }
}