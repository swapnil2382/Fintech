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

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Filing Form - AI Accountant", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Form ID: TAX-2025-001", 20, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 30, {
      align: "right",
    });

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.text("Personal Information", 20, 45);
    doc.setFontSize(11);
    doc.text(`Name: ${taxData.formData.name}`, 20, 55);

    doc.setFontSize(14);
    doc.text("Income & Deductions", 20, 70);
    doc.setFontSize(11);
    doc.text(`Total Income: ₹${taxData.formData.income.toLocaleString()}`, 20, 80);
    doc.text(`Deductions: ₹${taxData.formData.deductions.toLocaleString()}`, 20, 90);

    doc.setFontSize(14);
    doc.text("Tax Summary", 20, 105);
    doc.setFontSize(11);
    doc.text(`Taxable Income: ₹${taxData.formData.taxableIncome.toLocaleString()}`, 20, 115);
    doc.text(`Tax Due: ₹${taxData.formData.taxDue.toFixed(2).toLocaleString()}`, 20, 125);

    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(9);
    doc.text("Powered by xAI - AI-Powered Personalized Accountant", 105, 280, { align: "center" });
    doc.text("For demonstration purposes only", 105, 285, { align: "center" });

    doc.save("tax_form_2025.pdf");
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Tax Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-950 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tax Calculation</h3>
          <p>Total Income: ₹{taxData.totalIncome.toLocaleString()}</p>
          <p>Deductible Expenses: ₹{taxData.deductibleExpenses.toLocaleString()}</p>
          <p>Taxable Income: ₹{taxData.taxableIncome.toLocaleString()}</p>
          <p className="font-semibold">Estimated Tax: ₹{taxData.estimatedTax.toFixed(2).toLocaleString()}</p>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-lg font-semibold">Tax Tip</h4>
            <p>{taxData.deductionInsight}</p>
          </div>
          {taxData.formData && (
            <button
              onClick={() => setShowReview(true)}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Review & Download Tax Form
            </button>
          )}
        </div>

        <div className="bg-blue-950 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Financial Breakdown</h3>
          {taxData.totalIncome > 0 ? (
            <div className="h-64">
              <Pie data={{
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
              }} options={{
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
              }}/>
            </div>
          ) : (
            <p className="text-gray-400">Add income and expenses to see tax breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tax;
