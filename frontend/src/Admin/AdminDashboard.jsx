import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

// Register necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    transactions: 6,
    clients: 13,
    contacts: 0,
    balance: 894778.1,
    todayRecharge: 0,
    yesterdayRecharge: 13000,
    sevenDaysRecharge: 13000,
    fifteenDaysRecharge: 13000,
    frozenAmount: 0,
    todayClients: 0,
  });

  const [chartData, setChartData] = useState({
    labels: ["2024-06-01", "2024-06-02", "2024-06-12", "2024-06-15"],
    datasets: [
      {
        label: "No of Clients",
        data: [1, 2, 1.5, 3],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Fetch statistics and chart data from your API and set state accordingly
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 bg-gray-800 text-white p-5">
        <div className="mb-8">
          <img
            src="https://res.coinpaper.com/coinpaper/bitcoin_btc_logo_62c59b827e.png"
            alt="Logo"
            className="h-24 w-24 mx-auto"
          />
        </div>
        <nav className="flex flex-col space-y-2">
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Clients
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Crypto Currency
          </Link>
          <Link
            to="/tradeControl"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Trade Control
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Trading Market
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Order Management
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Frozen Accounts
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Employees
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Email
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Analytics/Reports
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Settings
          </Link>
          <Link to="#" className="text-lg hover:bg-gray-700 p-2 rounded">
            Logout
          </Link>
        </nav>
      </div>
      <div className="w-5/6 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="col-span-3">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                No of Clients (30 Days)
              </h2>
              <Line data={chartData} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Today's Recharge</h3>
            <p className="text-2xl">{stats.todayRecharge}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Yesterday's Recharge</h3>
            <p className="text-2xl">{stats.yesterdayRecharge}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">7 Days Recharge</h3>
            <p className="text-2xl">{stats.sevenDaysRecharge}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">15 Days Recharge</h3>
            <p className="text-2xl">{stats.fifteenDaysRecharge}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">30 Days Frozen Amount</h3>
            <p className="text-2xl">{stats.frozenAmount}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Today's Clients</h3>
            <p className="text-2xl">{stats.todayClients}</p>
          </div>
          <div className="bg-teal-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Transactions</h3>
            <p className="text-2xl">{stats.transactions}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Clients</h3>
            <p className="text-2xl">{stats.clients}</p>
          </div>
          <div className="bg-gray-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Contacts</h3>
            <p className="text-2xl">{stats.contacts}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-bold">Clients Balance</h3>
            <p className="text-2xl">{stats.balance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
