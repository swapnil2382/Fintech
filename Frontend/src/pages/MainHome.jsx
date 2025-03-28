import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // Importing bell icon from react-icons
import Chat from "./Chat";
import Fraud from "./Fraud";
import Investments from "./Investments";
import Goals from "./Goals";
import BankAccounts from "./BankAccounts";
import Expenditure from "./Expenditure";
import Transactions from "./Transaction";
import Land from "./Land";
import MutualFunds from "./MutualFunds";
import FixedDeposits from "./FixedDeposits";
import LoanManager from "./LoanManager";
import FinancialHealthScore from "./FinancialHealthScore";
import StocksInvest from "./Stockinvest";
import TaxFiling from "./TaxFiling";
import Notifications from "./Notifications";
import FinancialInsights from "./FinancialInsights";
import Calculator from "./Calculator";
import Dashboard from "./Dashboard";

const MainHome = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  const sidebarLinks = [
    { to: "/dashboard", label: "Port-Folio" },
    { to: "/bank-accounts", label: "Accounts" },
    { to: "/expenditure", label: "Expenditure" },
    { to: "/transactions", label: "Transactions" },
    { to: "/calculator", label: "Tax Calculator" },
  ];

  const navLinks = [
    { to: "/fraud", label: "Fraud Alerts" },
    { to: "/investments", label: "Investments" },
    { to: "/goals", label: "Goals" },
    { to: "/loan", label: "Loan Manager" },
    { to: "/finance", label: "Financial Health" },
    { to: "/insights", label: "Financial Insights" },
    { to: "/tax-filing", label: "Taxes Invoice" },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 shadow-lg flex flex-col justify-between fixed h-full top-0 left-0">
        <div>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-blue-500">
              {user?.name || "User"}
            </h2>
          </div>
          <nav className="mt-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 px-4 text-gray-300 hover:bg-blue-500 hover:text-white transition duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-4">
                {user &&
                  navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-300 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md transition duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
              {/* Notification Bell */}
              {user && (
                <Link to="/notifications" className="text-gray-300 hover:text-blue-500 transition duration-200 flex items-center pr-5">
                  <FaBell className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white">
                    <p className="mb-4">
                      Manage your finances efficiently with AI-powered insights.
                    </p>
                  </div>
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fraud" element={<Fraud />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/bank-accounts" element={<BankAccounts />} />
              <Route path="/expenditure" element={<Expenditure />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/land" element={<Land />} />
              <Route path="/mutual-funds" element={<MutualFunds />} />
              <Route path="/fixed-deposits" element={<FixedDeposits />} />
              <Route path="/stocksinvest" element={<StocksInvest />} />
              <Route path="/loan" element={<LoanManager />} />
              <Route path="/finance" element={<FinancialHealthScore />} />
              <Route path="/tax-filing" element={<TaxFiling />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/insights" element={<FinancialInsights />} />
              <Route path="/calculator" element={<Calculator />} />
            </Routes>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MainHome;