import { useNavigate } from "react-router-dom";
import "../../styles/customer/ProductCard.css";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate(`/products/${product.productId}`);
        }
    };

    return (
        <div
            className="product-card"
            onClick={() => navigate(`/products/${product.productId}`)}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="link"
            aria-label={`View ${product.productName}`}
        >

            <img
                src={product.imageUrls?.[0]}
                alt={product.productName}
                className="product-card-image"
            />

            <div className="product-name">
                {product.productName}
            </div>

            <div className="category">
                {product.categoryName}
            </div>

            <div className="price">
                ₹ {product.price}
            </div>

        </div>
    );
}

export default ProductCard;