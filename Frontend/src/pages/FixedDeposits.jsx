import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const calculateFD = () => {
    const principalAmount = parseFloat(principal);
    if (!principalAmount || principalAmount <= 0) return;

    const rate = fdRates[bank][tenure] / 100;
    const tenureYears = parseInt(tenure.split(" ")[0]);
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#4B0082] p-6 text-white flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-white drop-shadow-md">
          Fixed Deposits
        </h2>
        <p className="text-center mb-8 text-gray-300">
          Calculate your FD maturity with ease.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[#2A2A2A] to-[#6A0DAD] p-6 rounded-xl shadow-lg border border-[#8A2BE2]"
        >
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full p-3 bg-[#3A3A3A] border border-[#8A2BE2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] text-white placeholder-gray-500"
              placeholder="e.g., 100000"
              min="1000"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Tenure</label>
            <select
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full p-3 bg-[#3A3A3A] border border-[#8A2BE2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] text-white"
            >
              <option value="1 Year">1 Year</option>
              <option value="3 Years">3 Years</option>
              <option value="5 Years">5 Years</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Bank</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full p-3 bg-[#3A3A3A] border border-[#8A2BE2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] text-white"
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
              className="bg-[#8A2BE2] text-white px-6 py-2 rounded-lg hover:bg-[#6A0DAD] transition duration-300 shadow-md"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={() => navigate("/investments")}
              className="bg-[#4B0082] text-white px-6 py-2 rounded-lg hover:bg-[#2A004B] transition duration-300 shadow-md"
            >
              Back
            </button>
          </div>
        </form>

        {suggestion && (
          <div className="mt-6 bg-gradient-to-br from-[#2A2A2A] to-[#6A0DAD] p-6 rounded-xl shadow-lg border border-[#8A2BE2]">
            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              FD Investment Details
            </h3>
            <p className="text-gray-200 whitespace-pre-line">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDeposits;