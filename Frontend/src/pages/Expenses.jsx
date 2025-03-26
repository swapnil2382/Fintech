import { useState, useEffect } from "react";
import axios from "axios";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [formData, setFormData] = useState({ amount: "", category: "", description: "" });

  useEffect(() => {
    fetchTotalIncome();
    fetchExpenses();
  }, []);

  // ✅ Fetch Total Income
  const fetchTotalIncome = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/income/total", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const income = data.totalIncome ? data.totalIncome * 0.9 : 0; // Assuming 90% is used as net income
      setTotalIncome(income);
      setRemainingBudget(income); // Set Remaining Budget to match Total Income
    } catch (error) {
      console.error("Error fetching total income", error);
      setTotalIncome(0);
      setRemainingBudget(0);
    }
  };

  // ✅ Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses", error);
      setExpenses([]);
    }
  };

  // ✅ Add Expense
  const addExpense = async (e) => {
    e.preventDefault();
  
    const expenseAmount = parseFloat(formData.amount);  // Make sure it's a number
  
    if (!formData.amount || !formData.category || !formData.description) {
      alert("All fields are required.");
      return;
    }
  
    console.log("Sending expense data:", { ...formData, amount: expenseAmount });  // Log the request data
  
    try {
      const { data } = await axios.post("http://localhost:5000/api/expenses", { 
        ...formData, 
        amount: expenseAmount,  // Send the amount as a number
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      setRemainingBudget((prevBudget) => prevBudget - expenseAmount); // Deduct expense from remaining budget
      setExpenses([...expenses, data.expense]); // Add new expense to the list
      setFormData({ amount: "", category: "", description: "" }); // Reset form data
  
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Expenses</h2>

      {/* ✅ Budget Overview */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-semibold">This Month Budget: ₹{(totalIncome || 0).toFixed(2)}</h3>
        <h3 className="text-lg font-semibold text-red-500">Remaining Budget: ₹{(remainingBudget || 0).toFixed(2)}</h3>
      </div>

      {/* ✅ Expense Form */}
      <form onSubmit={addExpense} className="mb-4 flex gap-2">
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          value={formData.amount}
          required
          className="border p-2"
        />
        <select
          name="category"
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          value={formData.category}
          required
          className="border p-2"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Rent">Rent</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          value={formData.description}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add</button>
      </form>

      {/* ✅ Expense History */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Expense History</h3>
        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Category</th>
                <th className="border p-2">Amount (₹)</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-b">
                  <td className="border p-2">{exp.category}</td>
                  <td className="border p-2">₹{exp.amount}</td>
                  <td className="border p-2">{exp.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expenses;
