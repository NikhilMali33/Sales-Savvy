import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllProducts, deleteProduct } from "../../services/adminService";
import "../../styles/admin/Products.css";
import AdminNavbar from "../../components/layout/AdminNavbar";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

function Products() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        productId: null,
        productName: ""
    });

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

    // Open delete confirmation
    const handleDeleteProduct = (productId, productName) => {

        setDeleteDialog({
            isOpen: true,
            productId,
            productName
        });

    };

    // Close delete confirmation
    const handleCancelDelete = () => {

        setDeleteDialog({
            isOpen: false,
            productId: null,
            productName: ""
        });

    };

    // Delete product after confirmation
    const handleConfirmDelete = async () => {

        const { productId } = deleteDialog;

        try {

            await deleteProduct(productId);

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.productId !== productId
                )
            );

            handleCancelDelete();

        } catch (error) {

            console.error("Error deleting product:", error);

            setError("Failed to delete product.");

            handleCancelDelete();

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
                        <h1>Products</h1>

                        <p className="products-count">
                            {products.length} product
                            {products.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-product-btn"
                        onClick={handleAddProduct}
                    >
                        <Plus size={18} aria-hidden="true" />
                        <span>Add Product</span>
                    </button>

                </div>

                {/* Search */}

                <div className="products-search">

                    <label
                        htmlFor="product-search"
                        className="visually-hidden"
                    >
                        Search products
                    </label>

                    <Search
                        size={18}
                        className="search-icon"
                        aria-hidden="true"
                    />

                    <input
                        id="product-search"
                        type="search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-box"
                    />

                </div>

                {/* Loading */}

                {loading && (

                    <div
                        className="products-message"
                        role="status"
                        aria-live="polite"
                    >
                        Loading products...
                    </div>

                )}

                {/* Error */}

                {!loading && error && (

                    <div
                        className="products-message error-message"
                        role="alert"
                    >

                        <p>{error}</p>

                        <button
                            type="button"
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

                            <caption className="visually-hidden">
                                Product inventory
                            </caption>

                            <thead>

                                <tr>

                                    <th scope="col">Image</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>

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
                                                        alt={`${product.productName} product`}
                                                        className="product-image"
                                                    />

                                                ) : (

                                                    <span className="no-image">
                                                        No Image
                                                    </span>

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
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        aria-label={`Edit ${product.productName}`}
                                                        title={`Edit ${product.productName}`}
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        aria-label={`Delete ${product.productName}`}
                                                        title={`Delete ${product.productName}`}
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.productId,
                                                                product.productName
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
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
                                                : "No products found."}

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Delete Confirmation */}

            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                danger={true}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

        </>

    );

}

export default Products;