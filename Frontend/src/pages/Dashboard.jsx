import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/expenses/summary", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary", error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>

      {summary ? (
        <div>
          <h3 className="text-xl font-semibold">Total Spent: ₹{summary.totalSpent}</h3>

          {/* Category Breakdown */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Category-wise Spending</h3>
            <Pie
              data={{
                labels: Object.keys(summary.categoryBreakdown),
                datasets: [
                  {
                    data: Object.values(summary.categoryBreakdown),
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
                  },
                ],
              }}
            />
          </div>

          {/* Monthly Spending */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Monthly Spending Trend</h3>
            <Bar
              data={{
                labels: Object.keys(summary.monthlySpending),
                datasets: [
                  {
                    label: "₹ Spent",
                    data: Object.values(summary.monthlySpending),
                    backgroundColor: "#36a2eb",
                  },
                ],
              }}
            />
          </div>

          {/* Smart Budget Suggestion */}
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-lg font-semibold">Budget Tip:</h3>
            <p>{summary.budgetAdvice}</p>
          </div>
        </div>
      ) : (
        <p>Loading financial summary...</p>
      )}
    </div>
  );
};

export default Dashboard;
