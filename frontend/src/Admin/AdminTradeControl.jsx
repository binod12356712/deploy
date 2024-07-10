import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTradeControl = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(
          "http://77.37.86.134:3001/api/predictions/waiting"
        );
        setPredictions(response.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
  }, []);

  const handleResult = async (id, result) => {
    try {
      await axios.post(
        `http://77.37.86.134:3001/api/prediction/${id}/result`,
        result
      );
      setPredictions((prevPredictions) =>
        prevPredictions.filter((prediction) => prediction._id !== id)
      );
    } catch (error) {
      console.error("Error updating prediction result:", error);
    }
  };

  return (
    <div className="admin-trade-control p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Trade Control</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Wallet Address</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Predicted At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {predictions.map((prediction) => (
              <tr
                key={prediction._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {prediction.userId}
                </td>
                <td className="py-3 px-6 text-left">
                  {prediction.walletAddress}
                </td>
                <td className="py-3 px-6 text-left">{prediction.amount}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(prediction.predictedAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                    onClick={() =>
                      handleResult(prediction._id, {
                        success: true,
                        amount: prediction.amount,
                        message: "Admin approved profit",
                      })
                    }
                  >
                    Win
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() =>
                      handleResult(prediction._id, {
                        success: false,
                        amount: prediction.amount,
                        message: "Admin approved loss",
                      })
                    }
                  >
                    Loss
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTradeControl;
