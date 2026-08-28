import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addProduct } from "../../services/adminService";
import { getAllCategories } from "../../services/categoryService";

import "../../styles/admin/AddProduct.css";

function AddProduct() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

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

    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {

        try {

            setCategoryLoading(true);

            const response = await getAllCategories();

            setCategories(response.data);

        } catch (error) {

            console.error("Error fetching categories:", error);

            setError("Failed to load categories.");

        } finally {

            setCategoryLoading(false);
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleImageChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        setImages(selectedFiles);
        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Basic validation
        if (!formData.productName.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!formData.price) {
            setError("Price is required.");
            return;
        }

        if (!formData.stock) {
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

            setLoading(true);

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

            // Add multiple images
            images.forEach((image) => {
                data.append("images", image);
            });

            await addProduct(data);

            setSuccess("Product added successfully.");

            setTimeout(() => {
                navigate("/admin/products");
            }, 1200);

        } catch (error) {

            console.error("Error adding product:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to add product. Please try again.");
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">

            <div className="add-product-header">

                <div>

                    <h1>Add Product</h1>

                    <p>
                        Add a new product to your store.
                    </p>

                </div>

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/admin/products")}
                    disabled={loading}
                >
                    Cancel
                </button>

            </div>

            {error && (
                <div
                    className="form-error"
                    role="alert"
                    aria-live="assertive"
                    tabIndex="-1"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="form-success"
                    role="status"
                    aria-live="polite"
                    tabIndex="-1"
                >
                    {success}
                </div>
            )}

            <form
                className="add-product-form"
                onSubmit={handleSubmit}
                noValidate
            >

                {/* Product Information */}

                <div className="form-section">

                    <h2>Product Information</h2>

                    <div className="form-grid">

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
                                aria-required="true"
                                aria-invalid={
                                    error && !formData.productName.trim()
                                        ? "true"
                                        : "false"
                                }
                            />

                        </div>

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
                                aria-required="true"
                            />

                        </div>

                    </div>

                </div>

                {/* Pricing & Inventory */}

                <div className="form-section">

                    <h2>Pricing & Inventory</h2>

                    <div className="form-grid">

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
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                                aria-required="true"
                            />

                        </div>

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
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />

                        </div>

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
                                placeholder="0"
                                min="0"
                                required
                                aria-required="true"
                            />

                        </div>

                    </div>

                </div>

                {/* Category & Status */}

                <div className="form-section">

                    <h2>Category & Status</h2>

                    <div className="form-grid">

                        <div className="form-group">

                            <label htmlFor="categoryId">
                                Category *
                            </label>

                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                disabled={categoryLoading}
                                required
                                aria-required="true"
                            >

                                <option value="">
                                    {categoryLoading
                                        ? "Loading categories..."
                                        : "Select category"
                                    }
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

                </div>

                {/* Specifications */}

                <div className="form-section">

                    <h2>Specifications</h2>

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

                </div>

                {/* Keywords */}

                <div className="form-section">

                    <h2>Keywords</h2>

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

                </div>

                {/* Images */}

                <div className="form-section">

                    <h2>Product Images</h2>

                    <div className="form-group">

                        <label htmlFor="productImages">
                            Upload Images
                        </label>

                        <input
                            id="productImages"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            aria-describedby="image-help"
                        />

                        <p
                            id="image-help"
                            className="image-help"
                        >
                            You can select multiple images.
                            The first image will be treated as the primary image.
                        </p>

                    </div>

                    {images.length > 0 && (

                        <div
                            className="selected-images"
                            aria-label="Selected product images"
                        >

                            {images.map((image, index) => (

                                <div
                                    className="selected-image"
                                    key={`${image.name}-${index}`}
                                >

                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={
                                            index === 0
                                                ? `${image.name}, primary product image`
                                                : `${image.name}, product image ${index + 1}`
                                        }
                                    />

                                    <span>
                                        {index === 0
                                            ? "Primary"
                                            : `Image ${index + 1}`
                                        }
                                    </span>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                {/* Actions */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/admin/products")}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                        aria-disabled={loading}
                    >
                        {loading
                            ? "Adding Product..."
                            : "Add Product"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddProduct;