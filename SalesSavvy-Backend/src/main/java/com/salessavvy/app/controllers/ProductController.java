package com.salessavvy.app.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.response.ProductResponseDTO;
import com.salessavvy.app.services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {

        return productService.getAllProducts();
    }

    @GetMapping("/{productId}")
    public ProductResponseDTO getProductById(@PathVariable Integer productId) {

        return productService.getProductById(productId);
    }
    
    @GetMapping("/search")
    public List<ProductResponseDTO> searchProducts(@RequestParam String keyword) {

        return productService.searchProducts(keyword);
    }
    
    @GetMapping("/category/{categoryId}")
    public List<ProductResponseDTO> getProductsByCategory(@PathVariable Integer categoryId) {

        return productService.getProductsByCategory(categoryId);
    }
}