import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainHome from "./pages/MainHome";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
     
      
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<MainHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;