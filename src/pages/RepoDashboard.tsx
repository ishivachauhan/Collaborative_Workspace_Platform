import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

interface Repository {
  _id: string;
  name: string;
  description: string;
  visibility: "private" | "public";
  owner: { username: string };
  collaborators: any[];
  defaultBranch: string;
}

const RepoDashboard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL =
    "https://collaborative-workspace-platform-backend.onrender.com/api";

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${API_URL}/repos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRepo(response.data);
      } catch (error) {
        console.error("Failed to fetch repository details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [id]);

  // ✅ Function to Push Code
  const handlePush = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/repos/${id}/push`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Code pushed successfully!");
    } catch (error) {
      console.error("Failed to push code:", error);
      alert("Error pushing code");
    }
  };

  // ✅ Function to Pull Code
  const handlePull = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/repos/${id}/pull`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Latest code pulled successfully!");
    } catch (error) {
      console.error("Failed to pull code:", error);
      alert("Error pulling code");
    }
  };

  // ✅ Function to Delete Repo
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/repos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Repository deleted successfully!");
      navigate("/dashboard"); // ✅ Redirect to dashboard after deletion
    } catch (error) {
      console.error("Failed to delete repository:", error);
      alert("Error deleting repository");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl text-blue-500"
        >
          <i className="bi bi-arrow-repeat"></i>
        </motion.div>
      </div>
    );
  }

  if (!repo) {
    return <div className="text-center text-white">Repository not found</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-3xl text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">{repo.name}</h1>
        <p className="text-gray-400">{repo.description}</p>
        <p className="text-gray-500">Owner: {repo.owner.username}</p>
      </motion.div>

      {/* ✅ Buttons for Repository Actions */}
      <motion.div
        className="mt-6 flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePush}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        >
          Push Code
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePull}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        >
          Pull Code
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
        >
          Delete Repository
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RepoDashboard;
