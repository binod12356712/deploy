import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminDepositApproval = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);

  useEffect(() => {
    const fetchPendingDeposits = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/deposits");
        setPendingDeposits(response.data);
      } catch (error) {
        console.error("Error fetching pending deposits:", error);
      }
    };

    fetchPendingDeposits();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:3001/api/deposits/${id}/approve`);
      alert("Deposit approved successfully");
      setPendingDeposits(
        pendingDeposits.filter((deposit) => deposit._id !== id)
      );
    } catch (error) {
      console.error("Error approving deposit:", error);
      alert("Failed to approve deposit");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Pending Deposits</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Amount</th>
            <th>Proof</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDeposits.map((deposit) => (
            <tr key={deposit._id}>
              <td>{deposit.userId}</td>
              <td>${deposit.amount}</td>
              <td>
                <a
                  href={`http://localhost:3001/${deposit.proof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Proof
                </a>
              </td>
              <td>
                <button onClick={() => handleApprove(deposit._id)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepositApproval;
