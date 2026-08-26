package com.salessavvy.app.serviceImplementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salessavvy.app.entities.Category;
import com.salessavvy.app.enums.CategoryStatus;
import com.salessavvy.app.repositories.CategoryRepository;
import com.salessavvy.app.services.CategoryService;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository) {

        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {

        if (category == null) {
            throw new IllegalArgumentException(
                    "Category data is required."
            );
        }

        String categoryName =
                category.getCategoryName() == null
                        ? ""
                        : category.getCategoryName().trim();

        if (categoryName.isEmpty()) {
            throw new IllegalArgumentException(
                    "Category name is required."
            );
        }

        if (categoryRepository
                .findByCategoryName(categoryName)
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Category already exists."
            );
        }

        category.setCategoryId(null);
        category.setCategoryName(categoryName);

        if (category.getStatus() == null) {
            category.setStatus(CategoryStatus.ACTIVE);
        }

        LocalDateTime now = LocalDateTime.now();

        category.setCreatedAt(now);
        category.setUpdatedAt(now);

        category.setProducts(null);

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(
            Integer id,
            Category category) {

        Category existingCategory =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Category not found."
                                ));

        if (category == null) {
            throw new IllegalArgumentException(
                    "Category data is required."
            );
        }

        String categoryName =
                category.getCategoryName() == null
                        ? ""
                        : category.getCategoryName().trim();

        if (categoryName.isEmpty()) {
            throw new IllegalArgumentException(
                    "Category name is required."
            );
        }

        categoryRepository
                .findByCategoryName(categoryName)
                .ifPresent(foundCategory -> {

                    if (!foundCategory
                            .getCategoryId()
                            .equals(id)) {

                        throw new IllegalArgumentException(
                                "Category already exists."
                        );
                    }
                });

        existingCategory.setCategoryName(categoryName);

        existingCategory.setDescription(
                category.getDescription()
        );

        existingCategory.setImageUrl(
                category.getImageUrl()
        );

        if (category.getStatus() != null) {
            existingCategory.setStatus(
                    category.getStatus()
            );
        }

        existingCategory.setUpdatedAt(
                LocalDateTime.now()
        );

        return categoryRepository.save(existingCategory);
    }

    @Override
    public Category updateCategoryStatus(
            Integer id,
            CategoryStatus status) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Category not found."
                                ));

        if (status == null) {
            throw new IllegalArgumentException(
                    "Category status is required."
            );
        }

        category.setStatus(status);
        category.setUpdatedAt(LocalDateTime.now());

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Integer id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Category not found."
                                ));

        if (category.getProducts() != null &&
                !category.getProducts().isEmpty()) {

            throw new IllegalStateException(
                    "Cannot delete a category that contains products."
            );
        }

        categoryRepository.delete(category);
    }
}