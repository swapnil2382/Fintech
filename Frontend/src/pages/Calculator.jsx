import { useState } from "react";

const Calculator = () => {
  const [income, setIncome] = useState("");
  const [taxYear, setTaxYear] = useState("2025");
  const [deductions, setDeductions] = useState("");
  const [taxResult, setTaxResult] = useState(null);

  const taxBrackets = [
    { min: 0, max: 250000, rate: 0.05 }, // 5% for income up to ₹2,50,000
    { min: 250001, max: 500000, rate: 0.1 }, // 10% for income ₹2,50,001 - ₹5,00,000
    { min: 500001, max: 1000000, rate: 0.2 }, // 20% for income ₹5,00,001 - ₹10,00,000
    { min: 1000001, max: Infinity, rate: 0.3 }, // 30% for income above ₹10,00,000
  ];

  const calculateTax = (e) => {
    e.preventDefault();
    const incomeNum = parseFloat(income) || 0;
    const deductionsNum = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, incomeNum - deductionsNum);

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

    setTaxResult({
      taxableIncome: taxableIncome.toFixed(2),
      taxLiability: tax.toFixed(2),
      effectiveTaxRate:
        taxableIncome > 0 ? ((tax / taxableIncome) * 100).toFixed(2) : 0,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center px-10 py-12">
      {/* Left Section (Form) */}
      <div className="w-1/2 bg-blue-950 p-10 rounded-lg shadow-lg border-2 border-blue-400">
        <h1 className="text-5xl font-extrabold mb-8 text-blue-400 text-center">
          Tax Calculator
        </h1>
        <p className="text-lg text-gray-300 text-center mb-8">
          Enter your income, select the tax year, and apply deductions to calculate your estimated tax.
        </p>

        <form onSubmit={calculateTax} className="space-y-6">
          <div>
            <label htmlFor="income" className="block text-lg font-semibold mb-2">
              Annual Income (₹)
            </label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter your annual income"
              required
            />
          </div>

          <div>
            <label htmlFor="taxYear" className="block text-lg font-semibold mb-2">
              Tax Year
            </label>
            <select
              id="taxYear"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label htmlFor="deductions" className="block text-lg font-semibold mb-2">
              Deductions (₹)
            </label>
            <input
              type="number"
              id="deductions"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter your deductions (if any)"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold rounded-lg shadow-lg transition duration-300"
          >
            Calculate Tax
          </button>
        </form>
      </div>

      {/* Right Section (Results at Top) */}
      <div className="w-1/2 flex flex-col items-start pl-10">
        <div className="w-full bg-blue-950 p-8 rounded-lg shadow-lg border-2 border-blue-400 mb-6">
          {taxResult ? (
            <>
              <h2 className="text-3xl font-semibold mb-4 text-blue-300 text-center">
                Tax Calculation Results
              </h2>
              <div className="space-y-4 text-lg text-center">
                <p>
                  <span className="font-semibold">Taxable Income:</span> ₹{taxResult.taxableIncome}
                </p>
                <p>
                  <span className="font-semibold">Tax Liability:</span> ₹{taxResult.taxLiability}
                </p>
                <p>
                  <span className="font-semibold">Effective Tax Rate:</span> {taxResult.effectiveTaxRate}%
                </p>
              </div>
            </>
          ) : (
            <p className="text-xl text-gray-300 text-center">
              Enter data to calculate tax.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
