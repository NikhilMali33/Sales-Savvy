import { useNavigate } from "react-router-dom";
import "../../styles/customer/ProductCard.css";

function ProductCard({ product }) {

    const navigate = useNavigate();

    return (
        <div
            className="product-card"
            onClick={() => navigate(`/products/${product.productId}`)}
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