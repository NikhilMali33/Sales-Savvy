package com.salessavvy.app.dto.response;

public class ProductImageResponseDTO {

    private Integer imageId;

    private String imageUrl;

    private Boolean isPrimary;

    private Integer displayOrder;


    public ProductImageResponseDTO() {
    }


    public ProductImageResponseDTO(
            Integer imageId,
            String imageUrl,
            Boolean isPrimary,
            Integer displayOrder) {

        this.imageId = imageId;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
    }


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
}