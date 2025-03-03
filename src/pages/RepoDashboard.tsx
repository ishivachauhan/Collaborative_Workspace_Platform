import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "@monaco-editor/react";

interface RepoFile {
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
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<RepoFile[]>([]);

  // const API_URL = "http://localhost:5000/api"; // Update to your backend API URL

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

  // ✅ Read File Content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // ✅ Handle Multiple File Selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const fileArray: RepoFile[] = [];
    for (const file of Array.from(selectedFiles)) {
      const content = await readFileContent(file);
      fileArray.push({ _id: "", filename: file.name, content });
    }

    setUploadedFiles(fileArray);
  };

  // ✅ Push Multiple Files to Repo
  const handlePush = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        uploadedFiles.map(async (file) => {
          await axios.post(
            `${API_URL}/repos/${id}/push`,
            { filename: file.filename, content: file.content },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );

      alert("Files pushed successfully!");
      fetchFiles(); // ✅ Refresh file list after upload
      setUploadedFiles([]);
    } catch (error) {
      console.error("Failed to push files:", error);
      alert("Error pushing files");
    }
  };

  // ✅ Delete File from Repo
  const handleDeleteFile = async (fileId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/repos/${id}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("File deleted successfully!");
      fetchFiles(); // ✅ Refresh file list after deletion
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Error deleting file");
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
  const handleDeleteRepo = async () => {
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

      {/* ✅ File Upload Section */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mt-4"
      />
      {uploadedFiles.length > 0 && (
        <p className="text-green-400">
          {uploadedFiles.length} files ready to upload
        </p>
      )}

      <button
        onClick={handlePush}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded mt-2"
      >
        Push Files
      </button>

      {/* ✅ File List with Delete Button */}
      <div className="mt-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-2">Repository Files</h2>
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-gray-700 p-3 rounded mb-2 flex justify-between"
          >
            <span
              className="cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              {file.filename}
            </span>
            <button
              onClick={() => handleDeleteFile(file._id)}
              className="text-white px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              ❌ Delete File
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Monaco Editor */}
      {selectedFile && (
        <div className="mt-6 w-full max-w-3xl bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold">{selectedFile.filename}</h2>
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={selectedFile.content}
            theme="vs-dark"
            options={{ readOnly: true }}
          />
        </div>
      )}

      {/* ✅ Pull & Delete Repository Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handlePull}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        >
          Pull Code
        </button>
        <button
          onClick={handleDeleteRepo}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
        >
          Delete Repository
        </button>
      </div>
    </div>
  );
};

export default RepoDashboard;
