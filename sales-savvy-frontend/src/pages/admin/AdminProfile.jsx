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


    // ============================================================
    // LOAD PROFILE
    // ============================================================

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
                        data.error ||
                        "Unable to load profile"
                    );
                }

                setProfile(data);

            } catch (error) {

                console.error(
                    "Failed to load admin profile:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load profile."
                );

            } finally {

                setLoading(false);
            }
        };


        loadProfile();

    }, []);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <>
                <AdminNavbar />

                <div className="admin-profile-page">

                    <div className="admin-profile-loading">
                        Loading profile...
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
                <AdminNavbar />

                <div className="admin-profile-page">

                    <div className="admin-profile-error">

                        <UserCircle size={55} />

                        <h2>
                            Unable to Load Profile
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/admin/dashboard"
                            className="admin-profile-back-btn"
                        >
                            Back to Dashboard
                        </Link>

                    </div>

                </div>
            </>
        );
    }


    if (!profile) {
        return null;
    }


    // ============================================================
    // PROFILE PAGE
    // ============================================================

    return (
        <>
            <AdminNavbar />

            <div className="admin-profile-page">

                <div className="admin-profile-container">


                    {/* =================================================
                        BACK
                    ================================================== */}

                    <Link
                        to="/admin/dashboard"
                        className="admin-profile-back-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Dashboard

                    </Link>


                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div className="admin-profile-header">

                        <div className="admin-profile-avatar">

                            <UserCircle size={70} />

                        </div>

                        <div className="admin-profile-heading">

                            <div className="admin-profile-title-row">

                                <h1>
                                    My Profile
                                </h1>

                                <span className="admin-profile-badge">
                                    ADMIN
                                </span>

                            </div>

                            <p>
                                Manage your administrator account information
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        PROFILE CARD
                    ================================================== */}

                    <div className="admin-profile-card">


                        {/* USERNAME */}

                        <div className="admin-profile-info-row">

                            <div className="admin-profile-info-icon">

                                <UserCircle size={22} />

                            </div>

                            <div className="admin-profile-info-content">

                                <span>
                                    Username
                                </span>

                                <strong>
                                    {profile.username}
                                </strong>

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="admin-profile-info-row">

                            <div className="admin-profile-info-icon">

                                <Mail size={22} />

                            </div>

                            <div className="admin-profile-info-content">

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {profile.email}
                                </strong>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="admin-profile-info-row">

                            <div className="admin-profile-info-icon">

                                <ShieldCheck size={22} />

                            </div>

                            <div className="admin-profile-info-content">

                                <span>
                                    Account Type
                                </span>

                                <strong className="admin-profile-role">
                                    {profile.role}
                                </strong>

                            </div>

                        </div>


                        {/* USER ID */}

                        <div className="admin-profile-info-row">

                            <div className="admin-profile-info-icon">

                                <UserCircle size={22} />

                            </div>

                            <div className="admin-profile-info-content">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    {profile.userid}
                                </strong>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        ACCOUNT INFO
                    ================================================== */}

                    <div className="admin-profile-account-note">

                        <CalendarDays size={20} />

                        <span>
                            Your administrator account information is
                            securely retrieved from your SalesSavvy account.
                        </span>

                    </div>


                </div>

            </div>
        </>
    );
}


export default AdminProfile;