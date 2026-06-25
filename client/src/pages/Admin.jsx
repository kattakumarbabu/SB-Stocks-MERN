import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaChartLine } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";

function Admin() {

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        symbol: "",
        companyName: "",
        sector: "",
        currentPrice: "",
        marketCap: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {

        try {

            setLoading(true);

            const res = await api.get("/stocks");

            setStocks(res.data.stocks);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const saveStock = async () => {

        try {

            const token = localStorage.getItem("token");

            if (editingId) {

                await api.put(
                    `/stocks/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                toast.success("Stock Updated");

            } else {

                await api.post(
                    "/stocks",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                toast.success("Stock Added");

            }

            setForm({
                symbol: "",
                companyName: "",
                sector: "",
                currentPrice: "",
                marketCap: ""
            });

            setEditingId(null);

            fetchStocks();

        } catch (error) {

            toast.error(error.response?.data?.message || "Operation Failed");

        }

    };

    const editStock = (stock) => {

        setEditingId(stock._id);

        setForm({
            symbol: stock.symbol,
            companyName: stock.companyName,
            sector: stock.sector,
            currentPrice: stock.currentPrice,
            marketCap: stock.marketCap
        });

    };

    const deleteStock = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/stocks/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Stock Deleted");

            fetchStocks();

        } catch (error) {

            toast.error("Delete Failed");

        }

    };

    return (

        <>
            <Navbar />
            <ToastContainer />

            <div className="container page-shell">
                <div className="page-hero">
                    <h2>Admin Panel</h2>
                    <p>Manage stock listings with a polished control center.</p>
                </div>

                <div className="card p-3 p-md-4 mb-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-2">
                            <input className="form-control" placeholder="Symbol" name="symbol" value={form.symbol} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-3">
                            <input className="form-control" placeholder="Company" name="companyName" value={form.companyName} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-2">
                            <input className="form-control" placeholder="Sector" name="sector" value={form.sector} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-2">
                            <input className="form-control" placeholder="Price" name="currentPrice" value={form.currentPrice} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-2">
                            <input className="form-control" placeholder="Market Cap" name="marketCap" value={form.marketCap} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-1">
                            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={saveStock}>
                                {editingId ? <FaEdit /> : <FaPlus />}
                                {editingId ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="card p-3 p-md-4">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Company</th>
                                        <th>Sector</th>
                                        <th>Price</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="empty-state">
                                                    <div className="empty-state-icon"><FaChartLine /></div>
                                                    <h5>No stocks available</h5>
                                                    <p>Add new instruments to populate the market.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stocks.map((stock) => (
                                            <tr key={stock._id}>
                                                <td>{stock.symbol}</td>
                                                <td>{stock.companyName}</td>
                                                <td>{stock.sector}</td>
                                                <td>${stock.currentPrice}</td>
                                                <td>
                                                    <button className="btn btn-warning btn-sm d-flex align-items-center gap-2" onClick={() => editStock(stock)}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm d-flex align-items-center gap-2" onClick={() => deleteStock(stock._id)}>
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

        </>

    );

}

export default Admin;