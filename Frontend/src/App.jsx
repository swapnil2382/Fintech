import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";
import Transactions from "./pages/Transaction";
import Fraud from "./pages/Fraud";
import Investments from "./pages/Investments";
import Land from "./pages/Land";
import MutualFunds from "./pages/MutualFunds";
import FixedDeposits from "./pages/FixedDeposits";
import Goals from "./pages/Goals";
import LoanManager from "./pages/LoanManager";
import FinancialHealthScore from "./pages/FinancialHealthScore";
import StocksInvest from "./pages/Stockinvest";
import BankAccounts from "./pages/BankAccounts";
import Expenditure from "./pages/Expenditure";
import TaxFiling from "./pages/TaxFiling";
import FinancialInsights from "./pages/FinancialInsights";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tax-filing" element={<TaxFiling />} />
          <Route path="/fraud" element={<Fraud />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/land" element={<Land />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/fixed-deposits" element={<FixedDeposits />} />
          <Route path="/stocksinvest" element={<StocksInvest />} />
          <Route path="/loan" element={<LoanManager />} />
          <Route path="/finance" element={<FinancialHealthScore />} />
          <Route path="/bank-accounts" element={<BankAccounts />} />
          <Route path="/expenditure" element={<Expenditure />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/insights" element={<FinancialInsights />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
