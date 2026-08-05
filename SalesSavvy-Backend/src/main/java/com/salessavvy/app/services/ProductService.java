package com.salessavvy.app.services;

import java.util.List;

import com.salessavvy.app.dto.response.ProductResponseDTO;

public interface ProductService {

    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(Integer productId);
    
    List<ProductResponseDTO> searchProducts(String keyword);
    
    List<ProductResponseDTO> getProductsByCategory(Integer categoryId);

}