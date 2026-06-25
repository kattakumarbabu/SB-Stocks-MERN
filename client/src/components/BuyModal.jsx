import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";

function BuyModal({ stock, onClose, refreshStocks }) {

    const [quantity, setQuantity] = useState(1);

    const user = JSON.parse(localStorage.getItem("user"));

    const buyStock = async () => {

        try {

            const res = await api.post("/trade/buy", {
                userId: user.id,
                stockId: stock._id,
                quantity: Number(quantity)
            });

            toast.success(res.data.message);

            const updatedUser = {
                ...user,
                virtualBalance: res.data.remainingBalance
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            refreshStocks();

            onClose();

        } catch (error) {

            toast.error(error.response?.data?.message);

        }

    };

    return (

        <div className="card p-4 mt-3 border border-success-subtle">
            <h4 className="mb-3">Buy {stock.symbol}</h4>
            <p className="text-muted">Enter the number of shares you want to purchase.</p>

            <input
                type="number"
                className="form-control mb-3"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="d-flex gap-2">
                <button className="btn btn-success d-flex align-items-center gap-2" onClick={buyStock}>
                    <FaCheck /> Confirm Buy
                </button>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={onClose}>
                    <FaTimes /> Cancel
                </button>
            </div>
        </div>

    );

}

export default BuyModal;