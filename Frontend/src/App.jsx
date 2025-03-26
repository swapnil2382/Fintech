import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Transactions from "./pages/Transaction";
import Budget from "./pages/Budget";
import Tax from "./pages/Tax";
import LoanManager from "./pages/LoanManager";
import FinancialHealthScore from "./pages/FinancialHealthScore";

const App = () => {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/loan" element={<LoanManager />} />
            <Route path="/finance" element={<FinancialHealthScore/>} />

          </Routes>
          <Transactions/>
      </AuthProvider>
    </Router>
  );
};

export default App;
