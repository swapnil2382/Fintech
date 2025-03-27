import { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaCheckCircle, FaFlag } from "react-icons/fa";

const Fraud = () => {
  const [suspiciousTransactions, setSuspiciousTransactions] = useState([]);

  useEffect(() => {
    fetchSuspiciousTransactions();
  }, []);

  // Fetch suspicious transactions
  const fetchSuspiciousTransactions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/expenses/suspicious",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuspiciousTransactions(data);
    } catch (error) {
      console.error("Error fetching suspicious transactions:", error);
    }
  };

  // Mark transaction as safe
  const markAsSafe = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/expenses/${id}`,
        { isSuspicious: false, alerted: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuspiciousTransactions(
        suspiciousTransactions.filter((txn) => txn._id !== id)
      );
    } catch (error) {
      console.error("Error marking transaction as safe:", error);
    }
  };

  // Report transaction as fraud (placeholder for future implementation)
  const reportAsFraud = async (id) => {
    try {
      // Placeholder: In a real app, this would notify support or freeze the account
      alert("Transaction reported as fraud. Our team will review it shortly.");
      await axios.patch(
        `http://localhost:5000/api/expenses/${id}`,
        { isSuspicious: true, alerted: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuspiciousTransactions(
        suspiciousTransactions.filter((txn) => txn._id !== id)
      );
    } catch (error) {
      console.error("Error reporting transaction as fraud:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Fraud & Anomaly Alerts
      </h2>
      <p className="text-gray-600 mb-6">
        Review suspicious transactions detected by our system. Take action to
        mark them as safe or report them as fraud.
      </p>

      {suspiciousTransactions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No suspicious transactions detected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suspiciousTransactions.map((txn) => (
            <div
              key={txn._id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex items-start gap-4"
            >
              <FaExclamationTriangle className="text-red-500 text-2xl mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Suspicious Transaction Detected
                </h3>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Description:</span>{" "}
                  {txn.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Amount:</span> ₹
                  {txn.amount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(txn.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Bank Account:</span>{" "}
                  {txn.bankAccount.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {txn.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Anomaly Score:</span>{" "}
                  {txn.anomalyScore ? txn.anomalyScore.toFixed(2) : "N/A"}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => markAsSafe(txn._id)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    <FaCheckCircle /> Mark as Safe
                  </button>
                  <button
                    onClick={() => reportAsFraud(txn._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FaFlag /> Report as Fraud
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fraud;
