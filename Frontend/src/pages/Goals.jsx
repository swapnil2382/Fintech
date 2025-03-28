import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const navigate = useNavigate();

  const monthlyIncome = 50000;
  const monthlyExpenses = 30000;
  const monthlySavings = monthlyIncome - monthlyExpenses;

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !timeframe) return;

    const target = parseFloat(targetAmount);
    const current = parseFloat(currentSavings) || 0;
    const months = parseInt(timeframe);

    const progress = (current / target) * 100;
    const remainingAmount = target - current;
    const monthlyRequired = remainingAmount / months;

    let suggestion = "";
    if (monthlyRequired <= monthlySavings) {
      suggestion = `Good news! You can achieve this goal by saving ₹${monthlyRequired.toFixed(
        2
      )} per month.`;
    } else {
      const shortfall = monthlyRequired - monthlySavings;
      suggestion = `You need ₹${monthlyRequired.toFixed(
        2
      )} per month, but your current savings are only ₹${monthlySavings.toLocaleString()}. Consider:\n- Reducing expenses by ₹${shortfall.toFixed(
        2
      )}/month\n- Investing in Fixed Deposits (6-7% p.a.) or Mutual Funds (8-12% p.a.).`;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName,
      targetAmount: target,
      currentSavings: current,
      timeframe: months,
      progress: progress.toFixed(2),
      suggestion,
    };

    setGoals([...goals, newGoal]);
    setGoalName("");
    setTargetAmount("");
    setCurrentSavings("");
    setTimeframe("");
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Financial Goals</h2>
      <p className="text-gray-300 mb-6">
        Set and track your financial goals to plan your future effectively.
      </p>

      {/* Goal Input Form */}
      <form
        onSubmit={handleAddGoal}
        className="max-w-md mx-auto bg-blue-950 p-6 rounded-lg shadow-md mb-6"
      >
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Goal Name
          </label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Buy a Car"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Target Amount (₹)
          </label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 500000"
            min="1000"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Current Savings (₹)
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 50000"
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Timeframe (Months)
          </label>
          <input
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 12"
            min="1"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Goal
          </button>
          <button
            type="button"
            onClick={() => navigate("/investments")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Back to Investments
          </button>
        </div>
      </form>

      {/* Goals List */}
      {goals.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Your Goals
          </h3>
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-gray-700 p-6 rounded-lg shadow-md mb-4"
            >
              <h4 className="text-xl font-semibold text-white">
                {goal.name}
              </h4>
              <p className="text-gray-200">
                Target: ₹{goal.targetAmount.toLocaleString()}
              </p>
              <p className="text-gray-200">
                Current Savings: ₹{goal.currentSavings.toLocaleString()}
              </p>
              <p className="text-gray-200">
                Timeframe: {goal.timeframe} months
              </p>
              <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                Progress: {goal.progress}%
              </p>
              <p className="text-gray-300 mt-2 whitespace-pre-line">
                Suggestion: {goal.suggestion}
              </p>
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className="mt-4 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
