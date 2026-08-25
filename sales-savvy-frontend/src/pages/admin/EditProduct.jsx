import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    updateProduct,
    deleteProductImage
} from "../../services/adminService";

import { getAllCategories } from "../../services/categoryService";

import "../../styles/admin/AddProduct.css";


function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();


    // STATE
    const [categories, setCategories] = useState([]);

    // Images already stored in backend
    const [existingImages, setExistingImages] = useState([]);

    // Newly selected image files
    const [images, setImages] = useState([]);

    // Preview URLs for newly selected images
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


    // FETCH PRODUCT + CATEGORIES
    useEffect(() => {

        fetchProduct();
        fetchCategories();

    }, [id]);


    const fetchProduct = async () => {

        try {

            setLoading(true);

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


            // Backend returns:
            //
            // images: [
            //     {
            //         imageId,
            //         imageUrl,
            //         isPrimary,
            //         displayOrder
            //     }
            // ]

            setExistingImages(product.images || []);


        } catch (error) {

            console.error(
                "Error fetching product:",
                error
            );

            setError(
                "Failed to load product."
            );

        } finally {

            setLoading(false);

        }

    };


    const fetchCategories = async () => {

        try {

            const response = await getAllCategories();

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Error fetching categories:",
                error
            );

        }

    };


    // FORM HANDLING
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // NEW IMAGE SELECTION
    const handleImageChange = (e) => {

        const selectedFiles =
            Array.from(e.target.files || []);


        setImages(selectedFiles);


        const previews = selectedFiles.map((file) => ({

            file: file,

            url: URL.createObjectURL(file)

        }));


        setNewImagePreviews(previews);

    };


    // REMOVE NEWLY SELECTED IMAGE

    const handleRemoveNewImage = (index) => {

        setImages((previousImages) =>

            previousImages.filter(
                (_, i) => i !== index
            )

        );


        setNewImagePreviews((previousPreviews) => {

            const previewToRemove =
                previousPreviews[index];


            if (previewToRemove) {

                URL.revokeObjectURL(
                    previewToRemove.url
                );

            }


            return previousPreviews.filter(
                (_, i) => i !== index
            );

        });

    };


    // DELETE EXISTING IMAGE
    const handleDeleteImage = async (imageId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );


        if (!confirmed) {

            return;

        }


        try {

            await deleteProductImage(
                id,
                imageId
            );


            // Remove deleted image
            // from frontend immediately

            setExistingImages(
                (previousImages) =>

                    previousImages.filter(
                        (image) =>
                            image.imageId !== imageId
                    )

            );


        } catch (error) {

            console.error(
                "Error deleting image:",
                error
            );


            if (error.response?.data?.message) {

                alert(
                    error.response.data.message
                );

            } else {

                alert(
                    "Failed to delete image."
                );

            }

        }

    };


    // UPDATE PRODUCT
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // VALIDATION
        if (!formData.productName.trim()) {

            setError(
                "Product name is required."
            );

            return;

        }


        if (!formData.price) {

            setError(
                "Price is required."
            );

            return;

        }


        if (
            formData.stock === "" ||
            formData.stock === null
        ) {

            setError(
                "Stock is required."
            );

            return;

        }


        if (!formData.categoryId) {

            setError(
                "Please select a category."
            );

            return;

        }


        if (!formData.sku.trim()) {

            setError(
                "SKU is required."
            );

            return;

        }


        try {

            setSaving(true);


            // CREATE MULTIPART FORMDATA
            const data = new FormData();


            data.append(
                "productName",
                formData.productName
            );


            data.append(
                "description",
                formData.description
            );


            data.append(
                "price",
                formData.price
            );


            data.append(
                "discountPrice",
                formData.discountPrice
            );


            data.append(
                "stock",
                formData.stock
            );


            data.append(
                "brand",
                formData.brand
            );


            data.append(
                "sku",
                formData.sku
            );


            data.append(
                "specifications",
                formData.specifications
            );


            data.append(
                "keywords",
                formData.keywords
            );


            data.append(
                "categoryId",
                formData.categoryId
            );


            data.append(
                "status",
                formData.status
            );


            // ADD NEW IMAGES

            images.forEach((image) => {

                data.append("images", image);

            });


            // SEND UPDATE REQUEST
            await updateProduct(id, data);


            alert("Product updated successfully!");


            navigate("/admin/products");


        } catch (error) {

            console.error(
                "Error updating product:",
                error
            );


            if (
                error.response?.data?.message
            ) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Failed to update product."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // LOADING
    if (loading) {

        return (

            <div className="add-product-container">

                <div className="products-message">

                    Loading product...

                </div>

            </div>

        );

    }


    // PAGE
    return (

        <div className="add-product-container">


            {/* ============================
                HEADER
            ============================ */}

            <div className="add-product-header">

                <div>

                    <h2>
                        Edit Product
                    </h2>

                    <p>
                        Update product information.
                    </p>

                </div>


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

            </div>


            {/* ============================
                ERROR
            ============================ */}

            {error && (

                <div className="form-error">

                    {error}

                </div>

            )}


            <form
                className="add-product-form"
                onSubmit={handleSubmit}
            >


                {/* ==================================================
                    PRODUCT INFORMATION
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Product Information
                    </h3>


                    <div className="form-grid">


                        {/* Product Name */}

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


                        {/* Description */}

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


                        {/* Brand */}

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


                        {/* SKU */}

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


                {/* ==================================================
                    PRICING & INVENTORY
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Pricing & Inventory
                    </h3>


                    <div className="form-grid">


                        {/* Price */}

                        <div className="form-group">

                            <label>
                                Price *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />

                        </div>


                        {/* Discount Price */}

                        <div className="form-group">

                            <label>
                                Discount Price
                            </label>

                            <input
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

                            <label>
                                Stock *
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                            />

                        </div>


                    </div>

                </div>


                {/* ==================================================
                    CATEGORY & STATUS
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Category & Status
                    </h3>


                    <div className="form-grid">


                        {/* Category */}

                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select category
                                </option>


                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.categoryId
                                            }
                                            value={
                                                category.categoryId
                                            }
                                        >
                                            {
                                                category.categoryName
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Status */}

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


                {/* ==================================================
                    SPECIFICATIONS
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Specifications
                    </h3>


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


                {/* ==================================================
                    KEYWORDS
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Keywords
                    </h3>


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


                {/* ==================================================
                    CURRENT PRODUCT IMAGES
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Current Product Images
                    </h3>


                    {existingImages.length > 0 ? (

                        <div className="selected-images">

                            {existingImages.map(
                                (image, index) => (

                                    <div
                                        className="selected-image"
                                        key={
                                            image.imageId
                                        }
                                    >

                                        <img
                                            src={
                                                image.imageUrl
                                            }
                                            alt={
                                                `Existing image ${index + 1
                                                }`
                                            }
                                        />


                                        <span>

                                            {image.isPrimary
                                                ? "Primary"
                                                : `Image ${index + 1
                                                }`}

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
                                        >
                                            Delete
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <p className="image-help">

                            No existing images.

                        </p>

                    )}

                </div>


                {/* ==================================================
                    REPLACE PRODUCT IMAGES
                ================================================== */}

                <div className="form-section">

                    <h3>
                        Add Product Images
                    </h3>


                    <div className="form-group">

                        <label>
                            Select new images
                        </label>


                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />


                        <p className="image-help">
                            Select additional images to add to the existing product images.
                            You can delete existing images individually above.
                        </p>

                    </div>


                    {/* ==================================================
                        NEW IMAGE PREVIEW
                    ================================================== */}

                    {newImagePreviews.length > 0 && (

                        <div className="selected-images">

                            {newImagePreviews.map(
                                (preview, index) => (

                                    <div
                                        className="selected-image"
                                        key={preview.url}
                                    >

                                        <img
                                            src={preview.url}
                                            alt={
                                                `New image ${index + 1
                                                }`
                                            }
                                        />


                                        <span>

                                            {index === 0
                                                ? "New Primary"
                                                : `New Image ${index + 1
                                                }`}

                                        </span>


                                        <button
                                            type="button"
                                            className="delete-image-btn"
                                            onClick={() =>
                                                handleRemoveNewImage(
                                                    index
                                                )
                                            }
                                            disabled={saving}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

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
                    >

                        {saving
                            ? "Updating Product..."
                            : "Update Product"}

                    </button>


                </div>


            </form>

        </div>

    );

}


export default EditProduct;