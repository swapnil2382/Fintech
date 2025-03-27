import { useState, useEffect } from "react";
import axios from "axios";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [formData, setFormData] = useState({ amount: "", category: "", description: "" });

  useEffect(() => {
    fetchTotalIncome();
  }, []);

  useEffect(() => {
    if (totalIncome > 0) {
      fetchExpenses();
    }
  }, [totalIncome]);

  const fetchTotalIncome = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/income/total", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const income = data.totalIncome ? data.totalIncome * 0.9 : 0;
      setTotalIncome(income);
      setRemainingBudget(income); // ✅ Set remaining budget initially to totalIncome
    } catch (error) {
      console.error("Error fetching total income:", error.response?.data || error);
      setTotalIncome(0);
      setRemainingBudget(0);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(data);
      updateRemainingBudget(data);
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error);
      setExpenses([]);
    }
  };

  const updateRemainingBudget = (newExpenses) => {
    const totalExpenses = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setRemainingBudget(Math.max(totalIncome - totalExpenses, 0)); // ✅ Now it only updates after both values are fetched
  };

  const addExpense = async (e) => {
    e.preventDefault();
    const expenseAmount = parseFloat(formData.amount);

    if (!formData.amount || !formData.category || !formData.description) {
      alert("All fields are required.");
      return;
    }

    if (expenseAmount > remainingBudget) {
      alert("Expense amount exceeds remaining budget.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/expenses",
        { ...formData, amount: expenseAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const updatedExpenses = [...expenses, data.expense];
      setExpenses(updatedExpenses);
      updateRemainingBudget(updatedExpenses);
      setFormData({ amount: "", category: "", description: "" });
    } catch (error) {
      console.error("Error adding expense:", error.response?.data || error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Expenses</h2>

      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-semibold">This Month Budget: ₹{totalIncome.toFixed(2)}</h3>
        <h3 className={`text-lg font-semibold ${remainingBudget === 0 ? "text-red-500" : "text-green-600"}`}>
          Remaining Budget: ₹{remainingBudget.toFixed(2)}
        </h3>
      </div>

      <form onSubmit={addExpense} className="mb-4 flex gap-2">
        <input
          type="number"
          placeholder="Amount (₹)"
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          value={formData.amount}
          className="border p-2"
          required
        />
        <select
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          value={formData.category}
          className="border p-2"
          required
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
          placeholder="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          value={formData.description}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add</button>
      </form>

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
