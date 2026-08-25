import { useEffect, useState } from "react";
import { Users as UsersIcon, Eye } from "lucide-react";
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

    // ============================================================
    // PAGINATION
    // ============================================================

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


    // ============================================================
    // LOAD USERS
    // ============================================================

    useEffect(() => {

        const fetchUsers = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getAllUsers();

                setUsers(response.data);

            } catch (err) {

                console.error(
                    "Failed to load users:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load users."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchUsers();

    }, []);


    // ============================================================
    // PAGE CHANGE
    // ============================================================

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


    // ============================================================
    // LOADING
    // ============================================================

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


    // ============================================================
    // ERROR
    // ============================================================

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


    // ============================================================
    // USERS PAGE
    // ============================================================

    return (
        <>
            <AdminNavBar />

            <div className="admin-users-page">

                <div className="admin-users-container">

                    {/* ====================================================
                        PAGE HEADER
                    ==================================================== */}

                    <div className="admin-users-header">

                        <div>

                            <h1>
                                Users
                            </h1>

                            <p>
                                Manage registered users
                            </p>

                        </div>

                        <UsersIcon size={40} />

                    </div>


                    {/* ====================================================
                        USERS TABLE
                    ==================================================== */}

                    <div className="admin-users-table-wrapper">

                        <table className="admin-users-table">

                            <thead>

                                <tr>

                                    <th>
                                        User ID
                                    </th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentUsers.length > 0 ? (

                                    currentUsers.map((user) => (

                                        <tr key={user.userid}>

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


                    {/* ====================================================
                        PAGINATION
                    ==================================================== */}

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


                    {/* ====================================================
                        PAGINATION INFO
                    ==================================================== */}

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
        </>
    );
}

export default Users;