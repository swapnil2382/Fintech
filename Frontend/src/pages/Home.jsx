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
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}! 🎉</h1>
            <p className="mb-4">Manage your finances efficiently with AI-powered insights.</p>
            <div className="flex gap-4">
              <Link to="/expenses" className="bg-blue-500 text-white px-4 py-2 rounded">
                Go to Expenses
              </Link>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome to AI Accountant App</h1>
            <p className="mb-4">Track your expenses, get AI-powered insights, and manage your finances easily.</p>
            <div className="flex gap-4">
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded">
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
