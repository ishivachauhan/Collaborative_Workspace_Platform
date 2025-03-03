import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Define the shape of the repository object
interface Repository {
  _id: string;
  name: string;
  visibility: "private" | "public";
  owner: {
    username: string;
  };
  collaborators: any[]; // Replace `any` with a specific type if needed
  defaultBranch: string;
}

// Define the props for RepositoryCard
interface RepositoryCardProps {
  repo: Repository;
  onClick?: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, onClick }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (onClick) {
      onClick(); // ✅ Call the passed onClick function if provided
    } else {
      navigate(`/repo/${repo._id}`); // Default navigation
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="flex items-center mb-4">
        <div
          className={`h-3 w-3 rounded-full mr-2 ${
            repo.visibility === "private" ? "bg-red-500" : "bg-green-500"
          }`}
        />
        <h3 className="text-xl font-semibold text-gray-900">{repo.name}</h3>
      </div>

      <div className="text-sm text-gray-600">
        <p>Owner: {repo.owner.username}</p>
        <p>Visibility: {repo.visibility}</p>
        <p>Collaborators: {repo.collaborators.length}</p>
        <p>Default Branch: {repo.defaultBranch}</p>
      </div>
    </motion.div>
  );
};

export default RepositoryCard;
