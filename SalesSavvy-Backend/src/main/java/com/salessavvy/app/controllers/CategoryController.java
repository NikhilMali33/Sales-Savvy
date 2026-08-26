package com.salessavvy.app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;	
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.salessavvy.app.entities.Category;
import com.salessavvy.app.enums.CategoryStatus;
import com.salessavvy.app.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category) {

        Category createdCategory =
                categoryService.createCategory(category);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category) {

        Category updatedCategory =
                categoryService.updateCategory(id, category);

        return ResponseEntity.ok(updatedCategory);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Category> updateCategoryStatus(
            @PathVariable Integer id,
            @RequestBody Category category) {

        Category updatedCategory =
                categoryService.updateCategoryStatus(
                        id,
                        category.getStatus()
                );

        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Integer id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}