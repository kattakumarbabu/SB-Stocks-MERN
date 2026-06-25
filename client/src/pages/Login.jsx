import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaChartLine, FaUserCircle } from "react-icons/fa";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login Successful");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Login Failed"
            );

        }

    };

    return (

        <div className="auth-page">

            <ToastContainer />

            <div className="auth-card">
                <div className="text-center mb-4">
                    <div className="stat-icon mx-auto" style={{ width: 60, height: 60, background: "linear-gradient(135deg, var(--primary), #60a5fa)" }}>
                        <FaChartLine />
                    </div>
                    <h2 className="mt-3 mb-2">Welcome to SB Stocks</h2>
                    <p className="text-white-50">Virtual stock trading, reimagined for modern investors.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Email</label>
                        <input type="email" name="email" placeholder="Enter your email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Password</label>
                        <input type="password" name="password" placeholder="Enter your password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-2">
                        Login
                    </button>
                </form>

                <div className="d-flex align-items-center justify-content-center gap-2 mt-4 text-white-50">
                    <FaUserCircle />
                    <span>New here?</span>
                    <Link to="/register" className="auth-link">Create an account</Link>
                </div>
            </div>

        </div>

    );

}

export default Login;