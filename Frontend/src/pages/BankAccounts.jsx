import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCreditCard,
  FaWallet,
  FaBuilding,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
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
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");

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

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amount = parseFloat(addMoneyAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/bank-accounts/add-money",
        { bankAccountId: selectedAccountId, amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAccounts(
        accounts.map((account) =>
          account._id === selectedAccountId
            ? { ...account, balance: data.updatedAccount.balance }
            : account
        )
      );
      setShowAddMoneyModal(false);
      setAddMoneyAmount("");
      setSelectedAccountId(null);
      alert("Money added successfully!");
    } catch (error) {
      alert("Error adding money: " + error.response?.data?.error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this account? This will also delete all associated transactions."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/bank-accounts/${accountId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAccounts(accounts.filter((account) => account._id !== accountId));
      alert("Account deleted successfully!");
    } catch (error) {
      alert("Error deleting account: " + error.response?.data?.error);
    }
  };

  const openAddMoneyModal = (accountId) => {
    setSelectedAccountId(accountId);
    setShowAddMoneyModal(true);
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
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Connected Accounts</h2>
          <p className="text-gray-400">
            Manage your linked financial accounts and connections
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200">
            <span className="text-lg">⟳</span> Sync All
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            <span className="text-lg">+</span> Add Account
          </button>
          <Link
            to="/expenditure"
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Track Expenditure
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="flex items-center justify-between bg-blue-950 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            <div className="flex items-center gap-4">
              {getIcon(account.type)}
              <div>
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <p className="text-sm text-gray-400">{account.type}</p>
                <p className="text-sm text-gray-500">
                  Last synced: {account.lastSynced}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-medium">₹{account.balance.toFixed(2)}</p>
              <span
                className={`text-sm ${account.status === "Connected"
                    ? "text-green-500"
                    : "text-red-500"
                  } flex items-center gap-1`}
              >
                {account.status === "Connected" ? "✔" : "✖"} {account.status}
              </span>
              <button
                onClick={() => openAddMoneyModal(account._id)}
                className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200"
              >
                <FaPlus /> Add Money
              </button>
              <button
                onClick={() => handleDeleteAccount(account._id)}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
              >
                <FaTrash /> Delete
              </button>
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

      {/* Add Money Modal */}
      {showAddMoneyModal && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
    <div className="p-6 rounded-lg shadow-lg max-w-md w-full border border-blue-600 bg-gray-900">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Add Money to Account
      </h3>
      <form onSubmit={handleAddMoney} className="text-white">
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Amount to Add (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={addMoneyAmount}
            onChange={(e) => setAddMoneyAmount(e.target.value)}
            className="w-full border border-blue-500 p-2 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5000"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Money
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddMoneyModal(false);
              setAddMoneyAmount("");
              setSelectedAccountId(null);
            }}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-200"
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
