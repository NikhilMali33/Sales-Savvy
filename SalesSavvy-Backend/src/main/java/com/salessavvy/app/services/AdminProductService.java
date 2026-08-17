package com.salessavvy.app.services;

import java.io.IOException;
import java.util.List;

import com.salessavvy.app.dto.request.ProductRequestDTO;
import com.salessavvy.app.dto.response.ProductResponseDTO;

public interface AdminProductService {

    ProductResponseDTO addProduct(
            ProductRequestDTO request)
            throws IOException;

    ProductResponseDTO updateProduct(
            Integer productId,
            ProductRequestDTO request)
            throws IOException;

    void deleteProduct(
            Integer productId)
            throws IOException;

    void deleteProductImage(
            Integer productId,
            Integer imageId)
            throws IOException;

    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(
            Integer productId);
}