import { useEffect, useState } from "react";
import { FaStar, FaInbox } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";

function Watchlist() {

    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await api.get(
                `/watchlist/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWatchlist(res.data.watchlist);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const removeFromWatchlist = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/watchlist/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Removed Successfully");

            fetchWatchlist();

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Failed to Remove"
            );

        }

    };

    return (

        <>
            <Navbar />
            <ToastContainer />

            <div className="container page-shell">
                <div className="page-hero">
                    <h2>Watchlist</h2>
                    <p>Keep track of stocks you want to watch closely.</p>
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
                                        <th>Current Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchlist.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                <div className="empty-state">
                                                    <div className="empty-state-icon"><FaInbox /></div>
                                                    <h5>Your watchlist is empty</h5>
                                                    <p>Add symbols from the dashboard to keep an eye on them.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        watchlist.map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.stock?.symbol || "N/A"}</td>
                                                <td>{item.stock?.companyName || "Deleted Stock"}</td>
                                                <td>{item.stock?.sector || "-"}</td>
                                                <td>${item.stock?.currentPrice || 0}</td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm d-flex align-items-center gap-2" disabled={!item.stock} onClick={() => removeFromWatchlist(item._id)}>
                                                        <FaStar /> Remove
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

export default Watchlist;