import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllProducts, deleteProduct } from "../../services/adminService";
import "../../styles/admin/Products.css";
import AdminNavbar from "../../components/layout/AdminNavbar";

function Products() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAllProducts();

            setProducts(response.data);

        } catch (error) {

            console.error("Error fetching products:", error);

            setError("Failed to load products.");

        } finally {

            setLoading(false);

        }

    };

    const handleAddProduct = () => {

        navigate("/admin/products/add");

    };

    const handleEditProduct = (productId) => {

        navigate(`/admin/products/edit/${productId}`);

    };

    const handleDeleteProduct = async (productId, productName) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteProduct(productId);

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.productId !== productId
                )
            );

        } catch (error) {

            console.error("Error deleting product:", error);

            alert("Failed to delete product.");

        }

    };

    const filteredProducts = products.filter((product) =>
        (product.productName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (

        <>
            <AdminNavbar />
            <div className="products-container">

            {/* Header */}

            <div className="products-header">

                <div>
                    <h2>Products</h2>

                    <p className="products-count">
                        {products.length} product
                        {products.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <button
                    className="add-product-btn"
                    onClick={handleAddProduct}
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>


            {/* Search */}

            <div className="products-search">

                <Search
                    size={18}
                    className="search-icon"
                />

                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-box"
                />

            </div>


            {/* Loading */}

            {loading && (

                <div className="products-message">
                    Loading products...
                </div>

            )}


            {/* Error */}

            {!loading && error && (

                <div className="products-message error-message">

                    <p>{error}</p>

                    <button
                        onClick={fetchProducts}
                        className="retry-btn"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* Table */}

            {!loading && !error && (

                <div className="table-container">

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredProducts.length > 0 ? (

                                filteredProducts.map((product) => (

                                    <tr key={product.productId}>

                                        {/* Image */}

                                        <td>

                                            {product.imageUrls &&
                                            product.imageUrls.length > 0 ? (

                                                <img
                                                    src={product.imageUrls[0]}
                                                    alt={product.productName}
                                                    className="product-image"
                                                />

                                            ) : (

                                                <div className="no-image">
                                                    No Image
                                                </div>

                                            )}

                                        </td>


                                        {/* Product */}

                                        <td>

                                            <div className="product-name-cell">

                                                <strong>
                                                    {product.productName}
                                                </strong>

                                            </div>

                                        </td>


                                        {/* Category */}

                                        <td>
                                            {product.categoryName || "-"}
                                        </td>


                                        {/* Price */}

                                        <td>
                                            ₹ {product.price}
                                        </td>


                                        {/* Stock */}

                                        <td>

                                            <span
                                                className={
                                                    product.stockQuantity > 0
                                                        ? "stock-available"
                                                        : "stock-out"
                                                }
                                            >
                                                {product.stockQuantity}
                                            </span>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span
                                                className={
                                                    product.status === "ACTIVE"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {product.status}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="action-btn edit-btn"
                                                    title="Edit Product"
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            product.productId
                                                        )
                                                    }
                                                >
                                                    <Pencil size={16} />
                                                </button>


                                                <button
                                                    className="action-btn delete-btn"
                                                    title="Delete Product"
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product.productId,
                                                            product.productName
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-data"
                                    >

                                        {searchTerm
                                            ? "No products match your search."
                                            : "No products found."
                                        }

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
        </>

    );

}

export default Products;