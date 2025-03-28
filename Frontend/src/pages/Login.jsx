import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/Home"); // ✅ Redirect to /Home after login
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="bg-blue-950 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Login</h2>

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-3 w-full rounded bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          
          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-3 w-full rounded bg-gray-800 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          
          {/* Submit Button */}
          <button type="submit" className="bg-blue-900 w-full py-2 rounded text-white font-semibold hover:bg-green-600 transition duration-300">
            Login
          </button>

          {/* Don't have an account? Register Link */}
          <p className="mt-4 text-center text-gray-300">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-600 font-semibold">
              Register
            </a>
          </p>
        </form>
      </div>

      {/* Middle Divider */}
      <div className="hidden md:block w-0.5 bg-gray-500 h-3/4 mt-24"></div>

      {/* Right Section - Information */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-3xl font-extrabold text-blue-400 mb-6">Why Login?</h2>
        <p className="text-lg text-gray-300 max-w-md">
          Access all our premium features by logging in.  
          Get AI-powered insights, personalized dashboards, and enhanced security.  
          Manage your finances efficiently with automated bookkeeping and smart investment tracking.  
          Stay ahead with real-time fraud detection and seamless account integration.
        </p>
      </div>
    </div>
  );
};

export default Login;
