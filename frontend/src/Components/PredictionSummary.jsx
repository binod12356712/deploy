import React from "react";
import { useNavigate } from "react-router-dom";
import "./PredictionSummary.css"; // Import the CSS file

const PredictionSummary = ({ prediction, logo, showResult }) => {
  const navigate = useNavigate();

  const handleNavigateToDetails = () => {
    navigate(`/prediction/${prediction._id}`);
  };

  const logoUrl = `https://coin-images.coingecko.com/coins/images/1/large/${prediction.symbol.toLowerCase()}.png`;

  const isProfit = prediction.result && prediction.result.success;
  const profitLossAmount = prediction.result ? prediction.result.profit : 0;

  const profitLossClass = isProfit ? "profit" : "loss";
  const profitLossIcon = isProfit ? "↑" : "↓";
  const profitLossMessage = prediction.result
    ? isProfit
      ? `You have won ${profitLossAmount} USD`
      : `You have lost all your money`
    : "Pending";

  return (
    <div
      className="prediction-summary"
      onClick={handleNavigateToDetails}
      style={{ backgroundColor: "#f0f0f0be" }}
    >
      <div className="summary-header">
        <div>
          <img
            src={logo || logoUrl}
            alt={`${prediction.symbol} logo`}
            className="logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50"; // Fallback image if logo is not found
            }}
          />
          <h1>{prediction.symbol.toUpperCase()}</h1>
        </div>
        <div>
          <p>{new Date(prediction.predictedAt).toLocaleString()}</p>
          {showResult && prediction.result ? (
            <p className={`profit-loss ${profitLossClass}`}>
              {profitLossIcon}{" "}
              {isProfit ? (
                <span>{profitLossAmount}</span>
              ) : (
                <span className="loss-amount">{prediction.amount}</span>
              )}
            </p>
          ) : (
            <p className="pending">Pending</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
