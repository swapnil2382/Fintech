import { useState } from "react";
import { motion } from "framer-motion";

const Calculator = () => {
  // State for form inputs
  const [income, setIncome] = useState("");
  const [taxYear, setTaxYear] = useState("2025");
  const [deductions, setDeductions] = useState("");
  const [taxResult, setTaxResult] = useState(null);

  // Tax brackets for 2025 (simplified for demonstration)
  const taxBrackets = [
    { min: 0, max: 10000, rate: 0.1 }, // 10% for income up to $10,000
    { min: 10001, max: 40000, rate: 0.15 }, // 15% for income $10,001 - $40,000
    { min: 40001, max: 85000, rate: 0.25 }, // 25% for income $40,001 - $85,000
    { min: 85001, max: Infinity, rate: 0.35 }, // 35% for income above $85,000
  ];

  // Function to calculate tax
  const calculateTax = (e) => {
    e.preventDefault();

    // Convert inputs to numbers
    const incomeNum = parseFloat(income) || 0;
    const deductionsNum = parseFloat(deductions) || 0;

    // Calculate taxable income
    const taxableIncome = Math.max(0, incomeNum - deductionsNum);

    // Calculate tax based on brackets
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min
      );
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    // Set the result
    setTaxResult({
      taxableIncome: taxableIncome.toFixed(2),
      taxLiability: tax.toFixed(2),
      effectiveTaxRate: taxableIncome > 0 ? ((tax / taxableIncome) * 100).toFixed(2) : 0,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row items-center justify-center gap-7 px-6 py-12 space-y-8 md:space-y-0">
      {/* Left Section (Form) */}
      <motion.div
        className="w-full max-w-lg bg-blue-950 p-8 rounded-lg shadow-lg border-2 border-blue-400"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.h1
          className="text-5xl font-extrabold mb-8 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tax Calculator
        </motion.h1>

        {/* Description */}
        <p className="text-lg text-gray-300 text-center max-w-2xl mb-10">
          Calculate your tax liability with ease. Enter your income, select the tax year, and apply any deductions to get personalized tax insights.
        </p>

        {/* Form */}
        <motion.form onSubmit={calculateTax} className="space-y-6">
          {/* Income Input */}
          <div>
            <label htmlFor="income" className="block text-lg font-semibold mb-2">
              Annual Income ($)
            </label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter your annual income"
              required
            />
          </div>

          {/* Tax Year Selection */}
          <div>
            <label htmlFor="taxYear" className="block text-lg font-semibold mb-2">
              Tax Year
            </label>
            <select
              id="taxYear"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Deductions Input */}
          <div>
            <label htmlFor="deductions" className="block text-lg font-semibold mb-2">
              Deductions ($)
            </label>
            <input
              type="number"
              id="deductions"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter your deductions (if any)"
            />
          </div>

          {/* Calculate Button */}
          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold rounded-lg shadow-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Calculate Tax
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Right Section (Tax Results) */}
      {taxResult && (
        <motion.div
          className="w-full max-w-lg bg-blue-950 p-6 rounded-lg shadow-lg border-2 border-blue-400 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">
            Tax Calculation Results
          </h2>
          <div className="space-y-3">
            <p className="text-lg">
              <span className="font-semibold">Taxable Income:</span> ${taxResult.taxableIncome}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Tax Liability:</span> ${taxResult.taxLiability}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Effective Tax Rate:</span> {taxResult.effectiveTaxRate}%
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Calculator;
