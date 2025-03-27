import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Expenditure = () => {
  const [expenses, setExpenses] = useState({
    Food: 0,
    Transport: 0,
    Housing: 0,
    Entertainment: 0,
    Others: 0,
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [tips, setTips] = useState("");
  const [alerts, setAlerts] = useState([]); // New state for real-time alerts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/bank-accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAccounts(data);
        const balance = data.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(balance);
        if (data.length > 0) setSelectedAccount(data[0]._id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (category, value) => {
    setExpenses((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
  };

  const fetchAlerts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Show only unread notifications from the last minute
      const recentAlerts = data.filter(
        (notif) =>
          !notif.read && new Date(notif.date) > new Date(Date.now() - 60 * 1000)
      );
      setAlerts(recentAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalSpent = Object.values(expenses).reduce(
      (sum, val) => sum + val,
      0
    );

    if (totalSpent <= 0) {
      alert("Please enter some expenses.");
      return;
    }

    if (!selectedAccount) {
      alert("Please select a bank account.");
      return;
    }

    try {
      const deductResponse = await axios.post(
        "http://localhost:5000/api/bank-accounts/deduct",
        { bankAccountId: selectedAccount, expenses },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (deductResponse.data.error) {
        alert(deductResponse.data.error);
        return;
      }

      // Update total balance
      const { data } = await axios.get(
        "http://localhost:5000/api/bank-accounts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const newBalance = data.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      setTotalBalance(newBalance);

      // Fetch alerts after submission
      await fetchAlerts();

      // Generate tips
      const highestCategory = Object.entries(expenses).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      const tipsList = {
        Food: "Try cooking at home more often or buying in bulk to save on food costs.",
        Transport:
          "Consider carpooling, using public transport, or biking to reduce transport expenses.",
        Housing:
          "Look for ways to save on utilities, like using energy-efficient appliances.",
        Entertainment:
          "Opt for free community events or streaming services instead of expensive outings.",
        Others:
          "Review your 'Others' spending—small purchases can add up quickly!",
      };
      setTips(
        `You spent the most on ${highestCategory} (₹${expenses[
          highestCategory
        ].toFixed(2)}). ${tipsList[highestCategory]}`
      );
    } catch (error) {
      alert("Error processing expenditure: " + error.response?.data?.error);
    }
  };

  const chartData = {
    labels: Object.keys(expenses),
    datasets: [
      {
        data: Object.values(expenses),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Track Your Expenditure
      </h2>
      <p className="text-gray-600 mb-6">
        Current Total Balance: ₹{totalBalance.toFixed(2)}
      </p>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-4 rounded-lg shadow-md ${
                alert.type === "anomaly"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Enter Your Expenses
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select Bank Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.length === 0 ? (
                  <option value="">No accounts available</option>
                ) : (
                  accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name} (₹{account.balance.toFixed(2)})
                    </option>
                  ))
                )}
              </select>
            </div>
            {Object.keys(expenses).map((category) => (
              <div key={category} className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {category} (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenses[category] || ""}
                  onChange={(e) => handleInputChange(category, e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${category} expense`}
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit Expenses
            </button>
            <Link
              to="/transactions"
              className="ml-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              View Transaction History
            </Link>
            <Link
              to="/notifications"
              className="ml-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              View Notifications
            </Link>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Spending Breakdown
          </h3>
          {Object.values(expenses).some((val) => val > 0) ? (
            <div className="w-full h-64">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          ) : (
            <p className="text-gray-600">Enter expenses to see the chart.</p>
          )}
          {tips && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800">
                Money-Saving Tip
              </h4>
              <p className="text-gray-700">{tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenditure;
