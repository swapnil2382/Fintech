import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const sidebarLinks = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "transactions", label: "Transactions", path: "/transactions" },
  { id: "budget", label: "Budget", path: "/budget" },
  { id: "taxes", label: "Taxes", path: "/tax" }, 
  { id: "investments", label: "Investments", path: "/investments" },
  { id: "fraud", label: "Fraud Detection", path: "/fraud" },
  { id: "accounts", label: "Accounts", path: "/bank-accounts" },
  { id: "calculator", label: "Calculator", path: "/calculator" },

];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = { name: "John Doe" }; // Replace with actual user data

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Always Visible) */}
      <div className="w-1/5 min-h-screen bg-white shadow-lg p-4">
        <div className="flex flex-col items-start space-y-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            <h1 className="text-xl font-bold">Welcome, {user?.name}!</h1>
            <p>Manage your finances efficiently with AI-powered insights.</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className={`px-4 py-2 font-medium text-gray-700 transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-blue-200 rounded-md"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-1/5 p-4">
        {/* Top Navbar (Always Visible) */}
        <div className="bg-white shadow-md p-4 sticky top-0 w-full z-10">
          <h1 className="text-2xl font-bold">FinanceAI Dashboard</h1>
          <div className="border-b bg-gray-100">
            <div className="flex space-x-6 p-2">
              {sidebarLinks.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    location.pathname === tab.path
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Page Content (Only This Changes) */}
        <div className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
