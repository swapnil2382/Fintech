import { useState, useEffect } from "react";
import axios from "axios";

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [formData, setFormData] = useState({ amount: "", source: "", description: "" });
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchIncome = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncomeList(data);

      // Calculate total income
      const total = data.reduce((sum, inc) => sum + inc.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching income", error);
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/income",
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setIncomeList([...incomeList, data]);
      setFormData({ amount: "", source: "", description: "" });

      // Update total income
      setTotalIncome((prevTotal) => prevTotal + data.amount);
    } catch (error) {
      console.error("Error adding income", error);
    }
  };

  const resetIncome = async () => {
    const confirmReset = window.confirm(
      "Are you sure? This will reset all your income, budget, and expenses to ₹0!"
    );

    if (!confirmReset) return; // If user cancels, do nothing

    try {
      // Reset both income and expenses
      await axios.post("http://localhost:5000/api/income/reset", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      await axios.delete("http://localhost:5000/api/expenses/reset", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setIncomeList([]); // Clear income list
      setTotalIncome(0); // Reset total income

      // ✅ Reset expenses by updating state in the Expenses component
      localStorage.setItem("resetExpenses", "true"); // ✅ Store a flag in local storage
      window.dispatchEvent(new Event("storage")); // ✅ Trigger event to notify Expenses component
    } catch (error) {
      console.error("Error resetting data", error);
    }
  };

  const thisMonthBudget = (totalIncome * 0.9).toFixed(2);
  const emergencySavings = (totalIncome * 0.1).toFixed(2);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Income</h2>

      {/* Budget Summary */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-semibold">Total Income: ₹{totalIncome.toFixed(2)}</h3>
        <h3 className="text-lg font-semibold text-blue-500">This Month's Budget: ₹{thisMonthBudget}</h3>
        <h3 className="text-lg font-semibold text-red-500">Emergency Savings: ₹{emergencySavings}</h3>
      </div>

      <form onSubmit={addIncome} className="mb-4 flex gap-2">
        <input type="number" name="amount" placeholder="Amount (₹)" onChange={handleChange} value={formData.amount} required className="border p-2" />
        <input type="text" name="source" placeholder="Source" onChange={handleChange} value={formData.source} required className="border p-2" />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} value={formData.description} className="border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add</button>
      </form>

      <button onClick={resetIncome} className="bg-red-500 text-white px-4 py-2 mb-4">
        Reset Income
      </button>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Income List</h3>
        {incomeList.length > 0 ? (
          <ul>
            {incomeList.map((inc) => (
              <li key={inc._id} className="p-2 border-b">
                {inc.source} - ₹{inc.amount} ({inc.description})
              </li>
            ))}
          </ul>
        ) : <p>No income recorded yet.</p>}
      </div>
    </div>
  );
};

export default Income;
