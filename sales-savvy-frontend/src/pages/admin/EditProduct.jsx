import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    updateProduct,
    deleteProductImage
} from "../../services/adminService";

import { getAllCategories } from "../../services/categoryService";

import ConfirmationDialog from "../../components/common/ConfirmationDialog";

import "../../styles/admin/AddProduct.css";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [images, setImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        brand: "",
        sku: "",
        specifications: "",
        keywords: "",
        categoryId: "",
        status: "ACTIVE"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Confirmation dialog state
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        imageId: null
    });

    // Fetch product and categories
    useEffect(() => {
        fetchProduct();
        fetchCategories();

        return () => {
            newImagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProductById(id);
            const product = response.data;

            // Populate form
            setFormData({
                productName: product.productName || "",
                description: product.description || "",
                price: product.price || "",
                discountPrice: product.discountPrice || "",
                stock: product.stockQuantity ?? "",
                brand: product.brand || "",
                sku: product.sku || "",
                specifications: product.specifications || "",
                keywords: product.keywords || "",
                categoryId: product.categoryId || "",
                status: product.status || "ACTIVE"
            });

            // Backend returns product images
            setExistingImages(product.images || []);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories.");
        }
    };

    // Form handling
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setMessage("");
    };

    // New image selection
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        setImages(selectedFiles);

        const previews = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setNewImagePreviews(previews);

        setError("");
        setMessage("");
    };

    // Remove newly selected image
    const handleRemoveNewImage = (index) => {
        setImages((previousImages) =>
            previousImages.filter((_, i) => i !== index)
        );

        setNewImagePreviews((previousPreviews) => {
            const previewToRemove = previousPreviews[index];

            if (previewToRemove) {
                URL.revokeObjectURL(previewToRemove.url);
            }

            return previousPreviews.filter((_, i) => i !== index);
        });

        setMessage("");
        setError("");
    };

    // Open confirmation dialog before deleting an existing image
    const handleDeleteImage = (imageId) => {
        setDeleteDialog({
            isOpen: true,
            imageId
        });
    };

    // Delete existing image after confirmation
    const confirmDeleteImage = async () => {
        const imageId = deleteDialog.imageId;

        setDeleteDialog({
            isOpen: false,
            imageId: null
        });

        if (!imageId) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteProductImage(id, imageId);

            // Remove deleted image from frontend immediately
            setExistingImages((previousImages) =>
                previousImages.filter(
                    (image) => image.imageId !== imageId
                )
            );

            setMessage("Product image deleted successfully.");
        } catch (error) {
            console.error("Error deleting image:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete image."
            );
        }
    };

    // Update product
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        // Validation
        if (!formData.productName.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!formData.price) {
            setError("Price is required.");
            return;
        }

        if (
            formData.stock === "" ||
            formData.stock === null
        ) {
            setError("Stock is required.");
            return;
        }

        if (!formData.categoryId) {
            setError("Please select a category.");
            return;
        }

        if (!formData.sku.trim()) {
            setError("SKU is required.");
            return;
        }

        try {
            setSaving(true);

            // Create multipart FormData
            const data = new FormData();

            data.append("productName", formData.productName);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("discountPrice", formData.discountPrice);
            data.append("stock", formData.stock);
            data.append("brand", formData.brand);
            data.append("sku", formData.sku);
            data.append("specifications", formData.specifications);
            data.append("keywords", formData.keywords);
            data.append("categoryId", formData.categoryId);
            data.append("status", formData.status);

            // Add new images
            images.forEach((image) => {
                data.append("images", image);
            });

            // Send update request
            await updateProduct(id, data);

            setMessage("Product updated successfully.");

            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <main
                className="add-product-container"
                aria-busy="true"
            >
                <div
                    className="products-message"
                    role="status"
                    aria-live="polite"
                >
                    Loading product...
                </div>
            </main>
        );
    }

    return (
        <main
            className="add-product-container"
            aria-labelledby="edit-product-title"
        >
            {/* Header */}
            <div className="add-product-header">
                <div>
                    <h1 id="edit-product-title">
                        Edit Product
                    </h1>

                    <p>
                        Update product information.
                    </p>
                </div>

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/admin/products")}
                    disabled={saving}
                >
                    Cancel
                </button>
            </div>

            {/* Accessible status messages */}
            {error && (
                <div
                    className="form-error"
                    role="alert"
                    aria-live="assertive"
                >
                    {error}
                </div>
            )}

            {message && (
                <div
                    className="form-success"
                    role="status"
                    aria-live="polite"
                >
                    {message}
                </div>
            )}

            <form
                className="add-product-form"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* Product Information */}
                <section
                    className="form-section"
                    aria-labelledby="product-information-heading"
                >
                    <h2 id="product-information-heading">
                        Product Information
                    </h2>

                    <div className="form-grid">
                        {/* Product Name */}
                        <div className="form-group full-width">
                            <label htmlFor="productName">
                                Product Name *
                            </label>

                            <input
                                id="productName"
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group full-width">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="5"
                            />
                        </div>

                        {/* Brand */}
                        <div className="form-group">
                            <label htmlFor="brand">
                                Brand
                            </label>

                            <input
                                id="brand"
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand"
                            />
                        </div>

                        {/* SKU */}
                        <div className="form-group">
                            <label htmlFor="sku">
                                SKU *
                            </label>

                            <input
                                id="sku"
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="Enter SKU"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing and Inventory */}
                <section
                    className="form-section"
                    aria-labelledby="pricing-heading"
                >
                    <h2 id="pricing-heading">
                        Pricing & Inventory
                    </h2>

                    <div className="form-grid">
                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price">
                                Price *
                            </label>

                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Discount Price */}
                        <div className="form-group">
                            <label htmlFor="discountPrice">
                                Discount Price
                            </label>

                            <input
                                id="discountPrice"
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Stock */}
                        <div className="form-group">
                            <label htmlFor="stock">
                                Stock *
                            </label>

                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Category and Status */}
                <section
                    className="form-section"
                    aria-labelledby="category-status-heading"
                >
                    <h2 id="category-status-heading">
                        Category & Status
                    </h2>

                    <div className="form-grid">
                        {/* Category */}
                        <div className="form-group">
                            <label htmlFor="categoryId">
                                Category *
                            </label>

                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.categoryId}
                                        value={category.categoryId}
                                    >
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Specifications */}
                <section
                    className="form-section"
                    aria-labelledby="specifications-heading"
                >
                    <h2 id="specifications-heading">
                        Specifications
                    </h2>

                    <div className="form-group">
                        <label htmlFor="specifications">
                            Product Specifications
                        </label>

                        <textarea
                            id="specifications"
                            name="specifications"
                            value={formData.specifications}
                            onChange={handleChange}
                            placeholder="Enter product specifications"
                            rows="4"
                        />
                    </div>
                </section>

                {/* Keywords */}
                <section
                    className="form-section"
                    aria-labelledby="keywords-heading"
                >
                    <h2 id="keywords-heading">
                        Keywords
                    </h2>

                    <div className="form-group">
                        <label htmlFor="keywords">
                            Product Keywords
                        </label>

                        <input
                            id="keywords"
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="Example: smartphone, samsung, android"
                        />
                    </div>
                </section>

                {/* Current product images */}
                <section
                    className="form-section"
                    aria-labelledby="current-images-heading"
                >
                    <h2 id="current-images-heading">
                        Current Product Images
                    </h2>

                    {existingImages.length > 0 ? (
                        <div
                            className="selected-images"
                            aria-label="Current product images"
                        >
                            {existingImages.map((image, index) => (
                                <div
                                    className="selected-image"
                                    key={image.imageId}
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={
                                            image.isPrimary
                                                ? `${formData.productName} primary product image`
                                                : `${formData.productName} product image ${index + 1}`
                                        }
                                    />

                                    <span>
                                        {image.isPrimary
                                            ? "Primary image"
                                            : `Image ${index + 1}`}
                                    </span>

                                    <button
                                        type="button"
                                        className="delete-image-btn"
                                        onClick={() =>
                                            handleDeleteImage(
                                                image.imageId
                                            )
                                        }
                                        disabled={saving}
                                        aria-label={
                                            `Delete ${
                                                image.isPrimary
                                                    ? "primary "
                                                    : ""
                                            }product image ${
                                                index + 1
                                            }`
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="image-help">
                            No existing images.
                        </p>
                    )}
                </section>

                {/* Add new images */}
                <section
                    className="form-section"
                    aria-labelledby="new-images-heading"
                >
                    <h2 id="new-images-heading">
                        Add Product Images
                    </h2>

                    <div className="form-group">
                        <label htmlFor="product-images">
                            Select new images
                        </label>

                        <input
                            id="product-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            aria-describedby="image-help-text"
                        />

                        <p
                            id="image-help-text"
                            className="image-help"
                        >
                            Select additional images to add to the
                            existing product images. You can delete
                            existing images individually above.
                        </p>
                    </div>

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                        <div
                            className="selected-images"
                            aria-label="New product image previews"
                        >
                            {newImagePreviews.map((preview, index) => (
                                <div
                                    className="selected-image"
                                    key={preview.url}
                                >
                                    <img
                                        src={preview.url}
                                        alt={`New product image ${index + 1} preview`}
                                    />

                                    <span>
                                        {index === 0
                                            ? "New primary image"
                                            : `New image ${index + 1}`}
                                    </span>

                                    <button
                                        type="button"
                                        className="delete-image-btn"
                                        onClick={() =>
                                            handleRemoveNewImage(index)
                                        }
                                        disabled={saving}
                                        aria-label={`Remove new product image ${index + 1}`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={saving}
                        aria-busy={saving}
                    >
                        {saving
                            ? "Updating Product..."
                            : "Update Product"}
                    </button>
                </div>
            </form>

            {/* Reusable accessible confirmation dialog */}
            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Product Image"
                message="Are you sure you want to delete this image? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                danger={true}
                onConfirm={confirmDeleteImage}
                onCancel={() =>
                    setDeleteDialog({
                        isOpen: false,
                        imageId: null
                    })
                }
            />
        </main>
    );
}

export default EditProduct; 