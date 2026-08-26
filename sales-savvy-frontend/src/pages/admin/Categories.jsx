import { useEffect, useMemo, useState } from "react";

import {
    Search,
    FolderOpen,
    Package,
    CheckCircle,
    XCircle,
    Plus,
    Pencil,
    Trash2,
    X
} from "lucide-react";

import AdminNavBar from "../../components/layout/AdminNavbar";

import "../../styles/admin/Categories.css";

const API_URL = "http://localhost:8080/api/categories";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
        imageUrl: "",
        status: "ACTIVE"
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load categories.");
            }

            const data = await response.json();

            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories:", err);

            setError(
                err.message || "Unable to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return categories;
        }

        return categories.filter((category) =>
            category.categoryName
                ?.toLowerCase()
                .includes(searchValue)
        );
    }, [categories, search]);

    const getProductCount = (category) => {
        return Array.isArray(category.products)
            ? category.products.length
            : 0;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const openAddModal = () => {
        setEditingCategory(null);

        setFormData({
            categoryName: "",
            description: "",
            imageUrl: "",
            status: "ACTIVE"
        });

        setFormError("");

        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);

        setFormData({
            categoryName: category.categoryName || "",
            description: category.description || "",
            imageUrl: category.imageUrl || "",
            status: category.status || "ACTIVE"
        });

        setFormError("");

        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingCategory(null);
        setFormError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryName = formData.categoryName.trim();

        if (!categoryName) {
            setFormError("Category name is required.");
            return;
        }

        if (categoryName.length < 2) {
            setFormError(
                "Category name must contain at least 2 characters."
            );
            return;
        }

        try {
            setSaving(true);
            setFormError("");

            const url = editingCategory
                ? `${API_URL}/${editingCategory.categoryId}`
                : API_URL;

            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    categoryName,
                    description: formData.description.trim(),
                    imageUrl: formData.imageUrl.trim(),
                    status: formData.status
                })
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to save category."
                );
            }

            setShowModal(false);
            setEditingCategory(null);

            await fetchCategories();
        } catch (err) {
            console.error("Failed to save category:", err);

            setFormError(
                err.message || "Unable to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (category) => {
        const newStatus =
            category.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        const confirmed = window.confirm(
            `Are you sure you want to ${
                newStatus === "ACTIVE"
                    ? "activate"
                    : "deactivate"
            } "${category.categoryName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${category.categoryId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to update category status."
                );
            }

            await fetchCategories();
        } catch (err) {
            console.error(
                "Failed to update category status:",
                err
            );

            window.alert(
                err.message ||
                "Unable to update category status."
            );
        }
    };

    const handleDelete = async (category) => {
        const productCount = getProductCount(category);

        if (productCount > 0) {
            window.alert(
                `Cannot delete "${category.categoryName}" because it contains ${productCount} product${
                    productCount === 1 ? "" : "s"
                }.`
            );

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${category.categoryId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to delete category."
                );
            }

            await fetchCategories();
        } catch (err) {
            console.error(
                "Failed to delete category:",
                err
            );

            window.alert(
                err.message ||
                "Unable to delete category."
            );
        }
    };

    if (loading) {
        return (
            <>
                <AdminNavBar />

                <div className="admin-categories-page">
                    <div className="admin-categories-container">
                        <div className="admin-categories-loading">
                            Loading categories...
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminNavBar />

                <div className="admin-categories-page">
                    <div className="admin-categories-container">
                        <div className="admin-categories-error">
                            {error}

                            <button
                                type="button"
                                onClick={fetchCategories}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNavBar />

            <div className="admin-categories-page">
                <div className="admin-categories-container">

                    <div className="admin-categories-header">
                        <div>
                            <h1>Categories</h1>

                            <p>
                                {categories.length}{" "}
                                {categories.length === 1
                                    ? "category"
                                    : "categories"}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="admin-category-add-button"
                            onClick={openAddModal}
                        >
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>

                    <div className="admin-categories-toolbar">

                        <div className="admin-categories-search">
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className="categories-summary-grid">

                        <div className="category-summary-card">
                            <div className="category-summary-icon">
                                <FolderOpen size={22} />
                            </div>

                            <div>
                                <span>Total Categories</span>

                                <strong>
                                    {categories.length}
                                </strong>
                            </div>
                        </div>

                        <div className="category-summary-card">
                            <div className="category-summary-icon">
                                <Package size={22} />
                            </div>

                            <div>
                                <span>
                                    Categories With Products
                                </span>

                                <strong>
                                    {
                                        categories.filter(
                                            (category) =>
                                                getProductCount(
                                                    category
                                                ) > 0
                                        ).length
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="category-summary-card">
                            <div className="category-summary-icon">
                                <CheckCircle size={22} />
                            </div>

                            <div>
                                <span>Active Categories</span>

                                <strong>
                                    {
                                        categories.filter(
                                            (category) =>
                                                category.status ===
                                                "ACTIVE"
                                        ).length
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="category-summary-card">
                            <div className="category-summary-icon">
                                <XCircle size={22} />
                            </div>

                            <div>
                                <span>Inactive Categories</span>

                                <strong>
                                    {
                                        categories.filter(
                                            (category) =>
                                                category.status !==
                                                "ACTIVE"
                                        ).length
                                    }
                                </strong>
                            </div>
                        </div>

                    </div>

                    <div className="categories-table-card">

                        <div className="categories-table-wrapper">

                            <table className="categories-table">

                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Products</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="categories-empty"
                                            >
                                                {search
                                                    ? "No categories found matching your search."
                                                    : "No categories available."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map(
                                            (category) => (
                                                <tr
                                                    key={
                                                        category.categoryId
                                                    }
                                                >

                                                    <td>
                                                        <div className="category-image-wrapper">

                                                            {category.imageUrl ? (
                                                                <img
                                                                    src={
                                                                        category.imageUrl
                                                                    }
                                                                    alt={
                                                                        category.categoryName
                                                                    }
                                                                    className="category-image"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";

                                                                        e.currentTarget.nextElementSibling.style.display =
                                                                            "flex";
                                                                    }}
                                                                />
                                                            ) : null}

                                                            <div
                                                                className="category-image-placeholder"
                                                                style={{
                                                                    display:
                                                                        category.imageUrl
                                                                            ? "none"
                                                                            : "flex"
                                                                }}
                                                            >
                                                                <FolderOpen
                                                                    size={
                                                                        22
                                                                    }
                                                                />
                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="category-name">
                                                            {
                                                                category.categoryName
                                                            }
                                                        </div>

                                                        <small>
                                                            ID:{" "}
                                                            {
                                                                category.categoryId
                                                            }
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <div className="category-description">
                                                            {category.description ||
                                                                "No description"}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="category-product-count">
                                                            <Package
                                                                size={15}
                                                            />

                                                            {getProductCount(
                                                                category
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className={`category-status ${
                                                                category.status ===
                                                                "ACTIVE"
                                                                    ? "category-status-active"
                                                                    : "category-status-inactive"
                                                            }`}
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    category
                                                                )
                                                            }
                                                            title="Click to change status"
                                                        >
                                                            {category.status ===
                                                            "ACTIVE" ? (
                                                                <CheckCircle
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            )}

                                                            {
                                                                category.status
                                                            }
                                                        </button>
                                                    </td>

                                                    <td>
                                                        <span className="category-date">
                                                            {formatDate(
                                                                category.createdAt
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="category-actions">

                                                            <button
                                                                type="button"
                                                                className="category-edit-button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        category
                                                                    )
                                                                }
                                                                title="Edit category"
                                                            >
                                                                <Pencil
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="category-delete-button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category
                                                                    )
                                                                }
                                                                title={
                                                                    getProductCount(
                                                                        category
                                                                    ) > 0
                                                                        ? "Cannot delete category with products"
                                                                        : "Delete category"
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>
                                            )
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            </div>

            {showModal && (
                <div
                    className="category-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="category-modal">

                        <div className="category-modal-header">

                            <div>
                                <h2>
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p>
                                    {editingCategory
                                        ? "Update category information."
                                        : "Create a new product category."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="category-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            className="category-form"
                            onSubmit={handleSubmit}
                        >

                            {formError && (
                                <div className="category-form-error">
                                    {formError}
                                </div>
                            )}

                            <div className="category-form-group">

                                <label htmlFor="categoryName">
                                    Category Name
                                </label>

                                <input
                                    id="categoryName"
                                    name="categoryName"
                                    type="text"
                                    placeholder="e.g. Mobiles"
                                    value={
                                        formData.categoryName
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    disabled={saving}
                                    maxLength={100}
                                />

                            </div>

                            <div className="category-form-group">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter category description..."
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    disabled={saving}
                                    rows={4}
                                />

                            </div>

                            <div className="category-form-group">

                                <label htmlFor="imageUrl">
                                    Image URL
                                </label>

                                <input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    placeholder="https://example.com/category.jpg"
                                    value={
                                        formData.imageUrl
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    disabled={saving}
                                />

                                <small>
                                    Optional. Use a publicly accessible image URL.
                                </small>

                            </div>

                            <div className="category-form-group">

                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={
                                        handleInputChange
                                    }
                                    disabled={saving}
                                >
                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="INACTIVE">
                                        Inactive
                                    </option>
                                </select>

                            </div>

                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="category-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Update Category"
                                            : "Create Category"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </>
    );
}

export default Categories;