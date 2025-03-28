import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaxFiling = () => {
  const [taxData, setTaxData] = useState(null);
  const [taxForm, setTaxForm] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search bar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBankAccounts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/bank-accounts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBankAccounts(data);
      if (data.length > 0) setSelectedBankAccountId(data[0]._id);
    } catch (error) {
      setError("Failed to fetch bank accounts: " + (error.response?.data?.error || error.message));
      console.error(error);
    }
  };

  const fetchTaxCalculation = async () => {
    if (!selectedBankAccountId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/tax/calculate?bankAccountId=${selectedBankAccountId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTaxData(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tax calculation: " + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateTaxForm = async () => {
    if (!selectedBankAccountId) {
      setError("Please select a bank account.");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/tax/form?bankAccountId=${selectedBankAccountId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTaxForm(data);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Income Tax Return Form", 20, 20);
      doc.setFontSize(12);
      doc.text(`Financial Year: ${data.financialYear}`, 20, 30);
      doc.text(`Name: ${data.name}`, 20, 40);
      doc.text(`PAN: ${data.pan}`, 20, 50);
      doc.text(`Bank Account: ${data.bankAccountName}`, 20, 60);
      doc.text(`Total Income: ₹${data.totalIncome}`, 20, 70);
      doc.text(`Income from Salary: ₹${data.incomeFromSalary}`, 20, 80);
      doc.text(`Income from Capital Gains: ₹${data.incomeFromCapitalGains}`, 20, 90);
      doc.text(`Deductions: ₹${data.deductions}`, 20, 100);
      doc.text(`Taxable Income: ₹${data.taxableIncome}`, 20, 110);
      doc.save(`ITR_${data.financialYear}_${data.name}_${data.bankAccountName}.pdf`);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message;
      setError("Failed to generate tax form: " + errorMessage);
      console.error("Error generating tax form:", err);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  useEffect(() => {
    fetchTaxCalculation();
  }, [selectedBankAccountId]);

  const chartData = taxData
    ? {
        labels: ["Total Income", "Deductions", "Taxable Income", "Tax Liability"],
        datasets: [
          {
            label: "Amount (₹)",
            data: [
              taxData.totalIncome,
              taxData.deductions,
              taxData.taxableIncome,
              taxData.taxLiability,
            ],
            backgroundColor: [
              "rgba(59, 130, 246, 0.6)", // Blue shades
              "rgba(147, 197, 253, 0.6)",
              "rgba(30, 64, 175, 0.6)",
              "rgba(96, 165, 250, 0.6)",
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(147, 197, 253, 1)",
              "rgba(30, 64, 175, 1)",
              "rgba(96, 165, 250, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } },
      title: { display: true, text: "Tax Breakdown (FY 2024-25)", color: "#fff" },
      tooltip: { callbacks: { label: (context) => `₹${context.parsed.toLocaleString()}` } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#fff", callback: (value) => `₹${value.toLocaleString()}` },
      },
      x: { ticks: { color: "#fff" } },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6">
    

      {/* Header and Bank Account Selector */}
      <h2 className="text-4xl font-extrabold text-blue-500 mb-8 text-center">
        Automated Tax Calculation & Filing
      </h2>
      <div className="max-w-4xl mx-auto mb-8">
        <label className="block text-gray-300 font-medium mb-2">Select Bank Account</label>
        <select
          value={selectedBankAccountId}
          onChange={(e) => setSelectedBankAccountId(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" className="text-gray-400">-- Select a bank account --</option>
          {bankAccounts.map((account) => (
            <option key={account._id} value={account._id} className="text-white">
              {account.name} (₹{account.balance.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center text-gray-400 text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500 text-lg font-medium">{error}</p>}

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax Estimation */}
        {taxData && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Tax Estimation (FY 2024-25)</h3>
            <div className="space-y-3 text-gray-300">
              {Object.entries({
                "Total Income": taxData.totalIncome,
                "Income from Capital Gains": taxData.capitalGains,
                "Short-Term Capital Gains Tax (15%)": taxData.stcgTax,
                "Deductions": taxData.deductions,
                "Taxable Income": taxData.taxableIncome,
                "Total Tax Liability (including 4% cess)": taxData.taxLiability,
              })
                .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> ₹{(value || 0).toFixed(2)}</p>
                ))}
            </div>
          </div>
        )}

        {/* Tax Breakdown Chart */}
        {taxData && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Generate Tax Form Button */}
      <div className="max-w-7xl mx-auto text-center mt-8">
        <button
          onClick={generateTaxForm}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-600"
          disabled={!selectedBankAccountId}
        >
          Generate & Download Tax Form
        </button>
      </div>
    </div>
  );
};

export default TaxFiling;