package com.salessavvy.app.dto.response;

import java.math.BigDecimal;

import com.salessavvy.app.app.enums.ProductStatus;

public class ProductResponseDTO {

    private Integer productId;

    private String productName;

    private String description;

    private BigDecimal price;

    private Integer stockQuantity;

    private String categoryName;

    private String imageUrl;

    private ProductStatus status;
    
     public ProductResponseDTO() {
		// TODO Auto-generated constructor stub
	}

	 public ProductResponseDTO(Integer productId, String productName, String description, BigDecimal price,
			Integer stockQuantity, String categoryName, String imageUrl, ProductStatus status) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.stockQuantity = stockQuantity;
		this.categoryName = categoryName;
		this.imageUrl = imageUrl;
		this.status = status;
	 }

	 public ProductResponseDTO(String productName, String description, BigDecimal price, Integer stockQuantity,
			String categoryName, String imageUrl, ProductStatus status) {
		super();
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.stockQuantity = stockQuantity;
		this.categoryName = categoryName;
		this.imageUrl = imageUrl;
		this.status = status;
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

	 public Integer getStockQuantity() {
		 return stockQuantity;
	 }

	 public void setStockQuantity(Integer stockQuantity) {
		 this.stockQuantity = stockQuantity;
	 }

	 public String getCategoryName() {
		 return categoryName;
	 }

	 public void setCategoryName(String categoryName) {
		 this.categoryName = categoryName;
	 }

	 public String getImageUrl() {
		 return imageUrl;
	 }

	 public void setImageUrl(String imageUrl) {
		 this.imageUrl = imageUrl;
	 }

	 public ProductStatus getStatus() {
		 return status;
	 }

	 public void setStatus(ProductStatus status) {
		 this.status = status;
	 }
     
     
}
