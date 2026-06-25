import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FaSearch, FaChartLine } from "react-icons/fa";
import api from "../services/api";

import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import PortfolioChart from "../components/PortfolioChart";
import StockTable from "../components/StockTable";
import Loader from "../components/Loader";

function Dashboard() {

    const [stocks, setStocks] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            const token = localStorage.getItem("token");

            const [stocksRes, portfolioRes] = await Promise.all([
                api.get("/stocks"),
                api.get(`/trade/portfolio/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setStocks(stocksRes.data.stocks);
            setPortfolio(portfolioRes.data.portfolio);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <>
            <Navbar />
            <ToastContainer />

            <div className="container page-shell">
                <div className="page-hero d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                    <div>
                        <div className="badge-pill badge-neutral">
                            <FaChartLine />
                            Market synced
                        </div>
                        <h2>Welcome back, {user?.name}</h2>
                        <p>Track your virtual portfolio and discover new opportunities in real time.</p>
                    </div>
                    <div className="text-lg-end">
                        <div className="text-muted">Today’s focus</div>
                        <strong>Build stronger trades with a calm, data-first view.</strong>
                    </div>
                </div>

                <DashboardCards
                    balance={user.virtualBalance}
                    portfolio={portfolio}
                />

                <PortfolioChart portfolio={portfolio} />

                <div className="card p-3 p-md-4 mt-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-8">
                            <h4 className="mb-1">Explore Stocks</h4>
                            <p className="page-subtitle mb-0">Search by symbol or company name.</p>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="position-relative">
                                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Search by Symbol or Company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : (
                        <StockTable
                            stocks={stocks}
                            search={search}
                        />
                    )}
                </div>

            </div>

        </>
    );

}

export default Dashboard;