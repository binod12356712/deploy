import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./WalletDashboard.css"; // Import the CSS file for styling
import image from "./qr.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo3 from "../Components/logo3.png";
import Login from "../Components/Login";
import SignupModal from "../Components/SignupModal";

const WalletDashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Receive");
  const [amount, setAmount] = useState("");
  const [usdtValue, setUsdtValue] = useState("");
  const [address, setAddress] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [proof, setProof] = useState(null);
  const userId = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(
          `http://77.37.86.134:3001/api/wallet/${userId}/balances`
        );
        const data = response.data;

        // Convert "USD" to "USDT" in the fetched data
        if (data.balances["USD"]) {
          data.balances["USDT"] = data.balances["USD"];
          delete data.balances["USD"];
        }
        if (data.prices["USD"]) {
          data.prices["USDT"] = data.prices["USD"];
          delete data.prices["USD"];
        }

        setWalletData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setIsLoading(false);
      }
    };

    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "http://77.37.86.134:3001/api/cryptos"
        );
        setCryptos(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      }
    };

    fetchWalletData();
    fetchCryptos();
  }, [userId]);

  useEffect(() => {
    if (
      walletData &&
      walletData.prices &&
      amount &&
      walletData.prices[selectedSymbol]?.usd
    ) {
      setUsdtValue((amount * walletData.prices[selectedSymbol].usd).toFixed(2));
    } else {
      setUsdtValue("");
    }
  }, [amount, selectedSymbol, walletData]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleCryptoClick = (symbol) => {
    setSelectedSymbol(symbol);
    setSelectedTab("Receive"); // Default to the "Receive" tab
    setShowCryptoModal(true); // Show the crypto modal
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setAddress(text);
  };

  const handleMax = () => {
    const maxAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxAmount);
  };

  const handleSendSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) > walletData.balances[selectedSymbol]) {
      alert("Insufficient balance.");
      return;
    }

    if (parseFloat(amount) <= 0 || amount === "") {
      alert("Amount should be greater than 0.");
      return;
    }

    try {
      await axios.post("http://77.37.86.134:3001/api/send", {
        userId,
        symbol: selectedSymbol,
        amount: parseFloat(amount),
        address,
      });
      alert("Send request submitted successfully");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Error submitting send request:", error);
      alert("Failed to submit send request");
    }
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) > walletData.balances[selectedSymbol]) {
      alert("Insufficient balance.");
      return;
    }

    if (parseFloat(amount) <= 0 || amount === "") {
      alert("Amount should be greater than 0.");
      return;
    }

    try {
      await axios.post("http://77.37.86.134:3001/api/withdraw", {
        userId,
        symbol: selectedSymbol,
        amount: parseFloat(amount),
      });
      alert("Conversion request submitted successfully");
      setAmount("");
      setUsdtValue("");
    } catch (error) {
      console.error("Error submitting conversion request:", error);
      alert("Failed to submit conversion request");
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (selectedCrypto) {
      try {
        const response = await axios.post(
          "http://77.37.86.134:3001/api/convert",
          {
            userId,
            fromSymbol: "USD",
            toSymbol: selectedCrypto.id,
            amount: parseFloat(amount),
          }
        );
        alert("Conversion successful");
        setAmount("");
        setSelectedCrypto(null);
        // Update the wallet data to reflect the new balances
        setWalletData(response.data);
      } catch (error) {
        console.error("Error during conversion:", error);
        alert("Conversion failed");
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) <= 0 || amount === "") {
      alert("Amount should be greater than 0.");
      return;
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("proof", proof);
    formData.append("userId", userId);
    formData.append("selectedSymbol", selectedSymbol);

    try {
      await axios.post("http://77.37.86.134:3001/api/deposit", formData);
      alert("Deposit request submitted successfully");
      setAmount("");
      setProof(null);
      setShowRechargeModal(false);
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      alert("Failed to submit deposit request");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!walletData) {
    return <div>Error fetching wallet data.</div>;
  }

  const { balances, prices } = walletData || { balances: {}, prices: {} };

  const totalBalance = Object.keys(balances).reduce((acc, symbol) => {
    const price = prices[symbol]?.usd;
    if (price !== undefined) {
      return acc + balances[symbol] * price;
    }
    return acc;
  }, 0);

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
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            style={{
              marginRight: "10px",
              fontSize: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            &#8592;
          </button>
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
            <b>UID: {uid}</b>
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
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
            </li>
          </ul>
          <div className="more-options">
            <ul>
              {isLoggedIn ? (
                <li>
                  <Link to="/settings">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                </li>
              ) : (
                <li>
                  <button onClick={() => setShowLoginModal(true)}>
                    <i className="fa-solid fa-person"></i> Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Discover Seamless Crypto Trading</h2>
          <h2>With TrustCoinFX</h2>
          <p>Where Trust is Our Currency</p>
        </div>
        <div className="market-tabs">
          <button className="active">Wallet</button>
        </div>
        <div className="market-list">
          {Object.keys(balances).map((symbol) => (
            <div
              key={symbol}
              className="market-item"
              onClick={() => handleCryptoClick(symbol)}
            >
              <div className="market-info">
                <h3>{symbol === "usd" ? "USDT" : symbol.toUpperCase()}</h3>
                <p>{symbol === "USDT" ? "USD" : "USDT"}</p>
              </div>

              <div className="market-stats">
                <p>
                  {balances[symbol] ? balances[symbol].toFixed(4) : "0.0000"}{" "}
                  {symbol === "usd" ? "USDT" : symbol.toUpperCase()}
                </p>
                <p>
                  USD${" "}
                  {prices[symbol]?.usd !== undefined
                    ? (balances[symbol] * prices[symbol].usd).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCryptoModal && (
        <div className="modal show" id="crypto-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCryptoModal(false)}>
              &times;
            </span>
            <div className="wallet">
              <div className="wallet-header">
                <h1>
                  {selectedSymbol === "usd"
                    ? "USDT"
                    : selectedSymbol.toUpperCase()}{" "}
                  Wallet
                </h1>
              </div>

              <div className="wallet-balance">
                <p>
                  USDT${" "}
                  {(
                    (balances[selectedSymbol] || 0) *
                    (prices[selectedSymbol]?.usd || 0)
                  ).toFixed(4)}
                </p>
                <p>
                  Available: {balances[selectedSymbol] || 0}{" "}
                  {selectedSymbol.toUpperCase()}
                </p>
                <p>Frozen: 0.0000000 {selectedSymbol.toUpperCase()}</p>
              </div>
              <div className="wallet-tabs">
                <button
                  data-tab="Receive"
                  className={selectedTab === "Receive" ? "active" : ""}
                  onClick={() => handleTabClick("Receive")}
                >
                  Receive
                </button>
                <button
                  data-tab="Send"
                  className={selectedTab === "Send" ? "active" : ""}
                  onClick={() => handleTabClick("Send")}
                >
                  Send
                </button>
                <button
                  data-tab="Convert"
                  className={selectedTab === "Convert" ? "active" : ""}
                  onClick={() => handleTabClick("Convert")}
                >
                  Convert
                </button>
              </div>
              {selectedTab === "Receive" && (
                <div id="Receive" className="tab-content active">
                  <p>Deposit funds</p>
                  <div className="wallet-buttons">
                    <span
                      className="recharge-link"
                      onClick={() => setShowRechargeModal(true)}
                    >
                      Recharge
                    </span>
                  </div>
                  <div
                    className="wallet-qr"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={image} alt="QR Code" />
                    <p id="btc-address">
                      bc1qm7m3aw57lla4nt9l880rhj0yhs5gfnzw7ft43s
                    </p>
                    <h3
                      className="copy-address"
                      onClick={() =>
                        navigator.clipboard.writeText("3ghadsb893p2lsand")
                      }
                    >
                      Copy address
                    </h3>
                  </div>
                </div>
              )}
              {selectedTab === "Send" && (
                <div id="Send" className="tab-content active">
                  <p>Send Cryptocurrency</p>
                  <form onSubmit={handleSendSubmit}>
                    <div className="form-group">
                      <label>Amount:</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      <button type="button" onClick={handleMax}>
                        Max
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Wallet Address:</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      <button type="button" onClick={handlePaste}>
                        Paste
                      </button>
                    </div>
                    <button type="submit" className="send-button">
                      Submit
                    </button>
                  </form>
                </div>
              )}
              {selectedTab === "Convert" && (
                <div id="Convert" className="tab-content active">
                  {selectedSymbol === "usd" ? (
                    <form onSubmit={handleConvert}>
                      <p>Convert USD to Another Cryptocurrency</p>
                      <div className="form-group">
                        <label>Amount:</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                        <button type="button" onClick={handleMax}>
                          Max
                        </button>
                      </div>
                      <div className="form-group">
                        <label>Select Cryptocurrency:</label>
                        <select
                          style={{ width: "100%", height: "50px" }}
                          value={selectedCrypto?.id || ""}
                          onChange={(e) =>
                            setSelectedCrypto(
                              cryptos.find(
                                (crypto) => crypto.id === e.target.value
                              )
                            )
                          }
                          required
                        >
                          <option value="">Select...</option>
                          {cryptos.map((crypto) => (
                            <option key={crypto.id} value={crypto.id}>
                              {crypto.symbol.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="convert-button">
                        Convert
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConvertSubmit}>
                      <p>Convert {selectedSymbol.toUpperCase()} to USDT</p>
                      <div className="form-group">
                        <label>Amount:</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="input-field small-input"
                          required
                        />
                        <button type="button" onClick={handleMax}>
                          Max
                        </button>
                      </div>
                      <div className="wallet-buttons">
                        <span className="currency-tag">To</span>
                        <span className="currency">USDT</span>
                        <input
                          type="text"
                          value={usdtValue}
                          placeholder="0"
                          className="input-field small-input"
                          readOnly
                        />
                      </div>
                      <button type="submit" className="convert-button">
                        Proceed to pin
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRechargeModal && (
        <div className="modal show" id="recharge-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowRechargeModal(false)}>
              &times;
            </span>
            <h2>Submit Recharge Order</h2>
            <form onSubmit={handleRechargeSubmit}>
              <div className="form-group">
                <label>Currency</label>
                <input
                  type="text"
                  value={selectedSymbol.toUpperCase()}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Network</label>
                <input
                  type="text"
                  value={selectedSymbol.toUpperCase()}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value="3ghadsb893p2lsand" readOnly />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Please enter the amount"
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload Screenshot</label>
                <div
                  className="upload-screenshot"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <span className="upload-icon">&#128247;</span>
                  <p id="upload-text">
                    Please upload a screenshot of your successful transfer
                  </p>
                  <img
                    id="uploaded-image"
                    style={{
                      display: "none",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                    alt="uploaded"
                  />
                </div>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      document.getElementById("uploaded-image").src =
                        event.target.result;
                      document.getElementById("uploaded-image").style.display =
                        "block";
                      document.getElementById("upload-text").style.display =
                        "none";
                    };
                    reader.readAsDataURL(file);
                    setProof(file);
                  }}
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
};

export default WalletDashboard;
