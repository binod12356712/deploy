import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminSendApproval = () => {
  const [sendRequests, setSendRequests] = useState([]);

  useEffect(() => {
    const fetchSendRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/send-requests"
        );
        setSendRequests(response.data);
      } catch (error) {
        console.error("Error fetching send requests:", error);
      }
    };

    fetchSendRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:3001/api/send-requests/${id}/status`, {
        status,
      });
      alert(`Send request marked as ${status}`);
      setSendRequests(sendRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error(`Error marking send request as ${status}:`, error);
      alert(`Failed to mark send request as ${status}`);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Pending Send Requests</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Cryptocurrency</th>
            <th>Amount</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sendRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.userId}</td>
              <td>{request.symbol.toUpperCase()}</td>
              <td>{request.amount}</td>
              <td>{request.address}</td>
              <td>{request.status}</td>
              <td>
                <button
                  onClick={() => handleUpdateStatus(request._id, "complete")}
                >
                  Complete
                </button>
                <button
                  onClick={() => handleUpdateStatus(request._id, "incomplete")}
                >
                  Incomplete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSendApproval;
