package com.salessavvy.app.serviceImplementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salessavvy.app.dto.response.ProductResponseDTO;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.ProductImage;
import com.salessavvy.app.exception.ProductNotFoundException;
import com.salessavvy.app.repositories.ProductImageRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            ProductImageRepository productImageRepository) {

        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }


    @Override
    public List<ProductResponseDTO> getAllProducts() {

        List<Product> products = productRepository.findAll();

        List<ProductResponseDTO> response = new ArrayList<>();

        for (Product product : products) {

            ProductResponseDTO dto =
                    mapToResponseDTO(product);

            response.add(dto);
        }

        return response;
    }


    @Override
    public ProductResponseDTO getProductById(Integer productId) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ProductNotFoundException(
                                        "Product not found with id: "
                                                + productId));

        return mapToResponseDTO(product);
    }


    private ProductResponseDTO mapToResponseDTO(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        // Basic product information
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getName());
        dto.setDescription(product.getDescription());

        // Pricing
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());

        // Inventory
        dto.setStockQuantity(product.getStock());

        // Product information
        dto.setBrand(product.getBrand());
        dto.setSku(product.getSku());

        // Additional information
        dto.setSpecifications(product.getSpecifications());
        dto.setKeywords(product.getKeywords());

        // Status
        dto.setStatus(product.getStatus());


        // Category
        if (product.getCategory() != null) {

            dto.setCategoryId(
                    product.getCategory().getCategoryId()
            );

            dto.setCategoryName(
                    product.getCategory().getCategoryName()
            );
        }


        // Images
        List<ProductImage> images =
                productImageRepository.findByProduct(product);

        if (!images.isEmpty()) {

            List<String> imageUrls =
                    new ArrayList<>();

            for (ProductImage image : images) {

                imageUrls.add(
                        image.getImageUrl()
                );
            }

            dto.setImageUrls(imageUrls);
        }


        return dto;
    }


    @Override
    public List<ProductResponseDTO> searchProducts(
            String keyword) {

        List<Product> products =
                productRepository
                        .findByNameContainingIgnoreCase(keyword);

        List<ProductResponseDTO> response =
                new ArrayList<>();

        for (Product product : products) {

            response.add(
                    mapToResponseDTO(product)
            );
        }

        return response;
    }


    @Override
    public List<ProductResponseDTO> getProductsByCategory(
            Integer categoryId) {

        List<Product> products =
                productRepository
                        .findByCategoryCategoryId(categoryId);

        List<ProductResponseDTO> response =
                new ArrayList<>();

        for (Product product : products) {

            response.add(
                    mapToResponseDTO(product)
            );
        }

        return response;
    }
}