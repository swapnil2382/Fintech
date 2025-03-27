import { Outlet, useNavigate, useLocation } from "react-router-dom";


const sidebarLinks = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "transactions", label: "Transactions", path: "/transactions" },
  { id: "budget", label: "Budget", path: "/budget" },
  { id: "taxes", label: "Taxes", path: "/tax" }, 
  { id: "investments", label: "Investments", path: "/investments" },
  { id: "fraud", label: "Fraud Detection", path: "/fraud" },
  { id: "accounts", label: "Accounts", path: "/bank-accounts" },
];

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Always Visible) */}
     

      {/* Main Content Area */}
      <div className="w-4/5 ml-[20%] flex flex-col">
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
                    location.pathname === tab.path ? "border-b-2 border-black text-black" : "text-gray-500"
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

export default HomeLayout;
