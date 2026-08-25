package com.salessavvy.app.controllers.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.http.MediaType;

import com.salessavvy.app.dto.request.ProductRequestDTO;
import com.salessavvy.app.dto.response.ProductResponseDTO;
import com.salessavvy.app.services.AdminProductService;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> addProduct(@ModelAttribute ProductRequestDTO request)
            throws IOException {

        return ResponseEntity.ok(adminProductService.addProduct(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {

        return ResponseEntity.ok(adminProductService.getAllProducts());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Integer productId) {

        return ResponseEntity.ok(adminProductService.getProductById(productId));
    }

    @PutMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponseDTO updateProduct(@PathVariable Integer productId, @ModelAttribute ProductRequestDTO request)
            throws IOException {

        return adminProductService.updateProduct(productId, request);
    }    
    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<String> deleteProductImage(@PathVariable Integer productId, @PathVariable Integer imageId) 
    		throws IOException {

        adminProductService.deleteProductImage(productId, imageId);

        return ResponseEntity.ok("Product image deleted successfully");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer productId)
            throws IOException {

        adminProductService.deleteProduct(productId);

        return ResponseEntity.ok("Product deleted successfully");
    }
}