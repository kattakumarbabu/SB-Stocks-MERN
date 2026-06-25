import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PortfolioChart({ portfolio }) {

    const labels = portfolio.map(
        item => item.stock?.symbol || "N/A"
    );

    const values = portfolio.map(
        item => item.quantity * (item.stock?.currentPrice || 0)
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Portfolio Value ($)",
                data: values,
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            }
        }
    };

    return (
        <div className="card shadow p-4 mt-4">
            <h4 className="mb-3">Portfolio Overview</h4>
            <Bar data={data} options={options} />
        </div>
    );

}

export default PortfolioChart;