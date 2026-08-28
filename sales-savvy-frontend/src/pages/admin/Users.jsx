import { useEffect, useRef, useState } from "react";
import {
    Users as UsersIcon,
    Eye,
    Plus,
    X,
    UserPlus,
    Mail,
    Lock,
    ShieldCheck,
    User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavBar from "../../components/layout/AdminNavbar";
import { getAllUsers } from "../../services/adminService";

import "../../styles/admin/Users.css";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    // Add user modal
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "CUSTOMER"
    });

    const modalRef = useRef(null);
    const firstInputRef = useRef(null);
    const addUserButtonRef = useRef(null);

    // Pagination
    const USERS_PER_PAGE = 5;

    const totalPages = Math.ceil(
        users.length / USERS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * USERS_PER_PAGE;

    const endIndex =
        startIndex + USERS_PER_PAGE;

    const currentUsers =
        users.slice(startIndex, endIndex);

    // Load users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllUsers();

            setUsers(response.data);
        } catch (err) {
            console.error("Failed to load users:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Keep current page valid when users change
    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Handle modal focus and keyboard navigation
    useEffect(() => {
        if (!showAddUserModal) {
            return;
        }

        const previousActiveElement =
            document.activeElement;

        firstInputRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !creatingUser) {
                event.preventDefault();
                closeAddUserModal();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements =
                modalRef.current?.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), select:not([disabled])'
                );

            if (!focusableElements?.length) {
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                    focusableElements.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            if (
                previousActiveElement &&
                typeof previousActiveElement.focus === "function"
            ) {
                previousActiveElement.focus();
            }
        };
    }, [showAddUserModal, creatingUser]);

    // Page change
    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Form change
    const handleFormChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setFormError("");
        setFormSuccess("");
    };

    // Open modal
    const openAddUserModal = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "CUSTOMER"
        });

        setFormError("");
        setFormSuccess("");
        setShowAddUserModal(true);
    };

    // Close modal
    const closeAddUserModal = () => {
        if (creatingUser) {
            return;
        }

        setShowAddUserModal(false);
        setFormError("");
        setFormSuccess("");
    };

    // Create user
    const handleCreateUser = async (e) => {
        e.preventDefault();

        setFormError("");
        setFormSuccess("");

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setFormError(
                "Passwords do not match."
            );
            return;
        }

        if (formData.password.length < 6) {
            setFormError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setCreatingUser(true);

            const response = await fetch(
                "http://localhost:8080/api/users/admin/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username:
                            formData.username.trim(),
                        email:
                            formData.email.trim(),
                        password:
                            formData.password,
                        role:
                            formData.role
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Unable to create user."
                );
            }

            setFormSuccess(
                "User created successfully."
            );

            await fetchUsers();

            setCurrentPage(1);

            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "CUSTOMER"
            });
        } catch (err) {
            console.error(
                "Failed to create user:",
                err
            );

            setFormError(
                err.message ||
                "Unable to create user."
            );
        } finally {
            setCreatingUser(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <>
                <AdminNavBar />

                <main
                    className="admin-users-page"
                    aria-labelledby="users-page-title"
                >
                    <div className="admin-users-container">
                        <div
                            className="admin-users-loading"
                            role="status"
                            aria-live="polite"
                        >
                            Loading users...
                        </div>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <AdminNavBar />

                <main
                    className="admin-users-page"
                    aria-labelledby="users-page-title"
                >
                    <div className="admin-users-container">
                        <h1
                            id="users-page-title"
                            className="sr-only"
                        >
                            Users
                        </h1>

                        <div
                            className="admin-users-error"
                            role="alert"
                        >
                            {error}
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
                className="admin-users-page"
                aria-labelledby="users-page-title"
            >
                <div className="admin-users-container">

                    {/* Page header */}
                    <header className="admin-users-header">
                        <div>
                            <h1 id="users-page-title">
                                Users
                            </h1>

                            <p>
                                Manage registered users
                            </p>
                        </div>

                        <div className="admin-users-header-actions">
                            <button
                                ref={addUserButtonRef}
                                type="button"
                                className="admin-add-user-btn"
                                onClick={openAddUserModal}
                                aria-haspopup="dialog"
                                aria-expanded={
                                    showAddUserModal
                                }
                            >
                                <Plus
                                    size={18}
                                    aria-hidden="true"
                                />

                                <span>
                                    Add User
                                </span>
                            </button>

                            <UsersIcon
                                size={40}
                                className="admin-users-header-icon"
                                aria-hidden="true"
                            />
                        </div>
                    </header>

                    {/* Users table */}
                    <div
                        className="admin-users-table-wrapper"
                        role="region"
                        aria-label="Registered users"
                        tabIndex="0"
                    >
                        <table className="admin-users-table">
                            <caption className="sr-only">
                                Registered users
                            </caption>

                            <thead>
                                <tr>
                                    <th scope="col">
                                        User ID
                                    </th>

                                    <th scope="col">
                                        Username
                                    </th>

                                    <th scope="col">
                                        Email
                                    </th>

                                    <th scope="col">
                                        Role
                                    </th>

                                    <th scope="col">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr
                                            key={user.userid}
                                        >
                                            <td>
                                                {user.userid}
                                            </td>

                                            <td>
                                                <strong>
                                                    {user.username}
                                                </strong>
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                <span
                                                    className={`user-role ${String(
                                                        user.role
                                                    ).toLowerCase()}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="admin-view-user-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${user.userid}`
                                                        )
                                                    }
                                                    aria-label={`View details for ${user.username}`}
                                                >
                                                    <Eye
                                                        size={17}
                                                        aria-hidden="true"
                                                    />

                                                    <span>
                                                        View Details
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="no-users"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav
                            className="admin-users-pagination"
                            aria-label="Users pagination"
                        >
                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={() =>
                                    goToPage(
                                        currentPage - 1
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                                aria-label="Go to previous page"
                            >
                                Previous
                            </button>

                            <div
                                className="pagination-pages"
                                aria-label="Page numbers"
                            >
                                {Array.from(
                                    {
                                        length: totalPages
                                    },
                                    (_, index) => {
                                        const page =
                                            index + 1;

                                        return (
                                            <button
                                                type="button"
                                                key={page}
                                                className={`pagination-number ${
                                                    currentPage === page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    goToPage(
                                                        page
                                                    )
                                                }
                                                aria-label={`Go to page ${page}`}
                                                aria-current={
                                                    currentPage === page
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {page}
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={() =>
                                    goToPage(
                                        currentPage + 1
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                aria-label="Go to next page"
                            >
                                Next
                            </button>
                        </nav>
                    )}

                    {/* Pagination information */}
                    {users.length > 0 && (
                        <div
                            className="admin-users-pagination-info"
                            aria-live="polite"
                        >
                            Showing{" "}
                            <strong>
                                {startIndex + 1}
                            </strong>
                            {" - "}
                            <strong>
                                {Math.min(
                                    endIndex,
                                    users.length
                                )}
                            </strong>
                            {" of "}
                            <strong>
                                {users.length}
                            </strong>
                            {" users"}
                        </div>
                    )}
                </div>
            </main>

            {/* Add user modal */}
            {showAddUserModal && (
                <div
                    className="admin-add-user-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !creatingUser
                        ) {
                            closeAddUserModal();
                        }
                    }}
                >
                    <div
                        ref={modalRef}
                        className="admin-add-user-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-user-title"
                        aria-describedby="add-user-description"
                    >
                        {/* Modal header */}
                        <header className="admin-add-user-modal-header">
                            <div className="admin-add-user-title">
                                <div
                                    className="admin-add-user-icon"
                                    aria-hidden="true"
                                >
                                    <UserPlus size={22} />
                                </div>

                                <div>
                                    <h2 id="add-user-title">
                                        Add User
                                    </h2>

                                    <p id="add-user-description">
                                        Create a new SalesSavvy account
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="admin-add-user-close"
                                onClick={closeAddUserModal}
                                disabled={creatingUser}
                                aria-label="Close Add User dialog"
                            >
                                <X
                                    size={21}
                                    aria-hidden="true"
                                />
                            </button>
                        </header>

                        {/* Form */}
                        <form
                            className="admin-add-user-form"
                            onSubmit={handleCreateUser}
                        >
                            {/* Username */}
                            <div className="admin-form-group">
                                <label htmlFor="admin-username">
                                    Username
                                </label>

                                <div className="admin-form-input">
                                    <User
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <input
                                        ref={firstInputRef}
                                        id="admin-username"
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="admin-form-group">
                                <label htmlFor="admin-email">
                                    Email
                                </label>

                                <div className="admin-form-input">
                                    <Mail
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <input
                                        id="admin-email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="admin-form-group">
                                <label htmlFor="admin-password">
                                    Password
                                </label>

                                <div className="admin-form-input">
                                    <Lock
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <input
                                        id="admin-password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        autoComplete="new-password"
                                        minLength="6"
                                        required
                                        aria-describedby="password-help"
                                    />
                                </div>

                                <small id="password-help">
                                    Password must be at least 6 characters.
                                </small>
                            </div>

                            {/* Confirm password */}
                            <div className="admin-form-group">
                                <label htmlFor="admin-confirm-password">
                                    Confirm Password
                                </label>

                                <div className="admin-form-input">
                                    <Lock
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <input
                                        id="admin-confirm-password"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        autoComplete="new-password"
                                        minLength="6"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="admin-form-group">
                                <label htmlFor="admin-role">
                                    Account Type
                                </label>

                                <div className="admin-form-input">
                                    <ShieldCheck
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <select
                                        id="admin-role"
                                        name="role"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >
                                        <option value="CUSTOMER">
                                            Customer
                                        </option>

                                        <option value="ADMIN">
                                            Admin
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Error */}
                            {formError && (
                                <div
                                    className="admin-add-user-form-error"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    {formError}
                                </div>
                            )}

                            {/* Success */}
                            {formSuccess && (
                                <div
                                    className="admin-add-user-form-success"
                                    role="status"
                                    aria-live="polite"
                                >
                                    {formSuccess}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="admin-add-user-actions">
                                <button
                                    type="button"
                                    className="admin-add-user-cancel"
                                    onClick={
                                        closeAddUserModal
                                    }
                                    disabled={
                                        creatingUser
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-add-user-submit"
                                    disabled={
                                        creatingUser
                                    }
                                >
                                    {creatingUser
                                        ? "Creating..."
                                        : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Users;