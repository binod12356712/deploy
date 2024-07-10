import React from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionSummary.css"; // Import the CSS file

const TransactionSummary = ({ transaction, logo }) => {
  const navigate = useNavigate();

  const handleNavigateToDetails = () => {
    navigate(`/transaction/${transaction._id}`);
  };

  const isApproved = transaction.status === "complete";
  const transactionAmount = transaction.amount;
  const selectedSymbol = transaction.symbol
    ? transaction.symbol.toUpperCase()
    : "UNKNOWN";

  const statusClass = isApproved ? "completed" : "pending";
  const statusIcon = isApproved ? "✓" : "⏳";
  const statusMessage = isApproved ? "Completed" : "Pending";

  return (
    <div
      className="transaction-summary"
      onClick={handleNavigateToDetails}
      style={{ backgroundColor: "#f0f0f0be" }}
    >
      <div className="summary-header">
        <div style={{ fontSize: "20px", display: "block" }}>
          <h1>
            <b>{selectedSymbol}</b>
          </h1>
        </div>
        <div
          className="transaction-details"
          style={{ backgroundColor: "#f0f0f0be" }}
        >
          <p className="label">
            Amount: <span className="value">{transactionAmount}</span>
          </p>
        </div>
      </div>
      <div>
        <p>{new Date(transaction.createdAt).toLocaleString()}</p>
        <p className={`status ${statusClass}`}>
          {statusIcon} <span>{statusMessage}</span>
        </p>
      </div>
    </div>
  );
};

export const Countdown = ({ deliveryTime, predictedAt }) => {
  const [timeLeft, setTimeLeft] = React.useState(
    Math.max(
      0,
      deliveryTime * 1000 - (Date.now() - new Date(predictedAt).getTime())
    )
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(
        Math.max(
          0,
          deliveryTime * 1000 - (Date.now() - new Date(predictedAt).getTime())
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [deliveryTime, predictedAt]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return <span>{formatTime(timeLeft)}</span>;
};

export default TransactionSummary;
