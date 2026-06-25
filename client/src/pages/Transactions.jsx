import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import api from "../services/api";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await api.get(
                `/trade/transactions/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransactions(res.data.transactions);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <>
            <Navbar />

            <div className="container page-shell">
                <div className="page-hero">
                    <h2>Transaction History</h2>
                    <p>Review your buy and sell activity with a cleaner audit trail.</p>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="card p-3 p-md-4">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Stock</th>
                                        <th>Company</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">
                                                <div className="empty-state">
                                                    <div className="empty-state-icon"><FaArrowUp /></div>
                                                    <h5>No transactions yet</h5>
                                                    <p>Your buy and sell history will appear here.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td>
                                                    {transaction.type === "BUY" ? (
                                                        <span className="badge-pill badge-buy"><FaArrowUp /> Bought</span>
                                                    ) : (
                                                        <span className="badge-pill badge-sell"><FaArrowDown /> Sold</span>
                                                    )}
                                                </td>
                                                <td>{transaction.stock?.symbol || "N/A"}</td>
                                                <td>{transaction.stock?.companyName || "Deleted Stock"}</td>
                                                <td>{transaction.quantity} Shares</td>
                                                <td>${transaction.price}</td>
                                                <td>${transaction.totalAmount}</td>
                                                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
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

export default Transactions;