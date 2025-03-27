import { useState, useEffect } from "react";
import axios from "axios";
import { FaSort, FaTrash } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch Transactions
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

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  // Sort Transactions
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

  // Filter Transactions
  const filteredTransactions = filterCategory
    ? transactions.filter((txn) => txn.category === filterCategory)
    : transactions;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Transaction History
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-gray-700 font-semibold">
          Filter by Category:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("date")}
              >
                Date <FaSort className="inline ml-1" />
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider">
                Description
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider">
                Bank Account
              </th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("amount")}
              >
                Amount (₹) <FaSort className="inline ml-1" />
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr
                  key={txn._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-4 text-gray-700">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-700">{txn.description}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                        txn.category === "Food"
                          ? "bg-red-100 text-red-600"
                          : txn.category === "Transport"
                          ? "bg-blue-100 text-blue-600"
                          : txn.category === "Housing"
                          ? "bg-yellow-100 text-yellow-600"
                          : txn.category === "Entertainment"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{txn.bankAccount.name}</td>
                  <td className="p-4 text-gray-700">
                    ₹{txn.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteTransaction(txn._id)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
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

      {/* Total Transactions Info */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-gray-700">
            Total Transactions:{" "}
            <span className="font-semibold">{filteredTransactions.length}</span>
          </p>
          <p className="text-gray-700">
            Total Spent: ₹
            <span className="font-semibold">
              {filteredTransactions
                .reduce((sum, txn) => sum + txn.amount, 0)
                .toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
