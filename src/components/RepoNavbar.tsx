import React from "react";
import { useNavigate } from "react-router-dom";

interface RepoNavbarProps {
  repoName?: string; // Optional repository name to display
}

const RepoNavbar: React.FC<RepoNavbarProps> = ({ repoName }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Back Button */}
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="text-gray-300 hover:text-white flex items-center"
            >
              <i className="bi bi-arrow-left text-xl mr-2"></i>
              Back
            </button>
          </div>

          {/* Center Section: Repository Name */}
          <div className="flex items-center">
            {repoName && (
              <h1 className="text-xl font-bold text-indigo-400">{repoName}</h1>
            )}
          </div>

          {/* Right Section: Empty for now */}
          <div className="flex items-center">
            {/* Add additional buttons or links here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RepoNavbar;
