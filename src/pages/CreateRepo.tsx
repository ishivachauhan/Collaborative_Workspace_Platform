import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { div } from "framer-motion/client";
import UserNavbar from "../components/UserNavbar";
import RepoNavbar from "../components/RepoNavbar";

const CreateRepo: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "http://localhost:5000/api/repos",
        { name, description, visibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Repository created:", response.data);
      navigate("/dashboard"); // Redirect to dashboard after creation
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to create repository"
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-b from-slate-200 to-slate-500">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Repository
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Repository Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter repository name"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Repository Type
              </label>
              <select
                id="type"
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as "private" | "public")
                }
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter repository description"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Repository
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
