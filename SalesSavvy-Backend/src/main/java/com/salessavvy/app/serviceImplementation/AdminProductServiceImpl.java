package com.salessavvy.app.serviceImplementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.salessavvy.app.dto.request.ProductRequestDTO;
import com.salessavvy.app.dto.response.ProductImageResponseDTO;
import com.salessavvy.app.dto.response.ProductResponseDTO;
import com.salessavvy.app.entities.Category;
import com.salessavvy.app.entities.Product;
import com.salessavvy.app.repositories.CategoryRepository;
import com.salessavvy.app.repositories.ProductImageRepository;
import com.salessavvy.app.repositories.ProductRepository;
import com.salessavvy.app.services.AdminProductService;
import com.salessavvy.app.services.CloudinaryService;

import java.util.Map;

import com.salessavvy.app.entities.ProductImage;

@Service
public class AdminProductServiceImpl implements AdminProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final ProductImageRepository productImageRepository;
	private final CloudinaryService cloudinaryService;

	public AdminProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,
			ProductImageRepository productImageRepository, CloudinaryService cloudinaryService) {

		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.productImageRepository = productImageRepository;
		this.cloudinaryService = cloudinaryService;
	}

	@Override
	@Transactional
	public ProductResponseDTO addProduct(ProductRequestDTO request) throws IOException {

		// Validate Category
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));

		// Check SKU
		if (productRepository.findBySku(request.getSku()).isPresent()) {
			throw new RuntimeException("SKU already exists");
		}

		// Create Product
		Product product = new Product();

		product.setName(request.getProductName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setDiscountPrice(request.getDiscountPrice());
		product.setStock(request.getStock());
		product.setBrand(request.getBrand());
		product.setSku(request.getSku());
		product.setSpecifications(request.getSpecifications());
		product.setKeywords(request.getKeywords());
		product.setStatus(request.getStatus());
		product.setCategory(category);

		// Save Product
		Product savedProduct = productRepository.save(product);

		// Upload Images
		if (request.getImages() != null && !request.getImages().isEmpty()) {

			int displayOrder = 1;

			for (int i = 0; i < request.getImages().size(); i++) {

				Map<String, Object> uploadResult = cloudinaryService.uploadImage(request.getImages().get(i));

				ProductImage image = new ProductImage();

				image.setImageUrl((String) uploadResult.get("secure_url"));
				image.setPublicId((String) uploadResult.get("public_id"));

				image.setProduct(savedProduct);

				image.setDisplayOrder(displayOrder++);

				image.setIsPrimary(i == 0);

				productImageRepository.save(image);

				savedProduct.getImages().add(image);
			}
		}

		return mapToResponseDTO(savedProduct);
	}

	@Override
	@Transactional
	public ProductResponseDTO updateProduct(
	        Integer productId,
	        ProductRequestDTO request)
	        throws IOException {

	    // ============================
	    // FIND PRODUCT
	    // ============================

	    Product product = productRepository.findById(productId)
	            .orElseThrow(() ->
	                    new RuntimeException(
	                            "Product not found with id: "
	                                    + productId
	                    )
	            );


	    // ============================
	    // FIND CATEGORY
	    // ============================

	    Category category =
	            categoryRepository.findById(
	                    request.getCategoryId()
	            )
	            .orElseThrow(() ->
	                    new RuntimeException(
	                            "Category not found with id: "
	                                    + request.getCategoryId()
	                    )
	            );


	    // ============================
	    // CHECK SKU
	    // ============================

	    if (!product.getSku().equals(request.getSku())) {

	        if (productRepository
	                .findBySku(request.getSku())
	                .isPresent()) {

	            throw new RuntimeException(
	                    "SKU already exists"
	            );
	        }
	    }


	    // ============================
	    // UPDATE PRODUCT FIELDS
	    // ============================

	    product.setName(
	            request.getProductName()
	    );

	    product.setDescription(
	            request.getDescription()
	    );

	    product.setPrice(
	            request.getPrice()
	    );

	    product.setDiscountPrice(
	            request.getDiscountPrice()
	    );

	    product.setStock(
	            request.getStock()
	    );

	    product.setBrand(
	            request.getBrand()
	    );

	    product.setSku(
	            request.getSku()
	    );

	    product.setSpecifications(
	            request.getSpecifications()
	    );

	    product.setKeywords(
	            request.getKeywords()
	    );

	    product.setStatus(
	            request.getStatus()
	    );

	    product.setCategory(
	            category
	    );


	    // Save product
	    Product updatedProduct =
	            productRepository.save(product);


	    // ============================
	    // ADD NEW IMAGES
	    // ============================

	    if (request.getImages() != null
	            && !request.getImages().isEmpty()) {

	        List<ProductImage> existingImages =
	                productImageRepository
	                        .findByProduct(product);


	        int displayOrder =
	                existingImages.size() + 1;


	        boolean hasPrimary =
	                existingImages.stream()
	                        .anyMatch(image ->
	                                Boolean.TRUE.equals(
	                                        image.getIsPrimary()
	                                )
	                        );


	        for (MultipartFile file :
	                request.getImages()) {

	            Map<String, Object> uploadResult =
	                    cloudinaryService.uploadImage(file);


	            ProductImage image =
	                    new ProductImage();


	            image.setImageUrl(
	                    (String) uploadResult.get(
	                            "secure_url"
	                    )
	            );


	            image.setPublicId(
	                    (String) uploadResult.get(
	                            "public_id"
	                    )
	            );


	            image.setProduct(product);


	            image.setDisplayOrder(
	                    displayOrder++
	            );


	            /*
	             * Keep existing primary image.
	             *
	             * If there is no primary image,
	             * make the first new image primary.
	             */

	            if (!hasPrimary) {

	                image.setIsPrimary(true);

	                hasPrimary = true;

	            } else {

	                image.setIsPrimary(false);

	            }


	            productImageRepository.save(image);

	            product.getImages().add(image);
	        }
	    }


	    // ============================
	    // RETURN UPDATED PRODUCT
	    // ============================

	    return mapToResponseDTO(updatedProduct);
	}
	@Override
	@Transactional
	public void deleteProduct(Integer productId) throws IOException {

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		for (ProductImage image : product.getImages()) {
			cloudinaryService.deleteImage(image.getPublicId());
		}

		productRepository.delete(product);
	}

	@Override
	@Transactional
	public void deleteProductImage(Integer productId, Integer imageId) throws IOException {

		ProductImage image = productImageRepository.findByImageIdAndProduct_ProductId(imageId, productId)
				.orElseThrow(() -> new RuntimeException("Product image not found"));

		boolean wasPrimary = Boolean.TRUE.equals(image.getIsPrimary());

		// Delete image from Cloudinary
		if (image.getPublicId() != null) {

			cloudinaryService.deleteImage(image.getPublicId());
		}

		// Remove from product collection
		Product product = image.getProduct();

		product.getImages().remove(image);

		// Delete image record from database
		productImageRepository.delete(image);

		/*
		 * If the deleted image was primary, make another remaining image primary.
		 */
		if (wasPrimary) {

			List<ProductImage> remainingImages = productImageRepository.findByProduct(product);

			if (!remainingImages.isEmpty()) {

				ProductImage newPrimary = remainingImages.get(0);

				newPrimary.setIsPrimary(true);

				productImageRepository.save(newPrimary);
			}
		}
	}

	@Override
	public ProductResponseDTO getProductById(Integer productId) {

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		return mapToResponseDTO(product);
	}

	// methods...

	private ProductResponseDTO mapToResponseDTO(Product product) {

		ProductResponseDTO dto = new ProductResponseDTO();

		dto.setProductId(product.getProductId());
		dto.setProductName(product.getName());
		dto.setDescription(product.getDescription());
		dto.setPrice(product.getPrice());
		dto.setDiscountPrice(product.getDiscountPrice());
		dto.setStockQuantity(product.getStock());

		dto.setBrand(product.getBrand());
		dto.setSku(product.getSku());
		dto.setSpecifications(product.getSpecifications());
		dto.setKeywords(product.getKeywords());

		dto.setStatus(product.getStatus());

		if (product.getCategory() != null) {

			dto.setCategoryId(product.getCategory().getCategoryId());

			dto.setCategoryName(product.getCategory().getCategoryName());
		}

		List<ProductImage> images = productImageRepository.findByProduct(product);

		List<String> imageUrls = new ArrayList<>();

		List<ProductImageResponseDTO> imageResponses = new ArrayList<>();

		for (ProductImage image : images) {

			imageUrls.add(image.getImageUrl());

			ProductImageResponseDTO imageDTO = new ProductImageResponseDTO(image.getImageId(), image.getImageUrl(),
					image.getIsPrimary(), image.getDisplayOrder());

			imageResponses.add(imageDTO);
		}

		dto.setImageUrls(imageUrls);

		dto.setImages(imageResponses);

		return dto;
	}

	@Override
	public List<ProductResponseDTO> getAllProducts() {

		List<Product> products = productRepository.findAll();

		List<ProductResponseDTO> response = new ArrayList<>();

		for (Product product : products) {

			response.add(mapToResponseDTO(product));
		}

		return response;
	}
}
