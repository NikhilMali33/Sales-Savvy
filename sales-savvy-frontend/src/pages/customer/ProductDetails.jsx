import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../../services/productService";

import Navbar from "../../components/layout/Navbar";
import Breadcrumb from "../../components/layout/Breadcrumb";

import "../../styles/customer/ProductDetails.css";


function ProductDetails() {

    const { id } = useParams();


    // ============================================================
    // PRODUCT STATE
    // ============================================================

    const [product, setProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [addingToCart, setAddingToCart] = useState(false);


    // ============================================================
    // FETCH PRODUCT
    // ============================================================

    useEffect(() => {

        fetchProduct();

    }, [id]);


    const fetchProduct = async () => {

        try {

            setError("");

            const response =
                await getProductById(id);

            const data =
                response.data;


            console.log(
                "Product Details:",
                data
            );

            console.log(
                "Images:",
                data.imageUrls
            );


            setProduct(data);


            if (
                data.imageUrls &&
                data.imageUrls.length > 0
            ) {

                setSelectedImage(
                    data.imageUrls[0]
                );
            }


        } catch (error) {

            console.error(
                "Error fetching product:",
                error
            );

            setError(
                "Unable to load product details."
            );
        }
    };


    // ============================================================
    // IMAGE NAVIGATION
    // ============================================================

    const images =
        product?.imageUrls || [];


    const currentImageIndex =
        images.findIndex(
            (image) =>
                image === selectedImage
        );


    const showPreviousImage = () => {

        if (images.length === 0) {
            return;
        }


        const currentIndex =
            currentImageIndex === -1
                ? 0
                : currentImageIndex;


        const previousIndex =
            currentIndex === 0
                ? images.length - 1
                : currentIndex - 1;


        setSelectedImage(
            images[previousIndex]
        );
    };


    const showNextImage = () => {

        if (images.length === 0) {
            return;
        }


        const currentIndex =
            currentImageIndex === -1
                ? 0
                : currentImageIndex;


        const nextIndex =
            currentIndex === images.length - 1
                ? 0
                : currentIndex + 1;


        setSelectedImage(
            images[nextIndex]
        );
    };


    // ============================================================
    // KEYBOARD IMAGE NAVIGATION
    // ============================================================

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


    // ============================================================
    // QUANTITY
    // ============================================================

    const decreaseQuantity = () => {

        setQuantity((previous) =>
            Math.max(1, previous - 1)
        );

        setMessage("");
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
    };


    // ============================================================
    // ADD TO CART
    // ============================================================

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


            const response =
                await fetch(
                    "http://localhost:8080/api/cart/add",
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            productId:
                                product.productId,

                            quantity:
                                quantity
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to add product to cart."
                );
            }


            // ====================================================
            // SUCCESS
            // ====================================================

            setMessage(
                `${product.productName} added to cart successfully!`
            );


            /*
             * Tell Navbar that the cart has changed.
             *
             * Navbar listens for this event and immediately
             * fetches the latest cart count.
             */

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


    // ============================================================
    // DISCOUNT
    // ============================================================

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


    // ============================================================
    // LOADING / ERROR
    // ============================================================

    if (!product) {

        return (
            <>
                <Navbar />

                <div
                    className="loading-text"
                    role="status"
                    aria-live="polite"
                >
                    {error || "Loading..."}
                </div>
            </>
        );
    }


    // ============================================================
    // PRICE
    // ============================================================

    const discountPercentage =
        calculateDiscount();


    const hasDiscount =
        product.discountPrice &&
        Number(product.discountPrice) <
            Number(product.price);


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <>

            <Navbar />


            <Breadcrumb
                category={
                    product.categoryName
                }
                productName={
                    product.productName
                }
            />


            <main className="product-details-container">


                {/* =================================================
                    LEFT SIDE - PRODUCT GALLERY
                   ================================================= */}

                <section
                    className="product-gallery"
                    aria-label={`${product.productName} product gallery`}
                    onKeyDown={
                        handleGalleryKeyDown
                    }
                    tabIndex="0"
                >


                    {/* =============================================
                        THUMBNAILS
                       ============================================= */}

                    {images.length > 0 && (

                        <div
                            className="thumbnail-container"
                            aria-label="Product image thumbnails"
                        >

                            {images.map(
                                (image, index) => (

                                    <button
                                        key={image}
                                        type="button"

                                        className={`thumbnail-button ${
                                            selectedImage === image
                                                ? "active-thumbnail"
                                                : ""
                                        }`}

                                        onClick={() =>
                                            setSelectedImage(
                                                image
                                            )
                                        }

                                        aria-label={`View product image ${
                                            index + 1
                                        }`}

                                        aria-pressed={
                                            selectedImage ===
                                            image
                                        }
                                    >

                                        <img
                                            src={image}
                                            alt=""
                                            className="thumbnail"
                                        />

                                    </button>

                                )
                            )}

                        </div>
                    )}


                    {/* =============================================
                        MAIN IMAGE
                       ============================================= */}

                    <div className="main-product-image">


                        {selectedImage ? (

                            <img
                                src={selectedImage}
                                alt={`${product.productName} - product image ${
                                    currentImageIndex + 1
                                }`}
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


                        {/* =========================================
                            PREVIOUS
                           ========================================= */}

                        {images.length > 1 && (

                            <button
                                type="button"
                                className="gallery-arrow gallery-prev"

                                onClick={
                                    showPreviousImage
                                }

                                aria-label="View previous product image"
                            >
                                &#8249;
                            </button>

                        )}


                        {/* =========================================
                            NEXT
                           ========================================= */}

                        {images.length > 1 && (

                            <button
                                type="button"
                                className="gallery-arrow gallery-next"

                                onClick={
                                    showNextImage
                                }

                                aria-label="View next product image"
                            >
                                &#8250;
                            </button>

                        )}


                        {/* =========================================
                            IMAGE COUNTER
                           ========================================= */}

                        {images.length > 1 && (

                            <div
                                className="image-counter"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {currentImageIndex + 1}
                                {" / "}
                                {images.length}
                            </div>

                        )}

                    </div>

                </section>


                {/* =================================================
                    RIGHT SIDE - PRODUCT INFORMATION
                   ================================================= */}

                <section
                    className="product-info"
                    aria-labelledby="product-title"
                >


                    {/* =============================================
                        PRODUCT NAME
                       ============================================= */}

                    <h1
                        id="product-title"
                        className="product-title"
                    >
                        {product.productName}
                    </h1>


                    {/* =============================================
                        BRAND
                       ============================================= */}

                    {product.brand && (

                        <div className="product-brand">

                            Brand:

                            {" "}

                            <strong>
                                {product.brand}
                            </strong>

                        </div>

                    )}


                    {/* =============================================
                        PRICE
                       ============================================= */}

                    <div
                        className="price-section"
                        aria-label="Product price"
                    >

                        {hasDiscount ? (

                            <>

                                <span className="discount-price">

                                    ₹{" "}
                                    {product.discountPrice}

                                </span>


                                <span
                                    className="original-price"
                                >

                                    ₹{" "}
                                    {product.price}

                                </span>


                                <span
                                    className="discount-badge"
                                >

                                    {discountPercentage}%
                                    {" "}
                                    OFF

                                </span>

                            </>

                        ) : (

                            <span className="discount-price">

                                ₹{" "}
                                {product.price}

                            </span>

                        )}

                    </div>


                    {/* =============================================
                        STOCK
                       ============================================= */}

                    <div
                        className="stock"
                        aria-live="polite"
                    >

                        ✓ In Stock
                        {" "}
                        ({product.stockQuantity})

                    </div>


                    {/* =============================================
                        DESCRIPTION
                       ============================================= */}

                    <div
                        className="product-description"
                    >

                        <h2>
                            Description
                        </h2>

                        <p>
                            {product.description ||
                                "No description available."}
                        </p>

                    </div>


                    {/* =============================================
                        PRODUCT INFORMATION
                       ============================================= */}

                    <div
                        className="product-information"
                    >

                        <h2>
                            Product Information
                        </h2>


                        <div
                            className="information-row"
                        >

                            <span>
                                Brand
                            </span>

                            <strong>
                                {product.brand ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div
                            className="information-row"
                        >

                            <span>
                                Category
                            </span>

                            <strong>
                                {product.categoryName ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div
                            className="information-row"
                        >

                            <span>
                                SKU
                            </span>

                            <strong>
                                {product.sku ||
                                    "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* =============================================
                        SPECIFICATIONS
                       ============================================= */}

                    {product.specifications && (

                        <div
                            className="product-specifications"
                        >

                            <h2>
                                Specifications
                            </h2>

                            <p>
                                {product.specifications}
                            </p>

                        </div>

                    )}


                    {/* =============================================
                        QUANTITY
                       ============================================= */}

                    <div
                        className="quantity-section"
                    >

                        <label
                            htmlFor="product-quantity"
                            className="quantity-label"
                        >
                            Quantity
                        </label>


                        <div
                            className="quantity-controls"
                            role="group"
                            aria-label="Product quantity"
                        >

                            <button
                                type="button"

                                className="quantity-btn"

                                onClick={
                                    decreaseQuantity
                                }

                                disabled={
                                    quantity <= 1
                                }

                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <span
                                id="product-quantity"
                                className="quantity-value"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {quantity}
                            </span>


                            <button
                                type="button"

                                className="quantity-btn"

                                onClick={
                                    increaseQuantity
                                }

                                disabled={
                                    quantity >=
                                    Number(
                                        product.stockQuantity
                                    )
                                }

                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* =============================================
                        SUCCESS MESSAGE
                       ============================================= */}

                    {message && (

                        <div
                            className="cart-success-message"
                            role="status"
                            aria-live="polite"
                        >

                            ✓ {message}

                        </div>

                    )}


                    {/* =============================================
                        ERROR MESSAGE
                       ============================================= */}

                    {error && (

                        <div
                            className="cart-error-message"
                            role="alert"
                            aria-live="assertive"
                        >

                            {error}

                        </div>

                    )}


                    {/* =============================================
                        BUTTONS
                       ============================================= */}

                    <div
                        className="button-group"
                    >

                        <button
                            type="button"

                            className="cart-btn"

                            onClick={
                                handleAddToCart
                            }

                            disabled={
                                addingToCart ||
                                Number(
                                    product.stockQuantity
                                ) <= 0
                            }

                            aria-label={
                                addingToCart
                                    ? "Adding product to cart"
                                    : `Add ${quantity} ${
                                        product.productName
                                    } to cart`
                            }
                        >

                            {addingToCart
                                ? "Adding..."
                                : "Add to Cart"}

                        </button>


                        <button
                            type="button"
                            className="buy-btn"
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