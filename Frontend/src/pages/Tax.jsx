import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { jsPDF } from "jspdf";

const Tax = () => {
  const [taxData, setTaxData] = useState({
    totalIncome: 0,
    deductibleExpenses: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    deductionInsight: "",
    formData: null,
  });
  const [showReview, setShowReview] = useState(false);

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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Filing Form - AI Accountant", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Form ID: TAX-2025-001", 20, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 30, {
      align: "right",
    });

    // Line under header
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Personal Information Section
    doc.setFontSize(14);
    doc.text("Personal Information", 20, 45);
    doc.setFontSize(11);
    doc.text(`Name: ${taxData.formData.name}`, 20, 55);

    // Income & Deductions Section
    doc.setFontSize(14);
    doc.text("Income & Deductions", 20, 70);
    doc.setFontSize(11);
    doc.text(
      `Total Income: ₹${taxData.formData.income.toLocaleString()}`,
      20,
      80
    );
    doc.text(
      `Deductions: ₹${taxData.formData.deductions.toLocaleString()}`,
      20,
      90
    );

    // Tax Summary Section
    doc.setFontSize(14);
    doc.text("Tax Summary", 20, 105);
    doc.setFontSize(11);
    doc.text(
      `Taxable Income: ₹${taxData.formData.taxableIncome.toLocaleString()}`,
      20,
      115
    );
    doc.text(
      `Tax Due: ₹${taxData.formData.taxDue.toFixed(2).toLocaleString()}`,
      20,
      125
    );

    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(9);
    doc.text("Powered by xAI - AI-Powered Personalized Accountant", 105, 280, {
      align: "center",
    });
    doc.text("For demonstration purposes only", 105, 285, { align: "center" });

    doc.save("tax_form_2025.pdf");
  };

  const handleReviewSubmit = () => {
    setShowReview(false);
    generatePDF();
    console.log("Tax form submitted (mock action)");
  };

  const chartData = {
    labels: ["Total Income", "Deductible Expenses", "Estimated Tax"],
    datasets: [
      {
        data: [
          taxData.totalIncome,
          taxData.deductibleExpenses,
          taxData.estimatedTax,
        ],
        backgroundColor: ["#36a2eb", "#ffce56", "#ff6384"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 14 }, padding: 20 },
      },
      tooltip: {
        callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tax Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Tax Calculation
          </h3>
          <p className="text-gray-600">
            Total Income: ₹{taxData.totalIncome.toLocaleString()}
          </p>
          <p className="text-gray-600">
            Deductible Expenses: ₹{taxData.deductibleExpenses.toLocaleString()}
          </p>
          <p className="text-gray-600">
            Taxable Income: ₹{taxData.taxableIncome.toLocaleString()}
          </p>
          <p className="text-gray-600 font-semibold">
            Estimated Tax: ₹{taxData.estimatedTax.toFixed(2).toLocaleString()}
          </p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800">Tax Tip</h4>
            <p className="text-gray-700">{taxData.deductionInsight}</p>
          </div>
          {taxData.formData && (
            <button
              onClick={() => setShowReview(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Review & Download Tax Form
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Financial Breakdown
          </h3>
          {taxData.totalIncome > 0 ? (
            <div className="h-64">
              <Pie data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-gray-500">
              Add income and expenses to see tax breakdown.
            </p>
          )}
        </div>
      </div>

      {/* Professional Review Modal */}
      {showReview && taxData.formData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-300 pb-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-800 text-center">
                Tax Filing Form
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Form ID: TAX-2025-001
              </p>
            </div>

            {/* Personal Information */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
                Personal Information
              </h4>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Name:</span>{" "}
                {taxData.formData.name}
              </p>
            </div>

            {/* Income & Deductions */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
                Income & Deductions
              </h4>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Total Income:</span> ₹
                {taxData.formData.income.toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Deductions:</span> ₹
                {taxData.formData.deductions.toLocaleString()}
              </p>
            </div>

            {/* Tax Summary */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
                Tax Summary
              </h4>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Taxable Income:</span> ₹
                {taxData.formData.taxableIncome.toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Tax Due:</span> ₹
                {taxData.formData.taxDue.toFixed(2).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Filing Date:</span>{" "}
                {taxData.formData.filingDate}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleReviewSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Submit & Download
              </button>
              <button
                onClick={() => setShowReview(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Powered by xAI - For demonstration purposes only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;
