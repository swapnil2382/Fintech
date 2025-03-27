import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Same land prices object as above
const landPrices = {
  Mumbai: { avg: 50000, range: "45,000-55,000" },
  Delhi: { avg: 35000, range: "30,000-40,000" },
  Bangalore: { avg: 25000, range: "22,000-28,000" },
  Hyderabad: { avg: 18000, range: "15,000-20,000" },
  Chennai: { avg: 22000, range: "18,000-24,000" },
  Pune: { avg: 20000, range: "18,000-22,000" },
  Kolkata: { avg: 15000, range: "12,000-18,000" },
  Ahmedabad: { avg: 12000, range: "10,000-14,000" },
  Jaipur: { avg: 10000, range: "8,000-12,000" },
  Lucknow: { avg: 9000, range: "7,500-10,000" },
  Gurgaon: { avg: 28000, range: "25,000-32,000" },
  Noida: { avg: 25000, range: "22,000-28,000" },
  Chandigarh: { avg: 14000, range: "12,000-16,000" },
  Indore: { avg: 11000, range: "9,000-12,000" },
  Bhopal: { avg: 9000, range: "8,000-10,000" },
  Nagpur: { avg: 8500, range: "7,500-9,000" },
  Coimbatore: { avg: 12500, range: "10,000-14,000" },
  Visakhapatnam: { avg: 13500, range: "12,000-15,000" },
  Surat: { avg: 11000, range: "9,500-12,500" },
  Patna: { avg: 8000, range: "7,000-9,000" },
  Thane: { avg: 16000, range: "14,000-18,000" },
  "Navi Mumbai": { avg: 18000, range: "16,000-20,000" },
  Vadodara: { avg: 10500, range: "9,000-12,000" },
  Ludhiana: { avg: 8500, range: "7,000-9,500" },
  Kanpur: { avg: 7500, range: "6,500-8,000" },
  Varanasi: { avg: 7000, range: "6,000-7,500" },
  Ranchi: { avg: 6000, range: "5,000-7,000" },
  Bhubaneswar: { avg: 6500, range: "6,000-7,500" },
  Raipur: { avg: 6000, range: "5,500-7,000" },
  Dehradun: { avg: 7000, range: "6,500-8,000" },
  Guwahati: { avg: 5000, range: "4,500-6,000" },
  Mysore: { avg: 9500, range: "8,500-10,500" },
  Jodhpur: { avg: 8500, range: "7,500-9,500" },
  Amritsar: { avg: 9000, range: "8,000-10,000" },
  Meerut: { avg: 8000, range: "7,000-9,000" },
  Agra: { avg: 7500, range: "6,500-8,500" },
  Nashik: { avg: 9200, range: "8,500-9,800" },
  Rajkot: { avg: 8800, range: "8,000-9,500" },
  Aurangabad: { avg: 8600, range: "7,800-9,200" },
  Jabalpur: { avg: 7800, range: "7,000-8,500" },
};

const Land = () => {
  const [landLocation, setLandLocation] = useState("");
  const [landSuggestion, setLandSuggestion] = useState(null);
  const navigate = useNavigate();

  const handleLandSubmit = (e) => {
    e.preventDefault();
    if (!landLocation) return;

    const location =
      landLocation.trim().charAt(0).toUpperCase() +
      landLocation.trim().slice(1).toLowerCase();
    const landData = landPrices[location];
    const sqFtPerAcre = 43560; // 1 acre = 43,560 sq ft
    const budget = 1000000; // ₹10 lakh

    if (landData) {
      const pricePerAcre = landData.avg * sqFtPerAcre;
      const remainingBudget = budget - pricePerAcre;
      setLandSuggestion({
        location,
        avgPrice: landData.avg,
        range: landData.range,
        pricePerAcre,
        remainingBudget,
        canAfford: remainingBudget >= 0,
      });
    } else {
      setLandSuggestion("Location not found in the database.");
    }
    setLandLocation("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          📍 Invest in Land
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter a city in India to check land investment opportunities.
        </p>

        <form onSubmit={handleLandSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              City Name (e.g., Mumbai, Hyderabad)
            </label>
            <input
              type="text"
              value={landLocation}
              onChange={(e) => setLandLocation(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city name"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 w-1/2"
            >
              Check Rates
            </button>
            <button
              type="button"
              onClick={() => navigate("/investments")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 w-1/2"
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {landSuggestion && (
        <div className="mt-6 max-w-lg w-full bg-white p-6 rounded-lg shadow-lg transition-opacity duration-300 animate-fadeIn">
          {typeof landSuggestion === "string" ? (
            <p className="text-red-600 text-center font-medium">
              {landSuggestion}
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                📊 Investment Details - {landSuggestion.location}
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold">Avg Price:</span> ₹
                  {landSuggestion.avgPrice.toLocaleString()}/sq.ft
                </p>
                <p>
                  <span className="font-semibold">Price Range:</span>{" "}
                  {landSuggestion.range}
                </p>
                <p>
                  <span className="font-semibold">Price per Acre:</span> ₹
                  {landSuggestion.pricePerAcre.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Budget:</span> ₹ 1,000,000
                  (₹10 Lakh)
                </p>
                <p
                  className={`font-semibold ${
                    landSuggestion.canAfford ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {landSuggestion.canAfford
                    ? `✅ You can afford 1 acre! Remaining Budget: ₹${landSuggestion.remainingBudget.toLocaleString()}`
                    : `❌ Exceeds your budget by ₹${(-landSuggestion.remainingBudget).toLocaleString()}`}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Land;
