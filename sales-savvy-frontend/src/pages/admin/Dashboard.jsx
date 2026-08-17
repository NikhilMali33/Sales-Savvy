import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

import "../../styles/admin/Dashboard.css";

function Dashboard() {

    return (

        <div className="admin-layout">

            <Sidebar />

            <Topbar />

            <div className="admin-content">

                <h1>Dashboard</h1>

            </div>

        </div>

    );

}

export default Dashboard;