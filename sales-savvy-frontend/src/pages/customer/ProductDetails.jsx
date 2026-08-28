import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../../services/productService";

import Navbar from "../../components/layout/Navbar";
import Breadcrumb from "../../components/layout/Breadcrumb";

import "../../styles/customer/ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setError("");

            const response = await getProductById(id);
            const data = response.data;

            console.log("Product Details:", data);
            console.log("Images:", data.imageUrls);

            setProduct(data);

            if (data.imageUrls && data.imageUrls.length > 0) {
                setSelectedImage(data.imageUrls[0]);
            }
        } catch (error) {
            console.error("Error fetching product:", error);

            setError("Unable to load product details.");
        }
    };

    const images = product?.imageUrls || [];

    const currentImageIndex = images.findIndex(
        (image) => image === selectedImage
    );

    const showPreviousImage = () => {
        if (images.length === 0) {
            return;
        }

        const currentIndex =
            currentImageIndex === -1 ? 0 : currentImageIndex;

        const previousIndex =
            currentIndex === 0
                ? images.length - 1
                : currentIndex - 1;

        setSelectedImage(images[previousIndex]);
    };

    const showNextImage = () => {
        if (images.length === 0) {
            return;
        }

        const currentIndex =
            currentImageIndex === -1 ? 0 : currentImageIndex;

        const nextIndex =
            currentIndex === images.length - 1
                ? 0
                : currentIndex + 1;

        setSelectedImage(images[nextIndex]);
    };

    const handleGalleryKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPreviousImage();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showNextImage();
        }
    };

    const decreaseQuantity = () => {
        setQuantity((previous) =>
            Math.max(1, previous - 1)
        );

        setMessage("");
        setError("");
    };

    const increaseQuantity = () => {
        if (!product) {
            return;
        }

        const stock =
            Number(product.stockQuantity) || 0;

        setQuantity((previous) =>
            Math.min(stock, previous + 1)
        );

        setMessage("");
        setError("");
    };

    const showLoginMessage = (action) => {
        setMessage("");
        setError(`Please login to ${action}.`);
    };

    const handleAddToCart = async () => {
        if (!product) {
            return;
        }

        const stock =
            Number(product.stockQuantity) || 0;

        if (stock <= 0) {
            setError(
                "Product is currently out of stock."
            );

            return;
        }

        if (quantity > stock) {
            setError(
                "Requested quantity exceeds available stock."
            );

            return;
        }

        try {
            setAddingToCart(true);
            setError("");
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/api/cart/add",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: product.productId,
                        quantity: quantity
                    })
                }
            );

            const responseText =
                await response.text();

            let data = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error(
                        "Backend returned non-JSON response:",
                        responseText
                    );
                }
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                showLoginMessage(
                    "add products to your cart"
                );

                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    responseText ||
                    "Failed to add product to cart."
                );
            }

            setMessage(
                `${product.productName} added to cart successfully!`
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            setError(
                error.message ||
                "Unable to add product to cart."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!product) {
            return;
        }

        const stock =
            Number(product.stockQuantity) || 0;

        if (stock <= 0) {
            setError(
                "Product is currently out of stock."
            );

            return;
        }

        if (quantity > stock) {
            setError(
                "Requested quantity exceeds available stock."
            );

            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/api/cart/add",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: product.productId,
                        quantity: quantity
                    })
                }
            );

            const responseText =
                await response.text();

            let data = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error(
                        "Backend returned non-JSON response:",
                        responseText
                    );
                }
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                showLoginMessage(
                    "purchase this product"
                );

                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    responseText ||
                    "Unable to proceed with Buy Now."
                );
            }

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            navigate("/cart");
        } catch (error) {
            console.error(
                "Buy Now error:",
                error
            );

            setError(
                error.message ||
                "Unable to proceed with Buy Now."
            );
        }
    };

    const calculateDiscount = () => {
        if (
            product.discountPrice &&
            product.price &&
            Number(product.discountPrice) <
                Number(product.price)
        ) {
            return Math.round(
                (
                    (
                        Number(product.price) -
                        Number(product.discountPrice)
                    ) /
                    Number(product.price)
                ) * 100
            );
        }

        return 0;
    };

    if (!product) {
        return (
            <>
                <Navbar />

                <main
                    className="loading-text"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <h1>
                        {error || "Loading product details..."}
                    </h1>
                </main>
            </>
        );
    }

    const discountPercentage =
        calculateDiscount();

    const hasDiscount =
        product.discountPrice &&
        Number(product.discountPrice) <
            Number(product.price);

    return (
        <>
            <Navbar />

            <Breadcrumb
                category={product.categoryName}
                productName={product.productName}
            />

            <main
                className="product-details-container"
                aria-labelledby="product-title"
            >
                <section
                    className="product-gallery"
                    aria-label={`${product.productName} product gallery`}
                    onKeyDown={handleGalleryKeyDown}
                    tabIndex={0}
                >
                    {images.length > 0 && (
                        <div
                            className="thumbnail-container"
                            aria-label="Product image thumbnails"
                        >
                            {images.map((image, index) => (
                                <button
                                    key={image}
                                    type="button"
                                    className={`thumbnail-button ${
                                        selectedImage === image
                                            ? "active-thumbnail"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedImage(image)
                                    }
                                    aria-label={`View product image ${index + 1}`}
                                    aria-current={
                                        selectedImage === image
                                            ? "true"
                                            : undefined
                                    }
                                >
                                    <img
                                        src={image}
                                        alt=""
                                        className="thumbnail"
                                        aria-hidden="true"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div
                        className="main-product-image"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={`${product.productName} - product image ${
                                    currentImageIndex + 1
                                } of ${images.length}`}
                                className="details-image"
                            />
                        ) : (
                            <div
                                className="no-image"
                                role="img"
                                aria-label="No product image available"
                            >
                                No Image Available
                            </div>
                        )}

                        {images.length > 1 && (
                            <button
                                type="button"
                                className="gallery-arrow gallery-prev"
                                onClick={showPreviousImage}
                                aria-label="View previous product image"
                            >
                                <span aria-hidden="true">
                                    &#8249;
                                </span>
                            </button>
                        )}

                        {images.length > 1 && (
                            <button
                                type="button"
                                className="gallery-arrow gallery-next"
                                onClick={showNextImage}
                                aria-label="View next product image"
                            >
                                <span aria-hidden="true">
                                    &#8250;
                                </span>
                            </button>
                        )}

                        {images.length > 1 && (
                            <div
                                className="image-counter"
                                aria-hidden="true"
                            >
                                {currentImageIndex + 1}
                                {" / "}
                                {images.length}
                            </div>
                        )}
                    </div>
                </section>

                <section
                    className="product-info"
                    aria-labelledby="product-title"
                >
                    <h1
                        id="product-title"
                        className="product-title"
                    >
                        {product.productName}
                    </h1>

                    {product.brand && (
                        <div className="product-brand">
                            Brand:{" "}
                            <strong>
                                {product.brand}
                            </strong>
                        </div>
                    )}

                    <div
                        className="price-section"
                        aria-label="Product price"
                    >
                        {hasDiscount ? (
                            <>
                                <span className="discount-price">
                                    ₹ {product.discountPrice}
                                </span>

                                <span className="original-price">
                                    <span className="sr-only">
                                        Original price:{" "}
                                    </span>
                                    ₹ {product.price}
                                </span>

                                <span className="discount-badge">
                                    {discountPercentage}% OFF
                                </span>
                            </>
                        ) : (
                            <span className="discount-price">
                                ₹ {product.price}
                            </span>
                        )}
                    </div>

                    <div
                        className="stock"
                        aria-live="polite"
                    >
                        <span aria-hidden="true">
                            ✓
                        </span>{" "}
                        In Stock ({product.stockQuantity})
                    </div>

                    <div className="product-description">
                        <h2>
                            Description
                        </h2>

                        <p>
                            {product.description ||
                                "No description available."}
                        </p>
                    </div>

                    <div className="product-information">
                        <h2>
                            Product Information
                        </h2>

                        <div className="information-row">
                            <span>Brand</span>

                            <strong>
                                {product.brand || "N/A"}
                            </strong>
                        </div>

                        <div className="information-row">
                            <span>Category</span>

                            <strong>
                                {product.categoryName ||
                                    "N/A"}
                            </strong>
                        </div>

                        <div className="information-row">
                            <span>SKU</span>

                            <strong>
                                {product.sku || "N/A"}
                            </strong>
                        </div>
                    </div>

                    {product.specifications && (
                        <div className="product-specifications">
                            <h2>
                                Specifications
                            </h2>

                            <p>
                                {product.specifications}
                            </p>
                        </div>
                    )}

                    <div className="quantity-section">
                        <span
                            id="quantity-label"
                            className="quantity-label"
                        >
                            Quantity
                        </span>

                        <div
                            className="quantity-controls"
                            role="group"
                            aria-labelledby="quantity-label"
                        >
                            <button
                                type="button"
                                className="quantity-btn"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                aria-disabled={quantity <= 1}
                            >
                                <span aria-hidden="true">
                                    −
                                </span>
                            </button>

                            <span
                                className="quantity-value"
                                aria-live="polite"
                                aria-atomic="true"
                                aria-label={`Quantity ${quantity}`}
                            >
                                {quantity}
                            </span>

                            <button
                                type="button"
                                className="quantity-btn"
                                onClick={increaseQuantity}
                                disabled={
                                    quantity >=
                                    Number(
                                        product.stockQuantity
                                    )
                                }
                                aria-label="Increase quantity"
                                aria-disabled={
                                    quantity >=
                                    Number(
                                        product.stockQuantity
                                    )
                                }
                            >
                                <span aria-hidden="true">
                                    +
                                </span>
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div
                            className="cart-success-message"
                            role="status"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <span aria-hidden="true">
                                ✓
                            </span>{" "}
                            {message}
                        </div>
                    )}

                    {error && (
                        <div
                            className="cart-error-message"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            {error}

                            {error.includes("Please login") && (
                                <button
                                    type="button"
                                    className="login-required-btn"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    )}

                    <div className="button-group">
                        <button
                            type="button"
                            className="cart-btn"
                            onClick={handleAddToCart}
                            disabled={
                                addingToCart ||
                                Number(
                                    product.stockQuantity
                                ) <= 0
                            }
                            aria-label={
                                addingToCart
                                    ? "Adding product to cart"
                                    : `Add ${quantity} ${product.productName} to cart`
                            }
                            aria-busy={addingToCart}
                        >
                            {addingToCart
                                ? "Adding..."
                                : "Add to Cart"}
                        </button>

                        <button
                            type="button"
                            className="buy-btn"
                            onClick={handleBuyNow}
                            disabled={
                                Number(
                                    product.stockQuantity
                                ) <= 0
                            }
                        >
                            Buy Now
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}

export default ProductDetails;