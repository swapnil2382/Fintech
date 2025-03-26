import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Tax = () => {
  const [taxData, setTaxData] = useState({
    totalIncome: 0,
    deductibleExpenses: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    deductionInsight: "",
  });

  useEffect(() => {
    fetchTaxSummary();
  }, []);

  const fetchTaxSummary = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/tax/summary",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTaxData(data);
    } catch (error) {
      console.error("Error fetching tax summary", error);
    }
  };

  // Pie Chart Data
  const chartData = {
    labels: ["Taxable Income", "Deductible Expenses", "Estimated Tax"],
    datasets: [
      {
        data: [
          taxData.taxableIncome,
          taxData.deductibleExpenses,
          taxData.estimatedTax,
        ],
        backgroundColor: ["#36a2eb", "#ffce56", "#ff6384"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tax Overview</h2>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Tax Calculation
          </h3>
          <p className="text-gray-600">Total Income: ₹{taxData.totalIncome}</p>
          <p className="text-gray-600">
            Deductible Expenses: ₹{taxData.deductibleExpenses}
          </p>
          <p className="text-gray-600">
            Taxable Income: ₹{taxData.taxableIncome}
          </p>
          <p className="text-gray-600 font-semibold">
            Estimated Tax: ₹{taxData.estimatedTax.toFixed(2)}
          </p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800">Tax Tip</h4>
            <p className="text-gray-700">{taxData.deductionInsight}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Financial Breakdown
          </h3>
          {taxData.totalIncome > 0 ? (
            <Pie
              data={chartData}
              options={{ maintainAspectRatio: false }}
              height={300}
            />
          ) : (
            <p className="text-gray-500">
              Add income and expenses to see tax breakdown.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tax;
