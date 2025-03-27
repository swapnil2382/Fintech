import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MutualFunds = () => {
  const [schemeCode, setSchemeCode] = useState("");
  const [fundData, setFundData] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch mutual fund data from MFAPI.in
  const fetchFundData = async (code) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      const data = response.data;
      setFundData(data);

      // Calculate suggestion based on latest NAV and mock budget
      const latestNav = parseFloat(data.data[0].nav); // Latest NAV
      const mockBudget = 100000; // ₹1 lakh
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mutual fund data:", error);
      setSuggestion(
        "Unable to fetch data. Please check the scheme code and try again."
      );
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Invest in Mutual Funds
      </h2>
      <p className="text-gray-600 mb-6">
        Enter a mutual fund scheme code to check its details and investment
        potential. (e.g., 120594 for Axis Long Term Equity Fund - Direct Growth)
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Mutual Fund Scheme Code
          </label>
          <input
            type="text"
            value={schemeCode}
            onChange={(e) => setSchemeCode(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 120594"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Check Fund"}
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
            Investment Suggestion
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default MutualFunds;
