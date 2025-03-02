import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Homepage from "./pages/homepage";
import { div } from "framer-motion/client";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
