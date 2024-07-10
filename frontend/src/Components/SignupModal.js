import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Reuse the same CSS file for styling

export default function SignupModal({ closemod }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loggedIn, setLoggedIn] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const eventHandler = async () => {
    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://77.37.86.134:3001/register/createuser",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      if (response.data.userExist) {
        alert("User already exists");
      } else if (!response.data.success) {
        alert("Enter correct credentials");
      } else {
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("userId", response.data.userdata.userId);
        localStorage.setItem("_id", response.data.userdata._id);
        localStorage.setItem(
          "walletAddress",
          response.data.userdata.walletAddress
        );
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loggedIn) {
    closemod(false);
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => closemod(false)}>
          &times;
        </span>
        <h2>Sign Up</h2>
        <form id="signupForm" className="space-y-4">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter your password"
              required
            />
          </div>
          <button
            type="button"
            className="submit-button"
            style={{ backgroundColor: "#27ae60" }}
            onClick={eventHandler}
          >
            Sign Up
          </button>
        </form>
        <div className="signup-link">
          Already have an account?{" "}
          <span onClick={() => closemod(true)}>Log in</span>
        </div>
      </div>
    </div>
  );
}
