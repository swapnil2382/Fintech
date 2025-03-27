import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {user.name}! 🎉
            </h1>
            <p className="mb-4">
              Manage your finances efficiently with AI-powered insights.
            </p>
            <div className="flex gap-4">
              <Link
                to="/tax"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4"
              >
                Tax Overview
              </Link>
              <Link
                to="/fraud"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4"
              >
                Fraud Alerts
              </Link>

              <Link
                to="/investments"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4"
              >
                Explore Investments
              </Link>
              <Link
                to="/goals"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4"
              >
                goals
              </Link>
              <Link
                to="/bank-accounts"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4"
              >
                Check Bank Balance
              </Link>
              <Link
                to="/expenditure"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Track Expenditure
              </Link>
              <Link
                to="/transactions"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                View Transaction History
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Welcome to AI Accountant App
            </h1>
            <p className="mb-4">
              Track your expenses, get AI-powered insights, and manage your
              finances easily.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
