// FinancialHealthScore.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FinancialHealthScore = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [dti, setDti] = useState('');
  const [score, setScore] = useState(null);

  const calculateScore = () => {
    axios.post('http://localhost:5000/api/financial-health/financial-health', {
      income,
      expenses,
      totalDebt,
      dti,
    })
    .then(response => setScore(response.data.score))
    .catch(error => console.error('Error calculating financial health score:', error));
  };

  return (
    <div>
      <h2>Financial Health Score</h2>
      <input
        type="number"
        placeholder="Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Expenses"
        value={expenses}
        onChange={(e) => setExpenses(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Debt"
        value={totalDebt}
        onChange={(e) => setTotalDebt(e.target.value)}
      />
      <input
        type="number"
        placeholder="DTI"
        value={dti}
        onChange={(e) => setDti(e.target.value)}
      />
      <button onClick={calculateScore}>Calculate Score</button>
      {score !== null && <p>Your Financial Health Score is: {score}</p>}
    </div>
  );
};

export default FinancialHealthScore;
