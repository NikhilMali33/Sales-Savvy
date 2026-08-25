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

    };

    const handleImageChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        setImages(selectedFiles);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

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

            alert("Product added successfully!");

            navigate("/admin/products");

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

                    <h2>Add Product</h2>

                    <p>
                        Add a new product to your store.
                    </p>

                </div>

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/admin/products")}
                >
                    Cancel
                </button>

            </div>


            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}


            <form
                className="add-product-form"
                onSubmit={handleSubmit}
            >

                {/* Product Information */}

                <div className="form-section">

                    <h3>Product Information</h3>


                    <div className="form-grid">

                        <div className="form-group full-width">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Enter product name"
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="5"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Brand
                            </label>

                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                SKU *
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="Enter SKU"
                            />

                        </div>

                    </div>

                </div>


                {/* Pricing & Inventory */}

                <div className="form-section">

                    <h3>Pricing & Inventory</h3>


                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Price *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Discount Price
                            </label>

                            <input
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

                            <label>
                                Stock *
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />

                        </div>

                    </div>

                </div>


                {/* Category & Status */}

                <div className="form-section">

                    <h3>Category & Status</h3>


                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                disabled={categoryLoading}
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

                            <label>
                                Status
                            </label>

                            <select
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

                    <h3>Specifications</h3>

                    <div className="form-group">

                        <textarea
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

                    <h3>Keywords</h3>

                    <div className="form-group">

                        <input
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

                    <h3>Product Images</h3>

                    <div className="form-group">

                        <label>
                            Upload Images
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <p className="image-help">
                            You can select multiple images.
                            The first image will be treated as the primary image.
                        </p>

                    </div>


                    {images.length > 0 && (

                        <div className="selected-images">

                            {images.map((image, index) => (

                                <div
                                    className="selected-image"
                                    key={`${image.name}-${index}`}
                                >

                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={image.name}
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