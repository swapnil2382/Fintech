import { useState } from "react";
import axios from "axios";

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [formData, setFormData] = useState({ amount: "", source: "", description: "" });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new income entry
  const addIncome = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/income", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncomeList([...incomeList, data]);
      setFormData({ amount: "", source: "", description: "" });
    } catch (error) {
      console.error("Error adding income", error);
    }
  };

  // Fetch income data (optional)
  const fetchIncome = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncomeList(data);
    } catch (error) {
      console.error("Error fetching income", error);
    }
  };

  // Delete income entry
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncomeList(incomeList.filter((income) => income._id !== id));
    } catch (error) {
      console.error("Error deleting income", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Income</h2>

      {/* Add Income Form */}
      <form onSubmit={addIncome} className="mb-4 flex gap-2">
        <input type="number" name="amount" placeholder="Amount (₹)" onChange={handleChange} value={formData.amount} required className="border p-2" />
        <input type="text" name="source" placeholder="Source" onChange={handleChange} value={formData.source} required className="border p-2" />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} value={formData.description} className="border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add</button>
      </form>

      {/* Income List */}
      <ul className="bg-white p-4 rounded shadow">
        {incomeList.length === 0 ? <p>No income recorded</p> : incomeList.map((income) => (
          <li key={income._id} className="flex justify-between p-2 border-b">
            <span>{income.source} - ₹{income.amount} ({income.description})</span>
            <button onClick={() => deleteIncome(income._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Income;
