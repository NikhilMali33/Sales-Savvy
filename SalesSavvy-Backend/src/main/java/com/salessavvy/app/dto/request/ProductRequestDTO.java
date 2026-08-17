package com.salessavvy.app.dto.request;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.salessavvy.app.app.enums.ProductStatus;

public class ProductRequestDTO {

	private String productName;

	private String description;

	private BigDecimal price;

	private BigDecimal discountPrice;

	private Integer stock;

	private String brand;

	private String sku;

	private String specifications;

	private String keywords;

	private Integer categoryId;

	private ProductStatus status;

	private List<MultipartFile> images;
	
	public ProductRequestDTO() {

	}

	public ProductRequestDTO(String productName, String description, BigDecimal price, BigDecimal discountPrice,
			Integer stock, String brand, String sku, String specifications, String keywords, Integer categoryId,
			ProductStatus status, List<MultipartFile> images) {
		super();
		this.productName = productName;
		this.description = description;
		this.price = price;
		this.discountPrice = discountPrice;
		this.stock = stock;
		this.brand = brand;
		this.sku = sku;
		this.specifications = specifications;
		this.keywords = keywords;
		this.categoryId = categoryId;
		this.status = status;
		this.images = images;
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

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
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

	public ProductStatus getStatus() {
		return status;
	}

	public void setStatus(ProductStatus status) {
		this.status = status;
	}

	public List<MultipartFile> getImages() {
		return images;
	}

	public void setImages(List<MultipartFile> images) {
		this.images = images;
	}
	
	
	
	
}
