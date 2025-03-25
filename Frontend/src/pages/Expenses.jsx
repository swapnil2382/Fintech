import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: "", category: "", description: "" });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  // Fetch Summary
  const fetchSummary = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses/summary", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary", error);
    }
  };

  // Add Expense
  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/expenses", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses([...expenses, data]); // Update the list with new expense
      setFormData({ amount: "", category: "", description: "" });
      fetchSummary(); // Refresh summary after adding
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(expenses.filter(exp => exp._id !== id));
      fetchSummary(); // Refresh summary after deleting
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Expenses</h2>

      {/* Add Expense Form */}
      <form onSubmit={addExpense} className="mb-4 flex gap-2">
        <input type="number" name="amount" placeholder="Amount (₹)" onChange={handleChange} value={formData.amount} required className="border p-2" />
        
        <select name="category" onChange={handleChange} value={formData.category} required className="border p-2">
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Rent">Rent</option>
          <option value="Others">Others</option>
        </select>

        <input type="text" name="description" placeholder="Description" onChange={handleChange} value={formData.description} required className="border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add</button>
      </form>

      {/* Expenses List */}
      <ul className="bg-white p-4 rounded shadow">
        {expenses.length === 0 ? <p>No expenses yet</p> : expenses.map((exp) => (
          <li key={exp._id} className="flex justify-between p-2 border-b">
            <span>{exp.category} - ₹{exp.amount} ({exp.description})</span>
            <button onClick={() => deleteExpense(exp._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>

      {/* Financial Overview */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
        {summary ? (
          <div>
            <h3 className="text-xl font-semibold">Total Spent: ₹{summary.totalSpent}</h3>

            {/* Category Breakdown */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Category-wise Spending</h3>
              <Pie
                data={{
                  labels: Object.keys(summary.categoryBreakdown),
                  datasets: [
                    {
                      data: Object.values(summary.categoryBreakdown),
                      backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
                    },
                  ],
                }}
              />
            </div>

            {/* Monthly Spending */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Monthly Spending Trend</h3>
              <Bar
                data={{
                  labels: Object.keys(summary.monthlySpending),
                  datasets: [
                    {
                      label: "₹ Spent",
                      data: Object.values(summary.monthlySpending),
                      backgroundColor: "#36a2eb",
                    },
                  ],
                }}
              />
            </div>

            {/* Smart Budget Suggestion */}
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <h3 className="text-lg font-semibold">Budget Tip:</h3>
              <p>{summary.budgetAdvice}</p>
            </div>
          </div>
        ) : (
          <p>Loading financial summary...</p>
        )}
      </div>
    </div>
  );
};

export default Expenses;
