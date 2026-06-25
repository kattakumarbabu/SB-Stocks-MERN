import { NavLink, useNavigate } from "react-router-dom";
import { FaChartLine, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <nav className="navbar navbar-expand-lg app-navbar shadow-sm">

            <div className="container">

                <NavLink
                    className="navbar-brand d-flex align-items-center gap-2"
                    to="/dashboard"
                >
                    <span className="stat-icon" style={{ marginBottom: 0, width: 38, height: 38, background: "linear-gradient(135deg, var(--primary), #60a5fa)" }}>
                        <FaChartLine />
                    </span>
                    <span>SB Stocks</span>
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <div className="navbar-nav me-auto ms-3">

                        <NavLink className="nav-link" to="/dashboard">
                            Dashboard
                        </NavLink>

                        <NavLink className="nav-link" to="/portfolio">
                            Portfolio
                        </NavLink>

                        <NavLink className="nav-link" to="/transactions">
                            Transactions
                        </NavLink>

                        <NavLink className="nav-link" to="/watchlist">
                            Watchlist
                        </NavLink>

                        {user?.role === "admin" && (
                            <NavLink className="nav-link" to="/admin">
                                Admin
                            </NavLink>
                        )}

                    </div>

                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                        <span className="navbar-text d-flex align-items-center gap-2">
                            <FaUserCircle />
                            <span>{user?.name}</span>
                        </span>

                        <button className="btn btn-danger btn-sm d-flex align-items-center gap-2" onClick={logout}>
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;