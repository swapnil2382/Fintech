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
import Fraud from "./pages/Fraud";
import Investments from "./pages/Investments";
import Land from "./pages/Land";
import MutualFunds from "./pages/MutualFunds";
import FixedDeposits from "./pages/FixedDeposits";
import Goals from "./pages/Goals";

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
          <Route path="/fraud" element={<Fraud />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/land" element={<Land />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/fixed-deposits" element={<FixedDeposits />}></Route>
        </Routes>
        <Transactions />
      </AuthProvider>
    </Router>
  );
};

export default App;
