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

                const response = await fetch(
                    "http://localhost:8080/api/users/profile",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data =
                    await response.json();

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

                <div className="profile-page">

                    <div className="profile-loading">
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
                <Navbar />

                <div className="profile-page">

                    <div className="profile-error">

                        <UserCircle size={55} />

                        <h2>
                            Unable to Load Profile
                        </h2>

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
            <Navbar />

            <div className="profile-page">

                <div className="profile-container">


                    {/* BACK */}

                    <Link
                        to="/products"
                        className="profile-back-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Products

                    </Link>


                    {/* HEADER */}

                    <div className="profile-header">

                        <div className="profile-avatar">

                            <UserCircle size={70} />

                        </div>

                        <div>

                            <h1>
                                My Profile
                            </h1>

                            <p>
                                Manage your account information
                            </p>

                        </div>

                    </div>


                    {/* PROFILE CARD */}

                    <div className="profile-card">


                        {/* USERNAME */}

                        <div className="profile-info-row">

                            <div className="profile-info-icon">

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

                            <div className="profile-info-icon">

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

                            <div className="profile-info-icon">

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

                            <div className="profile-info-icon">

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


                    </div>


                    {/* ACCOUNT INFO */}

                    <div className="profile-account-note">

                        <CalendarDays size={20} />

                        <span>
                            Your account information is securely
                            retrieved from your SalesSavvy account.
                        </span>

                    </div>


                </div>

            </div>
        </>
    );
}


export default Profile;