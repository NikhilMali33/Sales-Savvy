import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    UserCircle,
    Mail,
    ShieldCheck,
    CalendarDays
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import "../../styles/customer/Profile.css";


function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================================
    // LOAD PROFILE
    // ============================================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);
                setError("");

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
                    "Failed to load profile:",
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
                <Navbar />

                <main
                    className="profile-page"
                    aria-labelledby="profile-loading-title"
                >

                    <div
                        className="profile-loading"
                        role="status"
                        aria-live="polite"
                    >

                        <h1
                            id="profile-loading-title"
                            className="visually-hidden"
                        >
                            Loading profile
                        </h1>

                        <span>
                            Loading profile...
                        </span>

                    </div>

                </main>
            </>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (
            <>
                <Navbar />

                <main
                    className="profile-page"
                    aria-labelledby="profile-error-title"
                >

                    <div
                        className="profile-error"
                        role="alert"
                    >

                        <UserCircle
                            size={55}
                            aria-hidden="true"
                        />

                        <h1 id="profile-error-title">
                            Unable to Load Profile
                        </h1>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/products"
                            className="profile-back-btn"
                        >
                            Back to Products
                        </Link>

                    </div>

                </main>
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
            <Navbar />

            <main
                className="profile-page"
                aria-labelledby="profile-page-title"
            >

                <div className="profile-container">


                    {/* BACK */}

                    <Link
                        to="/products"
                        className="profile-back-link"
                    >

                        <ArrowLeft
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Back to Products
                        </span>

                    </Link>


                    {/* HEADER */}

                    <header className="profile-header">

                        <div
                            className="profile-avatar"
                            aria-hidden="true"
                        >

                            <UserCircle size={70} />

                        </div>

                        <div>

                            <h1 id="profile-page-title">
                                My Profile
                            </h1>

                            <p>
                                Manage your account information
                            </p>

                        </div>

                    </header>


                    {/* PROFILE CARD */}

                    <section
                        className="profile-card"
                        aria-labelledby="profile-information-title"
                    >

                        <h2
                            id="profile-information-title"
                            className="visually-hidden"
                        >
                            Profile Information
                        </h2>


                        {/* USERNAME */}

                        <div className="profile-info-row">

                            <div
                                className="profile-info-icon"
                                aria-hidden="true"
                            >

                                <UserCircle size={22} />

                            </div>

                            <div className="profile-info-content">

                                <span>
                                    Username
                                </span>

                                <strong>
                                    {profile.username}
                                </strong>

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="profile-info-row">

                            <div
                                className="profile-info-icon"
                                aria-hidden="true"
                            >

                                <Mail size={22} />

                            </div>

                            <div className="profile-info-content">

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {profile.email}
                                </strong>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="profile-info-row">

                            <div
                                className="profile-info-icon"
                                aria-hidden="true"
                            >

                                <ShieldCheck size={22} />

                            </div>

                            <div className="profile-info-content">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    {profile.role}
                                </strong>

                            </div>

                        </div>


                        {/* USER ID */}

                        <div className="profile-info-row">

                            <div
                                className="profile-info-icon"
                                aria-hidden="true"
                            >

                                <UserCircle size={22} />

                            </div>

                            <div className="profile-info-content">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    {profile.userid}
                                </strong>

                            </div>

                        </div>


                    </section>


                    {/* ACCOUNT INFO */}

                    <aside
                        className="profile-account-note"
                        aria-label="Account information notice"
                    >

                        <CalendarDays
                            size={20}
                            aria-hidden="true"
                        />

                        <span>
                            Your account information is securely
                            retrieved from your SalesSavvy account.
                        </span>

                    </aside>


                </div>

            </main>
        </>
    );
}


export default Profile;