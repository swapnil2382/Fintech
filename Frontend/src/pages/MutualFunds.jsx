import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MutualFunds = () => {
  const [schemeCode, setSchemeCode] = useState("");
  const [fundData, setFundData] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFundData = async (code) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      const data = response.data;
      setFundData(data);

      const latestNav = parseFloat(data.data[0].nav);
      const mockBudget = 100000;
      const unitsAffordable = mockBudget / latestNav;
      const suggestionText = `
        Scheme: ${data.meta.scheme_name}
        Latest NAV: ₹${latestNav.toFixed(2)} (as of ${data.data[0].date})
        Budget: ₹${mockBudget.toLocaleString()}
        Units Affordable: ${unitsAffordable.toFixed(2)}
        Category: ${data.meta.scheme_category}
        Type: ${data.meta.scheme_type}
      `;
      setSuggestion(suggestionText);
    } catch (error) {
      setSuggestion("Invalid scheme code or data unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schemeCode) return;
    fetchFundData(schemeCode);
    setSchemeCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#4B0082] p-6 text-white flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-white drop-shadow-md">
          Mutual Funds
        </h2>
        <p className="text-center mb-8 text-gray-300">
          Explore mutual fund investment options.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[#2A2A2A] to-[#6A0DAD] p-6 rounded-xl shadow-lg border border-[#8A2BE2]"
        >
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Scheme Code (e.g., 120594)
            </label>
            <input
              type="text"
              value={schemeCode}
              onChange={(e) => setSchemeCode(e.target.value)}
              className="w-full p-3 bg-[#3A3A3A] border border-[#8A2BE2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] text-white placeholder-gray-500"
              placeholder="Enter scheme code"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-[#8A2BE2] text-white px-6 py-2 rounded-lg hover:bg-[#6A0DAD] transition duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? "Loading..." : "Check Fund"}
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
              Investment Suggestion
            </h3>
            <p className="text-gray-200 whitespace-pre-line">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MutualFunds;