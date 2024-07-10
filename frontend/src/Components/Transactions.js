import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css";
import TransactionSummary, { Countdown } from "./TransactionSummary"; // Import components for summary and countdown
import logo3 from "./logo3.png";
import html2canvas from "html2canvas";
import logo1 from "./logo1.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState({
    deposits: [],
    sends: [],
    withdraws: [],
  });
  const [logos, setLogos] = useState({});
  const [selectedTab, setSelectedTab] = useState("deposits");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const mainContentRef = useRef();
  const downloadButtonRef = useRef();
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        console.error("User ID is not available in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/api/transactions/${userId}`
        );
        if (response && response.data) {
          setTransactions(response.data);
        } else {
          console.error("No data returned from the API");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 250,
              page: 1,
              sparkline: false,
            },
          }
        );
        const logoMap = {};
        response.data.forEach((coin) => {
          logoMap[coin.symbol.toUpperCase()] = coin.image;
        });
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const captureScreenshot = useCallback(async () => {
    if (mainContentRef.current && logoLoaded) {
      downloadButtonRef.current.style.display = "none";
      const canvas = await html2canvas(mainContentRef.current);
      downloadButtonRef.current.style.display = "block";

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "transaction_report.png";
      link.click();
    }
  }, [logoLoaded]);

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };

  const renderDeposits = () =>
    transactions.deposits.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.selectedSymbol.toUpperCase()]}
        />
      </li>
    ));

  const renderSends = () =>
    transactions.sends.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <div
          className="transaction-summary"
          style={{ backgroundColor: "#f0f0f0be" }}
        >
          <div className="summary-header">
            <div style={{ fontSize: "20px", display: "block" }}>
              <h1>
                <b>{transaction.symbol.toUpperCase()}</b>
              </h1>
            </div>
            <div
              className="transaction-details"
              style={{ backgroundColor: "#f0f0f0be" }}
            >
              <p className="label">
                Amount: <span className="value">{transaction.amount}</span>
              </p>
            </div>
          </div>
          <div>
            <p>{new Date(transaction.createdAt).toLocaleString()}</p>
            <p
              className={`status ${
                transaction.status === "complete" ? "completed" : "pending"
              }`}
            >
              {transaction.status === "complete" ? "✓" : "⏳"}{" "}
              <span>{transaction.status}</span>
            </p>
          </div>
        </div>
      </li>
    ));

  const renderWithdraws = () =>
    transactions.withdraws.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.selectedSymbol.toUpperCase()]}
        />
      </li>
    ));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header style={{ backgroundColor: "#4caf50" }}>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h1>
            <Link to="/">TrustCoinFX</Link>
          </h1>
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div
        id="sidebar"
        className={`sidebar ${isMenuOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <img src={logo3} alt="logo" />
          <p>
            <b>UID: {userId}</b>
          </p>
        </div>
        <div className="functions">
          <ul>
            <li>
              <Link to="/wallet" className="link">
                <i className="fas fa-wallet"></i> Wallet
              </Link>
            </li>
            <li>
              <Link to="/tradepage">
                <i className="fas fa-exchange-alt"></i> Trade
              </Link>
            </li>
            <li>
              <Link to="/result">
                <i className="fas fa-chart-line"></i> Result
              </Link>
            </li>
            <li>
              <Link to="/transaction">
                <i className="fas fa-pen"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Transaction History</h2>
          <p>Manage your deposits, sends, and withdraws</p>
        </div>
        <div className="button-group">
          <button
            className={`tab-button ${
              selectedTab === "deposits" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("deposits")}
          >
            Deposits
          </button>
          <button
            className={`tab-button ${selectedTab === "sends" ? "active" : ""}`}
            onClick={() => setSelectedTab("sends")}
          >
            Sends
          </button>
          <button
            className={`tab-button ${
              selectedTab === "withdraws" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("withdraws")}
          >
            Withdraws
          </button>
        </div>
        <ul className="transaction-list">
          {transactions[selectedTab].length === 0 ? (
            <p className="no-transactions">
              No {selectedTab} found for this user.
            </p>
          ) : (
            (selectedTab === "deposits" && renderDeposits()) ||
            (selectedTab === "sends" && renderSends()) ||
            (selectedTab === "withdraws" && renderWithdraws())
          )}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        {/* <button
          onClick={captureScreenshot}
          ref={downloadButtonRef}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            background: "none",
            border: "none",
            marginTop: "30px",
          }}
          disabled={!logoLoaded} // Disable button until logo is loaded
        >
          <i className="fas fa-download" style={{ fontSize: "24px" }}></i>
        </button> */}
      </div>
    </div>
  );
};

export default Transactions;
