import { useState, useEffect } from "react";
import axios from "axios";
import { FaCreditCard, FaWallet, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "Bank Account",
    balance: "",
    income: "",
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/bank-accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const balance = parseFloat(newAccount.balance);
    if (!newAccount.name || isNaN(balance)) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/bank-accounts/add",
        newAccount,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAccounts([...accounts, data]);
      setShowAddModal(false);
      setNewAccount({
        name: "",
        type: "Bank Account",
        balance: "",
        income: "",
      });
    } catch (error) {
      alert("Error adding account: " + error.response?.data?.error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Bank Account":
        return <FaBuilding className="text-blue-500 text-2xl" />;
      case "Credit Card":
        return <FaCreditCard className="text-purple-500 text-2xl" />;
      case "Investment":
        return <FaBuilding className="text-green-500 text-2xl" />;
      case "Digital Wallet":
        return <FaWallet className="text-blue-400 text-2xl" />;
      default:
        return <FaBuilding className="text-gray-500 text-2xl" />;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Connected Accounts
          </h2>
          <p className="text-gray-600">
            Manage your linked financial accounts and connections
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
            <span className="text-lg">⟳</span> Sync All
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            <span className="text-lg">+</span> Add Account
          </button>
          <Link
            to="/expenditure"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Track Expenditure
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            <div className="flex items-center gap-4">
              {getIcon(account.type)}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {account.name}
                </h3>
                <p className="text-sm text-gray-600">{account.type}</p>
                <p className="text-sm text-gray-500">
                  Last synced: {account.lastSynced}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-medium text-gray-800">
                ₹{account.balance.toFixed(2)}
              </p>
              <span
                className={`text-sm ${
                  account.status === "Connected"
                    ? "text-green-500"
                    : "text-red-500"
                } flex items-center gap-1`}
              >
                {account.status === "Connected" ? "✔" : "✖"} {account.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Add New Account
            </h3>
            <form onSubmit={handleAddAccount}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HDFC Bank"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, type: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Investment">Investment</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Current Balance (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAccount.balance}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, balance: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10000"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAccount.income}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, income: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

export default BankAccounts;
