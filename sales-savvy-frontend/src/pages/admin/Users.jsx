import { useEffect, useState } from "react";
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


    // ADD USER MODAL
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


    // PAGINATION
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


    // LOAD USERS
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


    // PAGE CHANGE
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


    // FORM CHANGE

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


    // OPEN MODAL
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


    // CLOSE MODAL
    const closeAddUserModal = () => {

        if (creatingUser) {
            return;
        }

        setShowAddUserModal(false);

        setFormError("");
        setFormSuccess("");
    };


    // CREATE USER
    const handleCreateUser = async (e) => {

        e.preventDefault();

        setFormError("");
        setFormSuccess("");


        // Password validation

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
                        "Content-Type":
                            "application/json"
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


            // Refresh users table

            await fetchUsers();


            // Reset pagination

            setCurrentPage(1);


            // Close after short delay

            setTimeout(() => {

                setShowAddUserModal(false);

                setFormSuccess("");

            }, 1000);


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


    // LOADING
    if (loading) {

        return (
            <>
                <AdminNavBar />

                <div className="admin-users-page">

                    <div className="admin-users-container">

                        <div className="admin-users-loading">
                            Loading users...
                        </div>

                    </div>

                </div>
            </>
        );
    }


    // ERROR
    if (error) {

        return (
            <>
                <AdminNavBar />

                <div className="admin-users-page">

                    <div className="admin-users-container">

                        <div className="admin-users-error">
                            {error}
                        </div>

                    </div>

                </div>
            </>
        );
    }


    // USERS PAGE

    return (
        <>
            <AdminNavBar />

            <div className="admin-users-page">

                <div className="admin-users-container">


                    {/* PAGE HEADER */}
                    <div className="admin-users-header">

                        <div>

                            <h1>Users</h1>

                            <p>Manage registered users</p>

                        </div>

                        <div className="admin-users-header-actions">

                            <button
                                type="button"
                                className="admin-add-user-btn"
                                onClick={openAddUserModal}
                            >

                                <Plus size={18} />

                                <span>Add User</span>

                            </button>


                            <UsersIcon
                                size={40}
                                className="admin-users-header-icon"
                            />

                        </div>

                    </div>


                    {/* USERS TABLE */}

                    <div className="admin-users-table-wrapper">

                        <table className="admin-users-table">

                            <thead>

                                <tr>

                                    <th>User ID</th>

                                    <th>Username</th>

                                    <th>Email</th>

                                    <th>Role</th>

                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentUsers.length > 0 ? (

                                    currentUsers.map((user) => (

                                        <tr key={user.userid}>
                                        

                                            <td>{user.userid}</td>


                                            <td><strong>{user.username}</strong></td>

                                            <td>{user.email}</td>


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
                                                    className="admin-view-user-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${user.userid}`
                                                        )
                                                    }
                                                >

                                                    <Eye size={17} />

                                                    View Details

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


                   
                    {/* PAGINATION */}
                    {totalPages > 1 && (

                        <div className="admin-users-pagination">

                            <button
                                className="pagination-btn"
                                onClick={() =>
                                    goToPage(
                                        currentPage - 1
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                            >
                                Previous
                            </button>


                            <div className="pagination-pages">

                                {Array.from(
                                    {
                                        length: totalPages
                                    },
                                    (_, index) => {

                                        const page =
                                            index + 1;

                                        return (
                                            <button
                                                key={page}
                                                className={`pagination-number ${
                                                    currentPage === page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    goToPage(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        );
                                    }
                                )}

                            </div>


                            <button
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
                            >
                                Next
                            </button>

                        </div>

                    )}


                    {/* PAGINATION INFO */}
                    {users.length > 0 && (

                        <div className="admin-users-pagination-info">

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

            </div>



                ADD USER MODAL


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

                    <div className="admin-add-user-modal">


                        {/* MODAL HEADER */}

                        <div className="admin-add-user-modal-header">

                            <div className="admin-add-user-title">

                                <div className="admin-add-user-icon">

                                    <UserPlus size={22} />

                                </div>

                                <div>

                                    <h2>
                                        Add User
                                    </h2>

                                    <p>
                                        Create a new SalesSavvy account
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="admin-add-user-close"
                                onClick={closeAddUserModal}
                                disabled={creatingUser}
                            >

                                <X size={21} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="admin-add-user-form"
                            onSubmit={handleCreateUser}
                        >


                            {/* USERNAME */}

                            <div className="admin-form-group">

                                <label>
                                    Username
                                </label>

                                <div className="admin-form-input">

                                    <User size={18} />

                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="admin-form-group">

                                <label>
                                    Email
                                </label>

                                <div className="admin-form-input">

                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="admin-form-group">

                                <label>
                                    Password
                                </label>

                                <div className="admin-form-input">

                                    <Lock size={18} />

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="admin-form-group">

                                <label>
                                    Confirm Password
                                </label>

                                <div className="admin-form-input">

                                    <Lock size={18} />

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="admin-form-group">

                                <label>
                                    Account Type
                                </label>

                                <div className="admin-form-input">

                                    <ShieldCheck size={18} />

                                    <select
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


                            {/* ERROR */}

                            {formError && (

                                <div className="admin-add-user-form-error">

                                    {formError}

                                </div>

                            )}


                            {/* SUCCESS */}

                            {formSuccess && (

                                <div className="admin-add-user-form-success">

                                    {formSuccess}

                                </div>

                            )}


                            {/* ACTIONS */}

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