import { useEffect, useState } from "react";
import { FaBriefcase, FaArrowTrendUp, FaCoins } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import SellModal from "../components/SellModal";
import Loader from "../components/Loader";
import api from "../services/api";

function Portfolio() {

    const [portfolio, setPortfolio] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await api.get(
                `/trade/portfolio/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPortfolio(res.data.portfolio);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const summaryCards = [
        {
            title: "Positions",
            value: portfolio.length,
            icon: <FaBriefcase />,
            gradient: "linear-gradient(135deg, var(--primary), #60a5fa)"
        },
        {
            title: "Market Value",
            value: `$${portfolio.reduce((sum, item) => sum + item.quantity * (item.stock?.currentPrice || 0), 0).toFixed(2)}`,
            icon: <FaArrowTrendUp />,
            gradient: "linear-gradient(135deg, var(--success), #4ade80)"
        },
        {
            title: "Avg. Cost",
            value: `$${portfolio.reduce((sum, item) => sum + item.quantity * item.averagePrice, 0).toFixed(2)}`,
            icon: <FaCoins />,
            gradient: "linear-gradient(135deg, #0f172a, #334155)"
        }
    ];

    return (
        <>
            <Navbar />

            <div className="container page-shell">
                <div className="page-hero">
                    <h2>Portfolio Overview</h2>
                    <p>Watch your real-time positions and make confident decisions from one place.</p>
                </div>

                <div className="row g-3 mb-4">
                    {summaryCards.map((card) => (
                        <div key={card.title} className="col-12 col-md-4">
                            <div className="card stat-card" style={{ background: card.gradient }}>
                                <div className="stat-icon" style={{ background: "rgba(255,255,255,0.18)" }}>{card.icon}</div>
                                <div className="stat-label">{card.title}</div>
                                <div className="stat-value">{card.value}</div>
                            </div>
                        </div>
                    ))}
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
                                        <th>Quantity</th>
                                        <th>Average Price</th>
                                        <th>Current Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="empty-state">
                                                    <div className="empty-state-icon"><FaBriefcase /></div>
                                                    <h5>No stocks purchased yet</h5>
                                                    <p>Start building your portfolio from the dashboard.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        portfolio.map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.stock?.symbol || "N/A"}</td>
                                                <td>{item.stock?.companyName || "Deleted Stock"}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.averagePrice}</td>
                                                <td>${item.stock?.currentPrice || 0}</td>
                                                <td>
                                                    {item.stock ? (
                                                        <button className="btn btn-danger btn-sm" onClick={() => setSelectedPortfolio(item)}>
                                                            Sell
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-secondary btn-sm" disabled>
                                                            Unavailable
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {selectedPortfolio && (
                            <SellModal
                                portfolio={selectedPortfolio}
                                onClose={() => setSelectedPortfolio(null)}
                                refreshPortfolio={fetchPortfolio}
                            />
                        )}
                    </div>
                )}

            </div>

        </>
    );

}

export default Portfolio;