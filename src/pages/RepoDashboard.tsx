import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface File {
  _id: string;
  filename: string;
  content: string;
}

interface Repository {
  _id: string;
  name: string;
  description: string;
  visibility: "private" | "public";
  owner: { username: string };
}

const RepoDashboard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [newFilename, setNewFilename] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL =
    "https://collaborative-workspace-platform-backend.onrender.com/api";

  useEffect(() => {
    fetchRepoDetails();
    fetchFiles();
  }, [id]);

  // ✅ Fetch Repository Details
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

  // ✅ Fetch Repository Files
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/repos/${id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  // ✅ Push New File
  const handlePush = async () => {
    if (!newFilename || !newContent) {
      alert("Please enter a filename and content.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/repos/${id}/push`,
        { filename: newFilename, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("File pushed successfully!");
      setFiles([...files, response.data.file]);
      setNewFilename("");
      setNewContent("");
    } catch (error) {
      console.error("Failed to push file:", error);
      alert("Error pushing file");
    }
  };

  // ✅ Pull Latest Code
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
      fetchFiles(); // ✅ Refresh file list after pulling
    } catch (error) {
      console.error("Failed to pull code:", error);
      alert("Error pulling code");
    }
  };

  // ✅ Delete Repository
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
    return <div className="text-center text-white">Loading repository...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold">{repo?.name}</h1>
      <p className="text-gray-400">{repo?.description}</p>
      <p className="text-gray-500">Owner: {repo?.owner.username}</p>

      {/* ✅ Push Code Section */}
      <input
        type="text"
        placeholder="Filename"
        value={newFilename}
        onChange={(e) => setNewFilename(e.target.value)}
      />
      <textarea
        placeholder="File content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <button onClick={handlePush}>Push Code</button>

      {/* ✅ Buttons */}
      <button onClick={handlePull}>Pull Code</button>
      <button onClick={handleDelete}>Delete Repository</button>

      {/* ✅ File List */}
      {files.map((file) => (
        <div key={file._id} onClick={() => setSelectedFile(file)}>
          {file.filename}
        </div>
      ))}

      {selectedFile && <pre>{selectedFile.content}</pre>}
    </div>
  );
};

export default RepoDashboard;
