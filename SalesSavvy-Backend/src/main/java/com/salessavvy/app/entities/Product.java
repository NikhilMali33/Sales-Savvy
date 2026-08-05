package com.salessavvy.app.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.salessavvy.app.app.enums.ProductStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String brand;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(length = 500)
    private String keywords;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    public Product() {
    }

	public Product(Integer productId, String name, String description, BigDecimal price, BigDecimal discountPrice,
			Integer stock, String brand, String sku, Double averageRating, Integer totalReviews, String specifications,
			String keywords, ProductStatus status, LocalDateTime createdAt, LocalDateTime updatedAt, Category category,
			List<ProductImage> images) {
		super();
		this.productId = productId;
		this.name = name;
		this.description = description;
		this.price = price;
		this.discountPrice = discountPrice;
		this.stock = stock;
		this.brand = brand;
		this.sku = sku;
		this.averageRating = averageRating;
		this.totalReviews = totalReviews;
		this.specifications = specifications;
		this.keywords = keywords;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.category = category;
		this.images = images;
	}

	public Product(String name, String description, BigDecimal price, BigDecimal discountPrice, Integer stock, String brand,
			String sku, Double averageRating, Integer totalReviews, String specifications, String keywords,
			ProductStatus status, LocalDateTime createdAt, LocalDateTime updatedAt, Category category,
			List<ProductImage> images) {
		super();
		this.name = name;
		this.description = description;
		this.price = price;
		this.discountPrice = discountPrice;
		this.stock = stock;
		this.brand = brand;
		this.sku = sku;
		this.averageRating = averageRating;
		this.totalReviews = totalReviews;
		this.specifications = specifications;
		this.keywords = keywords;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.category = category;
		this.images = images;
	}
	
	
	
	
	

	@Override
	public String toString() {
		return "Product [productId=" + productId + ", name=" + name + ", description=" + description + ", price="
				+ price + ", discountPrice=" + discountPrice + ", stock=" + stock + ", brand=" + brand + ", sku=" + sku
				+ ", averageRating=" + averageRating + ", totalReviews=" + totalReviews + ", specifications="
				+ specifications + ", keywords=" + keywords + ", status=" + status + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + ", category=" + category + ", images=" + images + "]";
	}
	
	// Getters & Setters

	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(Double averageRating) {
		this.averageRating = averageRating;
	}

	public Integer getTotalReviews() {
		return totalReviews;
	}

	public void setTotalReviews(Integer totalReviews) {
		this.totalReviews = totalReviews;
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

	public ProductStatus getStatus() {
		return status;
	}

	public void setStatus(ProductStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public List<ProductImage> getImages() {
		return images;
	}

	public void setImages(List<ProductImage> images) {
		this.images = images;
	}
    
    
    

    
	
}