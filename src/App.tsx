// import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import CreateRepo from "./pages/CreateRepo";
import RepoNavbar from "./components/RepoNavbar"; // Import the new RepoNavbar

function App() {
  // const [count, setCount] = useState(0);

  // Create a wrapper component to conditionally render the navbar
  const AppContent: React.FC = () => {
    const location = useLocation();

    // Define routes where RepoNavbar should be displayed
    const repoRoutes = ["/create-repo"]; // Add more routes if needed

    // Check if the current route is a repository-related route
    const isRepoRoute = repoRoutes.includes(location.pathname);

    return (
      <>
        {/* Conditionally render the navbar */}
        {isRepoRoute ? <RepoNavbar /> : <Navbar />}

        {/* Main content */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-repo" element={<CreateRepo />} />
        </Routes>
      </>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
