import { useEffect, useMemo, useRef, useState } from "react";

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
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

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

    const [operationError, setOperationError] = useState("");

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        danger: false,
        action: null
    });

    const modalRef = useRef(null);

    // Load categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Manage modal keyboard accessibility
    useEffect(() => {
        if (!showModal) {
            return;
        }

        const previousActiveElement = document.activeElement;

        const focusableElements =
            modalRef.current?.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
            );

        const firstElement = focusableElements?.[0];
        firstElement?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();

                if (!saving) {
                    closeModal();
                }

                return;
            }

            if (event.key === "Tab") {
                const elements =
                    modalRef.current?.querySelectorAll(
                        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
                    );

                if (!elements?.length) {
                    return;
                }

                const first = elements[0];
                const last = elements[elements.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            if (
                previousActiveElement &&
                typeof previousActiveElement.focus === "function"
            ) {
                previousActiveElement.focus();
            }
        };
    }, [showModal, saving]);

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
        setOperationError("");
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
        setOperationError("");
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

    const requestStatusChange = (category) => {
        const newStatus =
            category.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        setConfirmation({
            isOpen: true,
            title:
                newStatus === "ACTIVE"
                    ? "Activate category"
                    : "Deactivate category",
            message: `Are you sure you want to ${
                newStatus === "ACTIVE"
                    ? "activate"
                    : "deactivate"
            } "${category.categoryName}"?`,
            confirmText:
                newStatus === "ACTIVE"
                    ? "Activate"
                    : "Deactivate",
            danger: newStatus === "INACTIVE",
            action: () =>
                handleToggleStatus(category, newStatus)
        });
    };

    const handleToggleStatus = async (category, newStatus) => {
        setConfirmation((previous) => ({
            ...previous,
            isOpen: false
        }));

        try {
            setOperationError("");

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

            setOperationError(
                err.message ||
                "Unable to update category status."
            );
        }
    };

    const requestDelete = (category) => {
        const productCount = getProductCount(category);

        if (productCount > 0) {
            setOperationError(
                `Cannot delete "${category.categoryName}" because it contains ${productCount} product${
                    productCount === 1 ? "" : "s"
                }.`
            );

            return;
        }

        setConfirmation({
            isOpen: true,
            title: "Delete category",
            message: `Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.`,
            confirmText: "Delete",
            danger: true,
            action: () => handleDelete(category)
        });
    };

    const handleDelete = async (category) => {
        setConfirmation((previous) => ({
            ...previous,
            isOpen: false
        }));

        try {
            setOperationError("");

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

            setOperationError(
                err.message ||
                "Unable to delete category."
            );
        }
    };

    const closeConfirmation = () => {
        setConfirmation((previous) => ({
            ...previous,
            isOpen: false,
            action: null
        }));
    };

    const handleConfirmation = () => {
        const action = confirmation.action;

        if (action) {
            action();
        }
    };

    if (loading) {
        return (
            <>
                <AdminNavBar />

                <main
                    className="admin-categories-page"
                    aria-labelledby="categories-loading-title"
                >
                    <div className="admin-categories-container">
                        <div
                            className="admin-categories-loading"
                            role="status"
                            aria-live="polite"
                        >
                            <span id="categories-loading-title">
                                Loading categories...
                            </span>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminNavBar />

                <main className="admin-categories-page">
                    <div className="admin-categories-container">
                        <div
                            className="admin-categories-error"
                            role="alert"
                        >
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={fetchCategories}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <AdminNavBar />

            <main
                className="admin-categories-page"
                aria-labelledby="categories-page-title"
            >
                <div className="admin-categories-container">

                    <div className="admin-categories-header">
                        <div>
                            <h1 id="categories-page-title">
                                Categories
                            </h1>

                            <p aria-live="polite">
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
                            <Plus
                                size={18}
                                aria-hidden="true"
                            />
                            Add Category
                        </button>
                    </div>

                    {operationError && (
                        <div
                            className="admin-categories-operation-error"
                            role="alert"
                            aria-live="assertive"
                        >
                            {operationError}
                        </div>
                    )}

                    <div className="admin-categories-toolbar">

                        <div className="admin-categories-search">
                            <Search
                                size={18}
                                aria-hidden="true"
                            />

                            <label
                                htmlFor="category-search"
                                className="visually-hidden"
                            >
                                Search categories
                            </label>

                            <input
                                id="category-search"
                                type="search"
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
                            <div
                                className="category-summary-icon"
                                aria-hidden="true"
                            >
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
                            <div
                                className="category-summary-icon"
                                aria-hidden="true"
                            >
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
                            <div
                                className="category-summary-icon"
                                aria-hidden="true"
                            >
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
                            <div
                                className="category-summary-icon"
                                aria-hidden="true"
                            >
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

                                <caption className="visually-hidden">
                                    Product categories and their details
                                </caption>

                                <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Products</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Created</th>
                                        <th scope="col">Actions</th>
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
                                                                    alt={`${category.categoryName} category`}
                                                                    className="category-image"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";

                                                                        if (
                                                                            e.currentTarget.nextElementSibling
                                                                        ) {
                                                                            e.currentTarget.nextElementSibling.style.display =
                                                                                "flex";
                                                                        }
                                                                    }}
                                                                />
                                                            ) : null}

                                                            <div
                                                                className="category-image-placeholder"
                                                                aria-hidden="true"
                                                                style={{
                                                                    display:
                                                                        category.imageUrl
                                                                            ? "none"
                                                                            : "flex"
                                                                }}
                                                            >
                                                                <FolderOpen
                                                                    size={22}
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
                                                                aria-hidden="true"
                                                            />

                                                            <span>
                                                                {getProductCount(
                                                                    category
                                                                )}
                                                            </span>
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
                                                                requestStatusChange(
                                                                    category
                                                                )
                                                            }
                                                            aria-label={`Change ${category.categoryName} status. Current status is ${category.status}.`}
                                                        >
                                                            {category.status ===
                                                            "ACTIVE" ? (
                                                                <CheckCircle
                                                                    size={14}
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    size={14}
                                                                    aria-hidden="true"
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
                                                                aria-label={`Edit ${category.categoryName} category`}
                                                            >
                                                                <Pencil
                                                                    size={15}
                                                                    aria-hidden="true"
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="category-delete-button"
                                                                onClick={() =>
                                                                    requestDelete(
                                                                        category
                                                                    )
                                                                }
                                                                aria-label={
                                                                    getProductCount(
                                                                        category
                                                                    ) > 0
                                                                        ? `Cannot delete ${category.categoryName} because it contains products`
                                                                        : `Delete ${category.categoryName} category`
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={15}
                                                                    aria-hidden="true"
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
            </main>

            {showModal && (
                <div
                    className="category-modal-overlay"
                    role="presentation"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !saving
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div
                        ref={modalRef}
                        className="category-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="category-modal-title"
                        aria-describedby="category-modal-description"
                    >

                        <div className="category-modal-header">

                            <div>
                                <h2 id="category-modal-title">
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p id="category-modal-description">
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
                                aria-label="Close category dialog"
                            >
                                <X
                                    size={20}
                                    aria-hidden="true"
                                />
                            </button>

                        </div>

                        <form
                            className="category-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            {formError && (
                                <div
                                    className="category-form-error"
                                    role="alert"
                                    aria-live="assertive"
                                >
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
                                    required
                                    aria-required="true"
                                    aria-invalid={
                                        formError &&
                                        !formData.categoryName.trim()
                                            ? "true"
                                            : "false"
                                    }
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
                                    aria-describedby="image-url-help"
                                />

                                <small id="image-url-help">
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

            <ConfirmationDialog
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                confirmText={confirmation.confirmText}
                cancelText="Cancel"
                danger={confirmation.danger}
                onConfirm={handleConfirmation}
                onCancel={closeConfirmation}
            />
        </>
    );
}

export default Categories;