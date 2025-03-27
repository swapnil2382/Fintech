import { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";

const Fraud = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const fetchFraudAlerts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/fraud/alerts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching fraud alerts", error);
    }
  };

  const handleAcknowledge = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    console.log(`Alert ${id} acknowledged (mock action)`); // Mock action
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Fraud Detection & Alerts
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Potential Fraud Alerts
        </h3>
        {alerts.length === 0 ? (
          <p className="text-gray-500">No unusual transactions detected.</p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="border border-red-200 p-4 rounded-lg bg-red-50 flex items-start gap-4"
              >
                <FaExclamationTriangle className="text-red-500 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(alert.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Description:</span>{" "}
                    {alert.description}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {alert.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Amount:</span> ₹
                    {alert.amount.toLocaleString()}
                  </p>
                  <p className="text-red-600 font-medium mt-1">
                    Reason: {alert.reason}
                  </p>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Acknowledge
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Fraud;
