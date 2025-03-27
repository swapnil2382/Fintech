import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StocksInvest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState({}); // Store chart data for each stock by symbol
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "V7XGVH9WBWY8A1PE";

  const fetchStockSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setChartData({});
    try {
      const searchResponse = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
      );
      const searchResults = searchResponse.data.bestMatches || [];
      const formattedStocks = searchResults.map((stock) => ({
        symbol: stock["1. symbol"],
        name: stock["2. name"],
        price: null,
        suggestion: null,
      }));

      const stocksWithData = [];
      for (let i = 0; i < formattedStocks.length; i++) {
        const stock = formattedStocks[i];
        const price = await fetchStockPrice(stock.symbol);
        const suggestion = await fetchAISuggestion(stock.symbol);
        const chart = await fetchChartData(stock.symbol); // Fetch chart data upfront
        stocksWithData.push({ ...stock, price, suggestion });
        setStocks([...stocksWithData]);
        setChartData((prev) => ({ ...prev, [stock.symbol]: chart }));
        if (i < formattedStocks.length - 1)
          await new Promise((resolve) => setTimeout(resolve, 15000));
      }

      setStocks(stocksWithData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stock data or suggestions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const price = response.data["Global Quote"]["05. price"];
      return parseFloat(price).toFixed(2);
    } catch (err) {
      console.error(`Error fetching price for ${symbol}:`, err);
      return null;
    }
  };

  const fetchAISuggestion = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];
      if (!timeSeries) return null;

      const prices = Object.values(timeSeries)
        .slice(0, 5)
        .map((day) => parseFloat(day["4. close"]));
      const volumes = Object.values(timeSeries)
        .slice(0, 5)
        .map((day) => parseFloat(day["5. volume"]));

      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const volatility = Math.max(...prices) - Math.min(...prices);
      const trend = prices[0] > prices[prices.length - 1] ? "up" : "down";
      const priceVsAvg = prices[0] > avgPrice ? "above" : "below";
      const volumeChange =
        (volumes[0] - volumes[volumes.length - 1]) / volumes[volumes.length - 1];

      let recommendation, reason, risk;
      if (trend === "up" && volatility < 10 && volumeChange > 0.1) {
        recommendation = "Strong Buy";
        reason = "Consistent upward trend with low volatility and increasing volume.";
        risk = "Low";
      } else if (trend === "up" && volatility < 15 && priceVsAvg === "above") {
        recommendation = "Buy";
        reason = "Moderate upward trend with prices above 5-day average.";
        risk = "Low to Medium";
      } else if (trend === "down" && volatility > 20 && volumeChange < -0.2) {
        recommendation = "Strong Avoid";
        reason = "Sharp downward trend with high volatility and declining volume.";
        risk = "High";
      } else if (trend === "down" && priceVsAvg === "below") {
        recommendation = "Avoid";
        reason = "Downward trend with prices below 5-day average.";
        risk = "Medium to High";
      } else if (volatility > 25) {
        recommendation = "Hold";
        reason = "High volatility; monitor for stabilization.";
        risk = "High";
      } else if (trend === "up" && volatility > 15) {
        recommendation = "Cautious Buy";
        reason = "Upward trend with significant volatility.";
        risk = "Medium to High";
      } else {
        recommendation = "Neutral";
        reason = "No clear trend; further analysis needed.";
        risk = "Medium";
      }

      return { recommendation, reason, risk };
    } catch (err) {
      console.error(`Error fetching suggestion for ${symbol}:`, err);
      return null;
    }
  };

  const fetchChartData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];
      if (!timeSeries) return null;

      const labels = Object.keys(timeSeries).slice(0, 7).reverse();
      const prices = labels.map((date) => parseFloat(timeSeries[date]["4. close"]));

      return {
        labels,
        datasets: [
          {
            label: `${symbol} Price`,
            data: prices,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: false,
          },
        ],
      };
    } catch (err) {
      console.error(`Error fetching chart data for ${symbol}:`, err);
      return null;
    }
  };

  const handleBuyStock = (stock) => {
    alert(`Buying ${stock.name} (${stock.symbol}) at $${stock.price}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStockSearch(searchQuery);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#FFFFFF" },
      },
      title: {
        display: true,
        text: "Stock Price (Last 7 Days)",
        color: "#FFFFFF",
        font: { size: 16 },
      },
      tooltip: { backgroundColor: "#1F2937" },
    },
    scales: {
      x: { ticks: { color: "#D1D5DB" } },
      y: { ticks: { color: "#D1D5DB" } },
    },
  };

  return (
    <div className="p-6 bg-black min-h-screen font-sans text-white">
      <h2 className="text-4xl font-extrabold text-blue-400 mb-8 text-center tracking-tight">
        Stocks Invest Dashboard
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a stock (e.g., AAPL, TSLA)"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-center text-gray-400 text-lg">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      )}

      {/* Stock List */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-blue-300 mb-4">Search Results</h3>
        {stocks.length > 0 ? (
          <div className="space-y-6">
            {stocks.map((stock, index) => (
              <div
                key={stock.symbol}
                className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 h-[35vh] flex flex-row overflow-hidden"
              >
                {index % 2 === 0 ? (
                  <>
                    {/* Left: Info */}
                    <div className="w-1/2 p-6 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-white">
                          {stock.name}
                        </h4>
                        <p className="text-gray-400">Symbol: {stock.symbol}</p>
                        <p className="text-blue-300 font-medium">
                          Price: ${stock.price || "Fetching..."}
                        </p>
                        {stock.suggestion ? (
                          <div className="text-sm">
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Recommendation:</strong>{" "}
                              <span
                                className={
                                  stock.suggestion.recommendation.includes("Buy")
                                    ? "text-blue-500"
                                    : stock.suggestion.recommendation.includes("Avoid")
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }
                              >
                                {stock.suggestion.recommendation}
                              </span>
                            </p>
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Reason:</strong>{" "}
                              {stock.suggestion.reason}
                            </p>
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Risk:</strong>{" "}
                              <span
                                className={
                                  stock.suggestion.risk === "Low"
                                    ? "text-blue-500"
                                    : stock.suggestion.risk === "High"
                                    ? "text-red-500"
                                    : "text-yellow-400"
                                }
                              >
                                {stock.suggestion.risk}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">Loading suggestion...</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleBuyStock(stock)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium self-start"
                        disabled={!stock.price}
                      >
                        Buy
                      </button>
                    </div>
                    {/* Right: Graph */}
                    <div className="w-1/2 p-4">
                      {chartData[stock.symbol] ? (
                        <Line data={chartData[stock.symbol]} options={chartOptions} />
                      ) : (
                        <p className="text-gray-400 text-center">Loading chart...</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left: Graph */}
                    <div className="w-1/2 p-4">
                      {chartData[stock.symbol] ? (
                        <Line data={chartData[stock.symbol]} options={chartOptions} />
                      ) : (
                        <p className="text-gray-400 text-center">Loading chart...</p>
                      )}
                    </div>
                    {/* Right: Info */}
                    <div className="w-1/2 p-6 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-white">
                          {stock.name}
                        </h4>
                        <p className="text-gray-400">Symbol: {stock.symbol}</p>
                        <p className="text-blue-300 font-medium">
                          Price: ${stock.price || "Fetching..."}
                        </p>
                        {stock.suggestion ? (
                          <div className="text-sm">
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Recommendation:</strong>{" "}
                              <span
                                className={
                                  stock.suggestion.recommendation.includes("Buy")
                                    ? "text-blue-500"
                                    : stock.suggestion.recommendation.includes("Avoid")
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }
                              >
                                {stock.suggestion.recommendation}
                              </span>
                            </p>
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Reason:</strong>{" "}
                              {stock.suggestion.reason}
                            </p>
                            <p className="text-gray-300">
                              <strong className="text-blue-400">Risk:</strong>{" "}
                              <span
                                className={
                                  stock.suggestion.risk === "Low"
                                    ? "text-blue-500"
                                    : stock.suggestion.risk === "High"
                                    ? "text-red-500"
                                    : "text-yellow-400"
                                }
                              >
                                {stock.suggestion.risk}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">Loading suggestion...</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleBuyStock(stock)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium self-start"
                        disabled={!stock.price}
                      >
                        Buy
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No stocks found. Try searching for a stock symbol.
          </p>
        )}
      </div>
    </div>
  );
};

export default StocksInvest;