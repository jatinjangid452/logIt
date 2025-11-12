import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users");
      const techs = res.data.filter((u) => u.role === "Technician");
      setUsers(techs);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`);
      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleAdd = () => navigate("/AddProject");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Project List</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          Add Project 
        </button>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {projects.length ? (
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Project Name</th>
                <th className="px-4 py-3 text-left font-semibold">Manager</th>
                <th className="px-4 py-3 text-left font-semibold">Start Date</th>
                <th className="px-4 py-3 text-left font-semibold">End Date</th>
                <th className="px-4 py-3 text-left font-semibold">Technicians</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr
                  key={p._id}
                  className={`border-t hover:bg-blue-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.manager}</td>
                  {/* <td className="px-4 py-3">{p.startDate?.split("T")[0]}</td>
                  <td className="px-4 py-3">{p.endDate?.split("T")[0] || "-"}</td> */}
                  <td>{p.startDate? new Date(p.startDate).toLocaleDateString("en-US", {month: "long",day: "numeric",year: "numeric",}): "-"}</td>
                  <td>{p.endDate? new Date(p.endDate).toLocaleDateString("en-US", {month: "long",day: "numeric",year: "numeric",}): "-"}</td>
                  <td className="px-4 py-3">
                    {p.technicians && p.technicians.length
                      ? p.technicians
                          .map((id) => users.find((u) => u._id === id)?.name)
                          .filter(Boolean)
                          .join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                     <Link
                        to={`/projects/edit/${p._id}`}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        title="Edit"
                      >
                        ✏️ Edit
                      </Link>
                    {/* <button
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      onClick={() => navigate(`/projects/edit/${p._id}`)}
                    >
                      ✏️ Edit
                    </button> */}
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-gray-500 text-lg">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;

