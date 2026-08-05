import "../../styles/ProductCard.css";

function ProductCard({ product }) {

   return (
        <div className="product-card">

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