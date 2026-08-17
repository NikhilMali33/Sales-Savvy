package com.salessavvy.app.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salessavvy.app.entities.Product;
import com.salessavvy.app.entities.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {

    List<ProductImage> findByProduct(Product product);
    
    Optional<ProductImage> findByImageIdAndProduct_ProductId(Integer imageId, Integer productId
    );

}
