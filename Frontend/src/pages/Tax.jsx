import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { jsPDF } from "jspdf";

const Tax = () => {
  const [taxData, setTaxData] = useState({
    totalIncome: 0,
    deductibleTransactions: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    deductionInsight: "",
    formData: null,
  });
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(""); // "" for all accounts
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  useEffect(() => {
    fetchTaxSummary();
  }, [selectedAccount]);

  const fetchBankAccounts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/bank-accounts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching bank accounts", error);
    }
  };

  const fetchTaxSummary = async () => {
    try {
      const url = selectedAccount
        ? `http://localhost:5000/api/tax/summary?bankAccountId=${selectedAccount}`
        : "http://localhost:5000/api/tax/summary";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Tax summary response:", response.data); // Debug
      setTaxData(response.data);
    } catch (error) {
      console.error("Error fetching tax summary:", error.response?.data || error.message);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const accountName = selectedAccount
      ? accounts.find((acc) => acc._id === selectedAccount)?.name || "Unknown"
      : "All Accounts";

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice - AI Accountant", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice ID: TAX-2025-001", 20, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 30, { align: "right" });

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.text("Personal Information", 20, 45);
    doc.setFontSize(11);
    doc.text(`Name: ${taxData.formData.name}`, 20, 55);
    doc.text(`Bank Account: ${accountName}`, 20, 65);

    doc.setFontSize(14);
    doc.text("Income & Deductions", 20, 80);
    doc.setFontSize(11);
    doc.text(`Total Income: ₹${taxData.formData.income.toLocaleString()}`, 20, 90);
    doc.text(`Deductions: ₹${taxData.formData.deductions.toLocaleString()}`, 20, 100);

    doc.setFontSize(14);
    doc.text("Tax Summary", 20, 115);
    doc.setFontSize(11);
    doc.text(`Taxable Income: ₹${taxData.formData.taxableIncome.toLocaleString()}`, 20, 125);
    doc.text(`Tax Due: ₹${taxData.formData.taxDue.toFixed(2).toLocaleString()}`, 20, 135);

    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(9);
    doc.text("Powered by xAI - AI-Powered Personalized Accountant", 105, 280, { align: "center" });
    doc.text("For demonstration purposes only", 105, 285, { align: "center" });

    doc.save(`tax_invoice_2025_${accountName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleReviewSubmit = () => {
    setShowReview(false);
    generatePDF();
    console.log("Tax invoice downloaded (mock submission)");
  };

  const chartData = {
    labels: ["Total Income", "Deductible Transactions", "Estimated Tax"],
    datasets: [
      {
        data: [taxData.totalIncome, taxData.deductibleTransactions, taxData.estimatedTax],
        backgroundColor: ["#36a2eb", "#ffce56", "#ff6384"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 14 }, padding: 20 } },
      tooltip: { callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` } },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tax Invoice</h2>

      <div className="mb-6">
        <label className="text-gray-700 font-semibold mr-2">Select Bank Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        >
          <option value="">All Accounts</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} (₹{account.balance.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Tax Calculation</h3>
          <p className="text-gray-600">Total Income: ₹{taxData.totalIncome.toLocaleString()}</p>
          <p className="text-gray-600">Deductible Transactions: ₹{taxData.deductibleTransactions.toLocaleString()}</p>
          <p className="text-gray-600">Taxable Income: ₹{taxData.taxableIncome.toLocaleString()}</p>
          <p className="text-gray-600 font-semibold">Estimated Tax: ₹{taxData.estimatedTax.toFixed(2).toLocaleString()}</p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800">Tax Tip</h4>
            <p className="text-gray-700">{taxData.deductionInsight}</p>
          </div>
          {taxData.formData && (
            <button
              onClick={() => setShowReview(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Review & Download Invoice
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Financial Breakdown</h3>
          {taxData.totalIncome > 0 || taxData.deductibleTransactions > 0 ? (
            <div className="h-64">
              <Pie data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-gray-500">No data available for this account.</p>
          )}
        </div>
      </div>

      {showReview && taxData.formData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border border-gray-200">
            <div className="border-b border-gray-300 pb-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-800 text-center">Tax Invoice</h3>
              <p className="text-sm text-gray-500 text-center">Invoice ID: TAX-2025-001</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Personal Information</h4>
              <p className="text-gray-700 mt-2"><span className="font-medium">Name:</span> {taxData.formData.name}</p>
              <p className="text-gray-700"><span className="font-medium">Bank Account:</span> {selectedAccount ? accounts.find((acc) => acc._id === selectedAccount)?.name : "All Accounts"}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Income & Deductions</h4>
              <p className="text-gray-700 mt-2"><span className="font-medium">Total Income:</span> ₹{taxData.formData.income.toLocaleString()}</p>
              <p className="text-gray-700"><span className="font-medium">Deductions:</span> ₹{taxData.formData.deductions.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Tax Summary</h4>
              <p className="text-gray-700 mt-2"><span className="font-medium">Taxable Income:</span> ₹{taxData.formData.taxableIncome.toLocaleString()}</p>
              <p className="text-gray-700"><span className="font-medium">Tax Due:</span> ₹{taxData.formData.taxDue.toFixed(2).toLocaleString()}</p>
              <p className="text-gray-700"><span className="font-medium">Filing Date:</span> {taxData.formData.filingDate}</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleReviewSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Download Invoice
              </button>
              <button
                onClick={() => setShowReview(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">Powered by xAI - For demonstration purposes only</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;