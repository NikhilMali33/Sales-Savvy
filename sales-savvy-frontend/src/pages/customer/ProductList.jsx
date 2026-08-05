import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductCard from "../../components/Product/ProductCard";
import Navbar from "../../components/layout/Navbar";
import SearchBar from "../../components/layout/SearchBar";

function ProductList() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        fetchProducts();

    }, []);

    const fetchProducts = async () => {

        try {

            const response = await getAllProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    return (
        <div>

            <Navbar />

            <SearchBar />

            <h1>SalesSavvy Products</h1>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px"
                }}
            >
                {products.map(product => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                    />
                ))}
            </div>

        </div>
    );
}

export default ProductList;