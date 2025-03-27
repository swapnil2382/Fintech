import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialInsights = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");
  const [spendingData, setSpendingData] = useState(null);
  const [budgetRecommendations, setBudgetRecommendations] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBankAccounts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bank-accounts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBankAccounts(data);
      if (data.length > 0) {
        setSelectedBankAccountId(data[0]._id);
      }
    } catch (error) {
      setError(
        "Failed to fetch bank accounts: " +
          (error.response?.data?.error || error.message)
      );
      console.error(error);
    }
  };

  const fetchSpendingData = async () => {
    if (!selectedBankAccountId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/insights/spending?bankAccountId=${selectedBankAccountId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSpendingData(data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch spending data: " +
          (err.response?.data?.error || err.message)
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetRecommendations = async () => {
    if (!selectedBankAccountId) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/insights/budget?bankAccountId=${selectedBankAccountId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBudgetRecommendations(data);
    } catch (err) {
      setError(
        "Failed to fetch budget recommendations: " +
          (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/insights/budgets",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBudgets(data);
    } catch (err) {
      setError(
        "Failed to fetch budgets: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/insights/budgets",
        newBudget,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBudgets((prev) => {
        const existing = prev.find((b) => b.category === newBudget.category);
        if (existing) {
          return prev.map((b) =>
            b.category === newBudget.category ? data : b
          );
        }
        return [...prev, data];
      });
      setNewBudget({ category: "", amount: "" });
      fetchSpendingData();
    } catch (err) {
      setError(
        "Failed to set budget: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
    fetchBudgets();
  }, []);

  useEffect(() => {
    fetchSpendingData();
    fetchBudgetRecommendations();
  }, [selectedBankAccountId]);

  const chartData = spendingData?.spendingByCategory
    ? {
        labels: Object.keys(spendingData.spendingByCategory),
        datasets: [
          {
            label: "Spending (₹)",
            data: Object.values(spendingData.spendingByCategory),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Spending by Category",
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
        Personalized Financial Insights & Budgeting
      </h2>

      <div className="max-w-3xl mx-auto mb-8">
        <label className="block text-gray-700 font-medium mb-2">
          Select Bank Account
        </label>
        <select
          value={selectedBankAccountId}
          onChange={(e) => setSelectedBankAccountId(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a bank account --</option>
          {bankAccounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} (₹{account.balance?.toFixed(2) || "0.00"})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      )}

      {spendingData && spendingData.spendingByCategory && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">
            Spending Patterns
          </h3>
          <div className="h-80 mb-4">
            <Pie data={chartData} options={chartOptions} />
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Total Income (Annual):</strong> ₹
              {(spendingData.totalIncome || 0).toFixed(2)}
            </p>
            <p className="text-gray-700">
              <strong>Total Spending:</strong> ₹
              {(spendingData.totalSpending || 0).toFixed(2)}
            </p>
            {Object.entries(spendingData.spendingByCategory).map(
              ([category, amount]) => (
                <p key={category} className="text-gray-700">
                  <strong>{category}:</strong> ₹{(amount || 0).toFixed(2)}
                </p>
              )
            )}
          </div>
        </div>
      )}

      {spendingData?.insights && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">
            Financial Insights
          </h3>
          <div className="space-y-3">
            {spendingData.insights.map((insight, index) => (
              <p
                key={index}
                className={`text-gray-700 p-3 rounded-lg ${
                  insight.severity === "warning"
                    ? "bg-red-100 text-red-700"
                    : insight.severity === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <strong>{insight.category}:</strong> {insight.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {budgetRecommendations && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">
            Smart Budget Recommendations
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Recommended Needs (50%):</strong> ₹
              {(budgetRecommendations.recommendedNeeds || 0).toFixed(2)}
            </p>
            <p className="text-gray-700">
              <strong>Recommended Wants (30%):</strong> ₹
              {(budgetRecommendations.recommendedWants || 0).toFixed(2)}
            </p>
            <p className="text-gray-700">
              <strong>Recommended Savings/Investments (20%):</strong> ₹
              {(budgetRecommendations.recommendedSavings || 0).toFixed(2)}
            </p>
            <h4 className="text-lg font-semibold text-gray-700 mt-4">
              Per-Category Recommendations:
            </h4>
            {budgetRecommendations.budgetRecommendations &&
              Object.entries(budgetRecommendations.budgetRecommendations).map(
                ([category, amount]) => (
                  <p key={category} className="text-gray-700">
                    <strong>{category}:</strong> ₹{(amount || 0).toFixed(2)}
                  </p>
                )
              )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-bold text-blue-500 mb-4">
          Set Your Budget
        </h3>
        <form onSubmit={handleSetBudget} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              value={newBudget.category}
              onChange={(e) =>
                setNewBudget({ ...newBudget, category: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a category --</option>
              {spendingData?.spendingByCategory &&
                Object.keys(spendingData.spendingByCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Budget Amount (₹)
            </label>
            <input
              type="number"
              value={newBudget.amount}
              onChange={(e) =>
                setNewBudget({ ...newBudget, amount: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter budget amount"
              required
              min="0"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Set Budget
          </button>
        </form>
      </div>

      {budgets.length > 0 && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">
            Your Budgets
          </h3>
          <div className="space-y-3">
            {budgets.map((budget) => (
              <p key={budget._id} className="text-gray-700">
                <strong>{budget.category}:</strong> ₹
                {(budget.amount || 0).toFixed(2)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialInsights;
