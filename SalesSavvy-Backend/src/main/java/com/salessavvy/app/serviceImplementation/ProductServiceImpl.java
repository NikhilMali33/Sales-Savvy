package com.salessavvy.app.serviceImplementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salessavvy.app.dto.response.ProductResponseDTO;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.exception.ProductNotFoundException;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {

        List<Product> products = productRepository.findAll();

        List<ProductResponseDTO> response = new ArrayList<>();

        for (Product product : products) {

            ProductResponseDTO dto = mapToResponseDTO(product);

            response.add(dto);
        }

        return response;
    }

    @Override
    public ProductResponseDTO getProductById(Integer productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        return mapToResponseDTO(product);
    }

    private ProductResponseDTO mapToResponseDTO(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setProductId(product.getProductId());
        dto.setProductName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStock());
        dto.setStatus(product.getStatus());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getCategoryName());
        }

        return dto;
    }

    @Override
    public List<ProductResponseDTO> searchProducts(String keyword) {

        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);

        List<ProductResponseDTO> response = new ArrayList<>();

        for (Product product : products) {

            response.add(mapToResponseDTO(product));
        }

        return response;
    }

    @Override
    public List<ProductResponseDTO> getProductsByCategory(Integer categoryId) {

        List<Product> products =
                productRepository.findByCategoryCategoryId(categoryId);

        List<ProductResponseDTO> response = new ArrayList<>();

        for (Product product : products) {
            response.add(mapToResponseDTO(product));
        }

        return response;
    }
}