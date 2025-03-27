// LoanManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanManager = () => {
  const [loans, setLoans] = useState([]);
  const [dti, setDti] = useState(null);
  const [income, setIncome] = useState('');
  const [optimizedLoans, setOptimizedLoans] = useState([]);

  useEffect(() => {
    // Fetch loans data
    axios.get('http://localhost:5000/api/loans/loans')
      .then(response => setLoans(response.data))
      .catch(error => console.error('Error fetching loans:', error));
  }, []);

  const calculateDTI = () => {
    axios.post('http://localhost:5000/api/loans/dti', { income })
      .then(response => setDti(response.data.dti))
      .catch(error => console.error('Error calculating DTI:', error));
  };

  const optimizeLoans = () => {
    axios.post('http://localhost:5000/api/loans/optimize')
      .then(response => setOptimizedLoans(response.data.optimizedLoans))
      .catch(error => console.error('Error optimizing loans:', error));
  };

  return (
    <div>
      <h2>Loan Management</h2>

      <div>
        <h3>Your Loans</h3>
        <ul>
          {loans.map(loan => (
            <li key={loan._id}>
              {loan.loanType} - ${loan.currentBalance} remaining
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Debt-to-Income (DTI) Calculator</h3>
        <input
          type="number"
          placeholder="Enter your income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <button onClick={calculateDTI}>Calculate DTI</button>
        {dti !== null && <p>Your DTI is: {dti}</p>}
      </div>

      <div>
        <h3>Loan Optimization</h3>
        <button onClick={optimizeLoans}>Optimize Loans</button>
        <ul>
          {optimizedLoans.map(loan => (
            <li key={loan._id}>
              {loan.loanType} - ${loan.currentBalance} remaining (Optimize by paying this off first)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoanManager;
