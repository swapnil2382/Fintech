import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import Chat from "./Chat";
import Tax from "./Tax";
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

const MainHome = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Sidebar links (limited to specified options)
  const sidebarLinks = [
    { to: "/tax", label: "Tax Overview" },
    { to: "/bank-accounts", label: "Accounts" }, // Renamed from "Bank Balance"
    { to: "/expenditure", label: "Expenditure" },
    { to: "/transactions", label: "Transactions" },
  ];

  // Full navigation links (for top navbar and routing)
  const navLinks = [
    { to: "/fraud", label: "Fraud Alerts" },
    { to: "/investments", label: "Investments" },
    { to: "/goals", label: "Goals" },
    { to: "/land", label: "" }, // Hidden in UI, route active
    { to: "/mutual-funds", label: "" }, // Hidden in UI, route active
    { to: "/fixed-deposits", label: "" }, // Hidden in UI, route active
    { to: "/stocksinvest", label: "" }, // Hidden in UI, route active
    { to: "/loan", label: "Loan Manager" },
    { to: "/finance", label: "Financial Health" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Fixed) */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between fixed h-full top-0 left-0">
        <div>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-blue-500">
              {user?.name || "User"}
            </h2>
          </div>
          <nav className="mt-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content (Adjusted to sit beside sidebar) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
             
              <div className="flex items-center space-x-4">
                {user &&
                  navLinks
                    .filter((link) => link.label !== "") // Only show links with labels
                    .map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
              </div>
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
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="mb-4">
                      Manage your finances efficiently with AI-powered insights.
                    </p>
                  </div>
                }
              />
              <Route path="/tax" element={<Tax />} />
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
            </Routes>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MainHome;