import React, { useEffect, useState } from "react";

import { getAllProducts, getProductsByCategory } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";

import Navbar from "../../components/layout/Navbar";
import SearchBar from "../../components/layout/SearchBar";
import CategoryBar from "../../components/layout/CategoryBar";
import ProductCard from "../../components/Product/ProductCard";
import "../../styles/customer/ProductList.css";

function ProductList() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {

        fetchProducts();
        fetchCategories();

    }, []);

    const fetchProducts = async () => {

        try {

            const response = await getAllProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const fetchCategories = async () => {

        try {

            const response = await getAllCategories();

            setCategories(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleCategoryClick = async (categoryId) => {

        try {

            if (categoryId === null) {

                fetchProducts();
                return;

            }

            const response = await getProductsByCategory(categoryId);

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const filteredProducts = products.filter((product) =>
        (product.productName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (

        <div>

            <Navbar />

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <CategoryBar
                categories={categories}
                onCategoryClick={handleCategoryClick}
            />

            <h1 className="products-title">SalesSavvy Products</h1>

            <div className="products-grid">

                {
                    filteredProducts.map(product => (

                        <ProductCard
                            key={product.productId}
                            product={product}
                        />

                    ))
                }

            </div>

        </div>

    );

}

export default ProductList;