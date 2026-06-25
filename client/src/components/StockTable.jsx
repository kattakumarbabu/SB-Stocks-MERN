import { useState } from "react";
import BuyModal from "./BuyModal";
import api from "../services/api";
import { toast } from "react-toastify";

function StockTable({ stocks, search }) {

    const [selectedStock, setSelectedStock] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const filteredStocks = stocks.filter((stock) =>
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(search.toLowerCase())
    );

    const addToWatchlist = async (stockId) => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.post(
                "/watchlist",
                {
                    userId: user.id,
                    stockId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Failed"
            );

        }

    };

    return (
        <>

            <table className="table table-striped table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Sector</th>
                        <th>Price</th>
                        <th>Buy</th>
                        <th>Watchlist</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredStocks.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="text-center"
                            >
                                No Stocks Found
                            </td>

                        </tr>

                    ) : (

                        filteredStocks.map((stock) => (

                            <tr key={stock._id}>

                                <td>{stock.symbol}</td>

                                <td>{stock.companyName}</td>

                                <td>{stock.sector}</td>

                                <td>${stock.currentPrice}</td>

                                <td>

                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => setSelectedStock(stock)}
                                    >
                                        Buy
                                    </button>

                                </td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => addToWatchlist(stock._id)}
                                    >
                                        ⭐
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            {selectedStock && (

                <BuyModal
                    stock={selectedStock}
                    onClose={() => setSelectedStock(null)}
                    refreshStocks={() => window.location.reload()}
                />

            )}

        </>
    );

}

export default StockTable;