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
    </div>
  );
};

export default BankAccounts;
