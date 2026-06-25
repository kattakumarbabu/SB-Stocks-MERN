import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaChartLine, FaUserPlus } from "react-icons/fa";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

            const res = await api.post("/auth/register", formData);

            toast.success(res.data.message);

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Registration Failed"
            );

        }
    };

    return (
        <div className="auth-page">

            <ToastContainer />

            <div className="auth-card">
                <div className="text-center mb-4">
                    <div className="stat-icon mx-auto" style={{ width: 60, height: 60, background: "linear-gradient(135deg, var(--success), #4ade80)" }}>
                        <FaChartLine />
                    </div>
                    <h2 className="mt-3 mb-2">Create your account</h2>
                    <p className="text-white-50">Join the platform and start trading virtually.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Name</label>
                        <input type="text" name="name" placeholder="Enter your name" className="form-control" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Email</label>
                        <input type="email" name="email" placeholder="Enter your email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Password</label>
                        <input type="password" name="password" placeholder="Create a password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>
                    <button className="btn btn-success w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                        <FaUserPlus /> Register
                    </button>
                </form>

                <div className="d-flex align-items-center justify-content-center gap-2 mt-4 text-white-50">
                    <span>Already joined?</span>
                    <Link to="/" className="auth-link">Back to login</Link>
                </div>
            </div>

        </div>
    );
}

export default Register;