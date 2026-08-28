import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    UserCircle,
    Mail,
    ShieldCheck,
    CalendarDays
} from "lucide-react";

import AdminNavbar from "../../components/layout/AdminNavbar";

import "../../styles/admin/AdminProfile.css";

function AdminProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load administrator profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/users/profile",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Unable to load profile"
                    );
                }

                setProfile(data);
            } catch (error) {
                console.error(
                    "Failed to load admin profile:",
                    error
                );

                setError(
                    error.message || "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Loading state
    if (loading) {
        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-profile-page"
                    aria-busy="true"
                    aria-labelledby="profile-loading-heading"
                >
                    <div className="admin-profile-loading">
                        <span
                            id="profile-loading-heading"
                            role="status"
                            aria-live="polite"
                        >
                            Loading profile...
                        </span>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <AdminNavbar />

                <main className="admin-profile-page">
                    <div
                        className="admin-profile-error"
                        role="alert"
                        aria-labelledby="profile-error-heading"
                    >
                        <UserCircle
                            size={55}
                            aria-hidden="true"
                        />

                        <h1 id="profile-error-heading">
                            Unable to Load Profile
                        </h1>

                        <p>{error}</p>

                        <Link
                            to="/admin/dashboard"
                            className="admin-profile-back-btn"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <>
            <AdminNavbar />

            <main className="admin-profile-page">
                <div className="admin-profile-container">

                    <Link
                        to="/admin/dashboard"
                        className="admin-profile-back-link"
                    >
                        <ArrowLeft
                            size={18}
                            aria-hidden="true"
                        />
                        <span>Back to Dashboard</span>
                    </Link>

                    <header className="admin-profile-header">
                        <div
                            className="admin-profile-avatar"
                            aria-hidden="true"
                        >
                            <UserCircle size={70} />
                        </div>

                        <div className="admin-profile-heading">
                            <div className="admin-profile-title-row">
                                <h1>My Profile</h1>

                                <span
                                    className="admin-profile-badge"
                                    aria-label="Administrator account"
                                >
                                    ADMIN
                                </span>
                            </div>

                            <p>
                                Manage your administrator account
                                information
                            </p>
                        </div>
                    </header>

                    <section
                        className="admin-profile-card"
                        aria-labelledby="profile-information-heading"
                    >
                        <h2
                            id="profile-information-heading"
                            className="sr-only"
                        >
                            Profile Information
                        </h2>

                        <div className="admin-profile-info-row">
                            <div
                                className="admin-profile-info-icon"
                                aria-hidden="true"
                            >
                                <UserCircle size={22} />
                            </div>

                            <div className="admin-profile-info-content">
                                <span>Username</span>
                                <strong>{profile.username}</strong>
                            </div>
                        </div>

                        <div className="admin-profile-info-row">
                            <div
                                className="admin-profile-info-icon"
                                aria-hidden="true"
                            >
                                <Mail size={22} />
                            </div>

                            <div className="admin-profile-info-content">
                                <span>Email Address</span>
                                <strong>{profile.email}</strong>
                            </div>
                        </div>

                        <div className="admin-profile-info-row">
                            <div
                                className="admin-profile-info-icon"
                                aria-hidden="true"
                            >
                                <ShieldCheck size={22} />
                            </div>

                            <div className="admin-profile-info-content">
                                <span>Account Type</span>

                                <strong className="admin-profile-role">
                                    {profile.role}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-profile-info-row">
                            <div
                                className="admin-profile-info-icon"
                                aria-hidden="true"
                            >
                                <UserCircle size={22} />
                            </div>

                            <div className="admin-profile-info-content">
                                <span>User ID</span>
                                <strong>{profile.userid}</strong>
                            </div>
                        </div>
                    </section>

                    <aside
                        className="admin-profile-account-note"
                        aria-label="Account information"
                    >
                        <CalendarDays
                            size={20}
                            aria-hidden="true"
                        />

                        <span>
                            Your administrator account information is
                            securely retrieved from your SalesSavvy account.
                        </span>
                    </aside>
                </div>
            </main>
        </>
    );
}

export default AdminProfile;