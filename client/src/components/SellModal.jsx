import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";

function SellModal({ portfolio, onClose, refreshPortfolio }) {

    const [quantity, setQuantity] = useState(1);

    const user = JSON.parse(localStorage.getItem("user"));

    const sellStock = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.post(
                "/trade/sell",
                {
                    userId: user.id,
                    stockId: portfolio.stock._id,
                    quantity: Number(quantity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            const updatedUser = {
                ...user,
                virtualBalance: res.data.remainingBalance
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            refreshPortfolio();

            onClose();

            window.location.reload();

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Sell Failed"
            );

        }

    };

    return (

        <div className="card p-4 mt-3 border border-danger-subtle">
            <h4 className="mb-3">Sell {portfolio.stock.symbol}</h4>
            <p className="text-muted">Choose the number of shares to sell from your holdings.</p>

            <input
                type="number"
                className="form-control mb-3"
                value={quantity}
                min="1"
                max={portfolio.quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="d-flex gap-2">
                <button className="btn btn-danger d-flex align-items-center gap-2" onClick={sellStock}>
                    <FaCheck /> Confirm Sell
                </button>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={onClose}>
                    <FaTimes /> Cancel
                </button>
            </div>
        </div>

    );

}

export default SellModal;