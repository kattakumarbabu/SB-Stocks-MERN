import { FaWallet, FaArrowTrendUp, FaChartPie, FaCoins } from "react-icons/fa6";

function DashboardCards({ balance, portfolio }) {

    const totalHoldings = portfolio.length;

    const portfolioValue = portfolio.reduce((sum, item) => {

        if (!item.stock) return sum;

        return sum + item.quantity * item.stock.currentPrice;

    }, 0);

    const totalInvestment = portfolio.reduce((sum, item) => {

        return sum + item.quantity * item.averagePrice;

    }, 0);

    const cards = [
        {
            title: "Virtual Balance",
            value: `$${Number(balance || 0).toFixed(2)}`,
            icon: <FaWallet />,
            gradient: "linear-gradient(135deg, #2563eb, #60a5fa)"
        },
        {
            title: "Portfolio Value",
            value: `$${portfolioValue.toFixed(2)}`,
            icon: <FaArrowTrendUp />,
            gradient: "linear-gradient(135deg, #22c55e, #4ade80)"
        },
        {
            title: "Holdings",
            value: totalHoldings,
            icon: <FaChartPie />,
            gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)"
        },
        {
            title: "Total Investment",
            value: `$${totalInvestment.toFixed(2)}`,
            icon: <FaCoins />,
            gradient: "linear-gradient(135deg, #0f172a, #334155)"
        }
    ];

    return (

        <div className="row g-3">

            {cards.map((card) => (
                <div key={card.title} className="col-12 col-md-6 col-xl-3">
                    <div className="card stat-card" style={{ background: card.gradient }}>
                        <div className="stat-icon" style={{ background: "rgba(255,255,255,0.18)" }}>
                            {card.icon}
                        </div>
                        <div className="stat-label">{card.title}</div>
                        <div className="stat-value">{card.value}</div>
                    </div>
                </div>
            ))}

        </div>

    );

}

export default DashboardCards;