import { useState, useEffect } from "react";
import axios from "axios";
import { FaSort, FaTrash, FaExclamationTriangle } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
      alert("Error deleting transaction: " + error.response?.data?.error);
    }
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = [...transactions].sort((a, b) => {
      if (field === "amount")
        return newSortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      if (field === "date")
        return newSortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      return 0;
    });
    setTransactions(sorted);
  };

  const filteredTransactions = filterCategory
    ? transactions.filter((txn) => txn.category === filterCategory)
    : transactions;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-8 text-blue-400">
        Transaction History
      </h2>

      {/* Filter Options */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold">Filter by Category:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-700 p-2 rounded-lg bg-gray-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th
                className="p-4 text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition"
                onClick={() => handleSort("date")}
              >
                Date <FaSort className="inline ml-1" />
              </th>
              <th className="p-4 text-sm font-semibold uppercase">Description</th>
              <th className="p-4 text-sm font-semibold uppercase">Category</th>
              <th className="p-4 text-sm font-semibold uppercase">Bank Account</th>
              <th
                className="p-4 text-sm font-semibold uppercase cursor-pointer hover:bg-blue-600 transition"
                onClick={() => handleSort("amount")}
              >
                Amount (₹) <FaSort className="inline ml-1" />
              </th>
              <th className="p-4 text-sm font-semibold uppercase">Status</th>
              <th className="p-4 text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-700 transition">
                  <td className="p-4">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{txn.description}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white">
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-4">{txn.bankAccount?.name}</td>
                  <td className="p-4 font-semibold text-green-400">₹{txn.amount.toFixed(2)}</td>
                  <td className="p-4">
                    {txn.isSuspicious ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <FaExclamationTriangle /> Suspicious
                      </span>
                    ) : (
                      <span className="text-green-400">Normal</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteTransaction(txn._id)}
                      className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-lg"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-lg">
            <span className="font-semibold text-blue-400">Total Transactions:</span>{" "}
            {filteredTransactions.length}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-400">Total Spent:</span> ₹
            {filteredTransactions
              .reduce((sum, txn) => sum + txn.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
