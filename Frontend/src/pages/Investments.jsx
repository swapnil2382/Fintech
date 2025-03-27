import { useState } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaHome,
  FaGem,
  FaMoneyBillWave,
  FaPiggyBank,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Investments = () => {
  const [goldSuggestion, setGoldSuggestion] = useState("");
  const [goldAmount, setGoldAmount] = useState("");
  const [goldPricePerGram, setGoldPricePerGram] = useState(null);
  const [showGoldModal, setShowGoldModal] = useState(false);
  const navigate = useNavigate();

  const investmentOptions = [
    {
      id: 1,
      name: "Stocks",
      icon: <FaChartLine className="text-blue-500 text-3xl" />,
      description: "Invest in company shares for potential high returns.",
      returns: "8-15% annually (avg)",
    },
    {
      id: 2,
      name: "Land",
      icon: <FaHome className="text-green-500 text-3xl" />,
      description: "Buy real estate for long-term value growth.",
      returns: "5-10% annually (avg)",
    },
    {
      id: 3,
      name: "Gold",
      icon: <FaGem className="text-yellow-500 text-3xl" />,
      description: "A safe haven asset with steady value.",
      returns: "3-7% annually (avg)",
    },
    {
      id: 4,
      name: "Mutual Funds",
      icon: <FaMoneyBillWave className="text-purple-500 text-3xl" />,
      description: "Diversified investments managed by experts.",
      returns: "6-12% annually (avg)",
    },
    {
      id: 5,
      name: "Fixed Deposits",
      icon: <FaPiggyBank className="text-teal-500 text-3xl" />,
      description: "Low-risk option with guaranteed returns.",
      returns: "4-6% annually (avg)",
    },
  ];

  const fetchGoldPrice = async () => {
    try {
      const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
        headers: {
          "x-access-token": "goldapi-4556bj19m8q5gqfn-io",
          "Content-Type": "application/json",
        },
      });
      const pricePerGram =
        response.data.price_gram_24k || response.data.price / 31.1035;
      setGoldPricePerGram(pricePerGram);
      return pricePerGram;
    } catch (error) {
      console.error(
        "Error fetching gold price:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const handleInvestClick = async (option) => {
    if (option.name === "Gold") {
      const pricePerGram = await fetchGoldPrice();
      if (pricePerGram) setShowGoldModal(true);
      else {
        setGoldSuggestion("Unable to fetch real-time gold price in INR.");
        alert("Unable to fetch real-time gold price in INR.");
      }
    } else if (option.name === "Land") {
      navigate("/land");
    } else if (option.name === "Mutual Funds") {
      navigate("/mutual-funds");
    } else if (option.name === "Fixed Deposits") {
      navigate("/fixed-deposits");
    } else if (option.name === "Stocks") {
      navigate("/stocksinvest"); // Redirect to /stocksinvest page
    } else {
      console.log(`Mock investment action: Investing in ${option.name}`);
      alert(`You’ve chosen to explore ${option.name}! (Mock action)`);
    }
  };

  const handleGoldSubmit = (e) => {
    e.preventDefault();
    if (!goldAmount || !goldPricePerGram) return;
    const amountInGrams = parseFloat(goldAmount);
    const totalCost = amountInGrams * goldPricePerGram;
    const mockBudget = 100000;
    const remainingBudget = mockBudget - totalCost;
    const suggestion = `
      You want to buy ${amountInGrams} grams of gold.
      Current price: ₹${goldPricePerGram.toFixed(2)}/gram
      Total cost: ₹${totalCost.toFixed(2)}
      Budget: ₹${mockBudget.toLocaleString()}
      Remaining budget: ₹${remainingBudget.toFixed(2)}
      ${remainingBudget >= 0 ? "You can afford this!" : "Exceeds your budget!"}
    `;
    setGoldSuggestion(suggestion);
    setShowGoldModal(false);
    alert(suggestion);
    setGoldAmount("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Explore Investment Options
      </h2>
      <p className="text-gray-600 mb-6">
        Choose an investment that suits your financial goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentOptions.map((option) => (
          <div
            key={option.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex flex-col items-center"
          >
            <div className="mb-4">{option.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {option.name}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {option.description}
            </p>
            <p className="text-gray-700 font-medium mb-4">
              Expected Returns: {option.returns}
            </p>
            <button
              onClick={() => handleInvestClick(option)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Invest Now
            </button>
            {option.name === "Gold" && goldSuggestion && (
              <p className="text-sm text-gray-700 mt-2 text-center whitespace-pre-line">
                {goldSuggestion}
              </p>
            )}
          </div>
        ))}
      </div>

      {showGoldModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Invest in Gold
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Current Price: ₹
              {goldPricePerGram ? goldPricePerGram.toFixed(2) : "Loading..."}
              /gram
            </p>
            <form onSubmit={handleGoldSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Amount to Buy (grams)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={goldAmount}
                  onChange={(e) => setGoldAmount(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10"
                  required
                />
              </div>
              {goldPricePerGram && goldAmount && (
                <div className="mb-4 text-gray-700">
                  <p>
                    Total Cost: ₹{(goldAmount * goldPricePerGram).toFixed(2)}
                  </p>
                  <p>Mock Budget: ₹1,00,000</p>
                  <p>
                    Remaining: ₹
                    {(100000 - goldAmount * goldPricePerGram).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Confirm Investment
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoldModal(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;