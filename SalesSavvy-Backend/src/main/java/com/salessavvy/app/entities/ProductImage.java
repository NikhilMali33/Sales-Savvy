package com.salessavvy.app.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "productimages")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "public_id", nullable = false)
    private String publicId;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    public ProductImage() {
    }

	public ProductImage(Integer imageId, String imageUrl, String publicId, Boolean isPrimary, Integer displayOrder,
			Product product) {
		super();
		this.imageId = imageId;
		this.imageUrl = imageUrl;
		this.publicId = publicId;
		this.isPrimary = isPrimary;
		this.displayOrder = displayOrder;
		this.product = product;
	}

	public ProductImage(String imageUrl, String publicId, Boolean isPrimary, Integer displayOrder, Product product) {
		super();
		this.imageUrl = imageUrl;
		this.publicId = publicId;
		this.isPrimary = isPrimary;
		this.displayOrder = displayOrder;
		this.product = product;
	}

	@Override
	public String toString() {
		return "ProductImage [imageId=" + imageId + ", imageUrl=" + imageUrl + ", publicId=" + publicId + ", isPrimary="
				+ isPrimary + ", displayOrder=" + displayOrder + ", product=" + product + "]";
	}
	
	 // Getters & Setters

	public Integer getImageId() {
		return imageId;
	}

	public void setImageId(Integer imageId) {
		this.imageId = imageId;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getPublicId() {
		return publicId;
	}

	public void setPublicId(String publicId) {
		this.publicId = publicId;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public void setIsPrimary(Boolean isPrimary) {
		this.isPrimary = isPrimary;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
    
    
    

   
}