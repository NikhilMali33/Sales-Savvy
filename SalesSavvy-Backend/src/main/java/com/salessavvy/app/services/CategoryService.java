package com.salessavvy.app.services;

import java.util.List;

import com.salessavvy.app.entities.Category;
import com.salessavvy.app.enums.CategoryStatus;

public interface CategoryService {

    List<Category> getAllCategories();

    Category createCategory(Category category);

    Category updateCategory(
            Integer id,
            Category category
    );

    Category updateCategoryStatus(
            Integer id,
            CategoryStatus status
    );

    void deleteCategory(Integer id);
}