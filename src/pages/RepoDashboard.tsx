import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams(); // ✅ Get repo ID from URL
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

  // ✅ Function to Push Code to Repo
  const handlePush = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/repos/${id}/push`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Code pushed successfully!");
    } catch (error) {
      console.error("Failed to push code:", error);
      alert("Error pushing code");
    }
  };

  // ✅ Function to Pull Latest Code
  const handlePull = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/repos/${id}/pull`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
      navigate("/Dashboard"); // ✅ Redirect to dashboard after deletion
    } catch (error) {
      console.error("Failed to delete repository:", error);
      alert("Error deleting repository");
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading repository...</div>;
  }

  if (!repo) {
    return <div className="text-center text-white">Repository not found</div>;
  }

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white
                     w-screen mx-[-20px] mb-[-20px] px-[20px] pb-[20px] overflow-x-hidden"
    >
      <h1 className="text-3xl font-bold">{repo.name}</h1>
      <p className="text-gray-400">{repo.description}</p>
      <p className="text-gray-500">Owner: {repo.owner.username}</p>

      {/* ✅ Buttons for Repository Actions */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handlePush}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        >
          Push Code
        </button>
        <button
          onClick={handlePull}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        >
          Pull Code
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
        >
          Delete Repository
        </button>
      </div>
    </div>
  );
};

export default RepoDashboard;
