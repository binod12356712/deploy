import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../wallet/WalletDashboard.css";
import logo3 from "./logo3.png";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <h2>Terms and Conditions</h2>
        </div>
        <div className="terms-content">
          <h3>
            1. The digital asset is not issued by any financial institution,
            company, or by this website itself.
          </h3>
          <p>...</p>
          <h3>
            2. The digital asset market is relatively new and still in its
            infancy. It remains unconfirmed in terms...
          </h3>
          <p>...</p>
          <h3>
            3. Digital assets are primarily utilized by speculators, with
            relatively limited use in retail and...
          </h3>
          <p>...</p>
          <h3>
            4. Digital asset trading carries extremely high risks and is not
            suitable for most people...
          </h3>
          <p>...</p>
          <h3>
            5. The company reserves the right to suspend or terminate your
            account at any time if it believes...
          </h3>
          <p>...</p>
          <h3>
            6. Any opinions, news, discussions, analysis, prices,
            recommendations, and other information...
          </h3>
          <p>...</p>
          <h3>
            7. There are inherent risks associated with using Internet-based
            trading systems, which include...
          </h3>
          <p>...</p>
          <h3>
            8. The use of this website for malicious market manipulation, unfair
            trading practices, and other...
          </h3>
          <p>...</p>
          <h3>1. General Rules:</h3>
          <h4>
            1.1 The &#39;User Agreement&#39; (hereinafter referred to as
            &#39;this agreement&#39; or &#39;these terms and...
          </h4>
          <p>...</p>
          <h4>
            1.2 Prior to utilizing the services offered on this website, it is
            imperative to thoroughly review this...
          </h4>
          <p>...</p>
          <h4>
            1.3 You can become a member of this website by registering
            successfully according to its...
          </h4>
          <p>...</p>
          <h4>
            1.4 Once you become a member of this website, you will receive a
            member account and a...
          </h4>
          <p>...</p>
          <h4>
            1.5 Only registered members of this website can utilize its digital
            asset trading platform for...
          </h4>
          <p>...</p>
          <h4>
            1.6 By registering and using any services and functions provided by
            this website, you will be deemed...
          </h4>
          <p>...</p>
          <h3>
            2 Revision of Agreement: We reserve the right to amend this
            agreement periodically and will...
          </h3>
          <p>...</p>
          <h3>3 Registration:</h3>
          <h4>
            3.1 Registration Qualification: You confirm and commit that upon
            completing the registration...
          </h4>
          <p>...</p>
          <h4>
            3.2 Purpose of Registration: You confirm and pledge that your
            registration on this website is not...
          </h4>
          <p>...</p>
          <h4>3.3 Registration Process:</h4>
          <p>...</p>
          <h3>4 Services:</h3>
          <h4>4.1 Service Content:</h4>
          <p>...</p>
          <h4>
            4.2 Service Rules: You are obligated to adhere to the following
            service rules of this website:
          </h4>
          <p>...</p>
          <h4>4.3 Product Rules:</h4>
          <p>...</p>
          <h3>5 The rights and obligations of this website:</h3>
          <p>...</p>
          <h3>6 Limitation of Liability and Disclaimer:</h3>
          <p>...</p>
          <h3>7 Termination of the agreement:</h3>
          <p>...</p>
          <h3>8 intellectual property rights</h3>
          <p>...</p>
          <h3>
            9 Calculation: We have thoroughly verified all transaction
            calculation results...
          </h3>
          <p>...</p>
          <h3>
            10 Divisibility: If any clause in this agreement is deemed
            unenforceable...
          </h3>
          <p>...</p>
          <h3>
            11 Non-agent relationship: Nothing in this agreement shall be
            construed...
          </h3>
          <p>...</p>
          <h3>12 Abstain: Our waiver of liability for breach of contract...</h3>
          <p>...</p>
          <h3>
            13 Title: The titles provided are for the convenience of expressing
            the agreement...
          </h3>
          <p>...</p>
          <h3>14 The effectiveness and interpretation of the agreement:</h3>
          <p>...</p>
        </div>
      </div>
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
}
