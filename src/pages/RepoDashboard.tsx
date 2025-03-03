import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (loading) {
    return <div className="text-center text-white">Loading repository...</div>;
  }

  if (!repo) {
    return <div className="text-center text-white">Repository not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold">{repo.name}</h1>
      <p className="text-gray-400">{repo.description}</p>
      <p className="text-gray-500">Owner: {repo.owner.username}</p>
    </div>
  );
};

export default RepoDashboard;
