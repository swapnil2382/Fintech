import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Section - Information */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 text-center w-1/2">
        <h2 className="text-3xl font-extrabold text-blue-400 mb-6">Why Register?</h2>
        <p className="text-lg text-gray-300 max-w-md">
          Join us today to unlock exclusive features! Register and gain access to:
          <ul className="mt-4 text-gray-300 list-disc list-inside">
            <li>AI-powered insights for better decision-making</li>
            <li>Personalized dashboards tailored to your needs</li>
            <li>Secure and automated financial management tools</li>
            <li>Real-time fraud detection for enhanced security</li>
          </ul>
        </p>
      </div>

      {/* Middle Divider */}
      <div className="hidden md:block w-0.5 bg-gray-500 h-3/4 mt-24"></div>

      {/* Right Section - Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="bg-blue-950 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Register</h2>

          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border p-3 w-full rounded bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

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
            Register
          </button>

          {/* Already have an account? Login Link */}
          <p className="mt-4 text-center text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-600 font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
