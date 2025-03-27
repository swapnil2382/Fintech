import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock FD rates for Indian banks (replace with API data if available)
const fdRates = {
  SBI: { "1 Year": 6.8, "3 Years": 6.9, "5 Years": 6.5 },
  "HDFC Bank": { "1 Year": 6.6, "3 Years": 7.0, "5 Years": 6.8 },
  "ICICI Bank": { "1 Year": 6.7, "3 Years": 7.0, "5 Years": 6.9 },
  "Post Office": { "1 Year": 6.9, "3 Years": 7.1, "5 Years": 7.0 },
};

const FixedDeposits = () => {
  const [principal, setPrincipal] = useState("");
  const [tenure, setTenure] = useState("1 Year");
  const [bank, setBank] = useState("SBI");
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();

  // Calculate FD maturity amount using compound interest formula
  // A = P(1 + r/n)^(nt), simplified to yearly compounding here
  const calculateFD = () => {
    const principalAmount = parseFloat(principal);
    if (!principalAmount || principalAmount <= 0) return;

    const rate = fdRates[bank][tenure] / 100; // Annual interest rate
    const tenureYears = parseInt(tenure.split(" ")[0]); // Extract number of years
    const maturityAmount = principalAmount * Math.pow(1 + rate, tenureYears);
    const interestEarned = maturityAmount - principalAmount;

    const suggestionText = `
      Bank: ${bank}
      Principal Amount: ₹${principalAmount.toLocaleString()}
      Tenure: ${tenure}
      Interest Rate: ${fdRates[bank][tenure]}% p.a.
      Maturity Amount: ₹${maturityAmount.toFixed(2)}
      Interest Earned: ₹${interestEarned.toFixed(2)}
    `;
    setSuggestion(suggestionText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateFD();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Invest in Fixed Deposits
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your investment details to calculate the maturity amount for a
        Fixed Deposit.
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Principal Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 100000"
            min="1000"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tenure</label>
          <select
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1 Year">1 Year</option>
            <option value="3 Years">3 Years</option>
            <option value="5 Years">5 Years</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SBI">SBI</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="Post Office">Post Office</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={() => navigate("/investments")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Back
          </button>
        </div>
      </form>

      {suggestion && (
        <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            FD Investment Details
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default FixedDeposits;
