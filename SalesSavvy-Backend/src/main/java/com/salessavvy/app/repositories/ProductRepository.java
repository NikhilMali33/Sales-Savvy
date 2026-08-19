package com.salessavvy.app.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salessavvy.app.entities.Category;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.enums.ProductStatus;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByCategory(Category category);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByNameContainingIgnoreCase(String keyword);
    
    List<Product> findByCategoryCategoryId(Integer categoryId);
    
    Optional<Product> findBySku(String sku);
    
    

}
