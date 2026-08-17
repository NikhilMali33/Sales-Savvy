package com.salessavvy.app.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.salessavvy.app.app.enums.ProductStatus;

public class ProductResponseDTO {

    private Integer productId;

    private String productName;

    private String description;

    private BigDecimal price;

    private BigDecimal discountPrice;

    private Integer stockQuantity;

    private String brand;

    private String sku;

    private String specifications;

    private String keywords;

    private Integer categoryId;

    private String categoryName;

    private List<String> imageUrls;
    
    private List<ProductImageResponseDTO> images;

    private ProductStatus status;


    public ProductResponseDTO() {
    }


    public ProductResponseDTO(
            Integer productId,
            String productName,
            String description,
            BigDecimal price,
            BigDecimal discountPrice,
            Integer stockQuantity,
            String brand,
            String sku,
            String specifications,
            String keywords,
            Integer categoryId,
            String categoryName,
            List<String> imageUrls,
            ProductStatus status,
            List<ProductImageResponseDTO> images) {

        this.productId = productId;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.discountPrice = discountPrice;
        this.stockQuantity = stockQuantity;
        this.brand = brand;
        this.sku = sku;
        this.specifications = specifications;
        this.keywords = keywords;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrls = imageUrls;
        this.status = status;
        this.images = images;
    }


    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }


    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }


    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }


    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }


    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }


    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }


    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }


    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }


    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }


    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
    
    public List<ProductImageResponseDTO> getImages() {
        return images;
    }

    public void setImages(List<ProductImageResponseDTO> images) {
        this.images = images;
    }
}