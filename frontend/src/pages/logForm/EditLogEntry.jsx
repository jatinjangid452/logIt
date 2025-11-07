import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EditLogEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    project: "",
    technicians: [],
    task_type: "",
    description: "",
    date_time: "",
    related_ticket: "",
  });

  // Fetch Data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/projects");
        setProjects(res.data);
      } catch {
        toast.error("❌ Failed to fetch projects");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/users");
        setUsers(res.data);
      } catch {
        toast.error("❌ Failed to fetch users");
      }
    };

    const fetchLogEntry = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/logEntries/${id}`);
        const utcDate = new Date(res.data.date_time);
        const offsetMs = utcDate.getTimezoneOffset() * 60000;
        const localDate = new Date(utcDate.getTime() - offsetMs);
        const datetime = localDate.toISOString().slice(0, 16);

        setFormData({
          project: res.data.project,
          technicians: res.data.technicians || [],
          task_type: res.data.task_type,
          description: res.data.description,
          date_time: datetime,
          related_ticket: res.data.related_ticket || "",
        });
      } catch {
        toast.error("❌ Failed to fetch log entry");
      }
    };

    fetchProjects();
    fetchUsers();
    fetchLogEntry();
  }, [id]);

  // Filter technicians based on project
  useEffect(() => {
    if (formData.project) {
      const selectedProject = projects.find((p) => p._id === formData.project);
      if (selectedProject?.technicians?.length > 0) {
        const matchedUsers = users.filter((u) =>
          selectedProject.technicians.includes(u._id)
        );
        setFilteredTechnicians(matchedUsers);
      } else {
        setFilteredTechnicians([]);
      }
    } else {
      setFilteredTechnicians([]);
    }
  }, [formData.project, projects, users]);

  // Handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTechnicianChange = (e) =>
    setFormData({ ...formData, technicians: [e.target.value] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedProject = projects.find((p) => p._id === formData.project);
      await axios.put(`http://localhost:3000/api/logEntries/${id}`, {
        ...formData,
        project_name: selectedProject?.name,
      });
      toast.success("✅ Log entry updated successfully!");
      navigate("/logForm/LogList");
    } catch {
      toast.error("❌ Failed to update log entry");
    }
  };

  const handleBack = () => navigate("/logForm/LogList");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 py-10 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Log Entry</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Project Name
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Technician (Dropdown) */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Technician
            </label>
            <select
              name="technicians"
              value={formData.technicians[0] || ""}
              onChange={handleTechnicianChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Technician</option>
              {filteredTechnicians.length > 0 ? (
                filteredTechnicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No technicians available
                </option>
              )}
            </select>
          </div>

          {/* Task Type */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Task Type
            </label>
            <select
              name="task_type"
              value={formData.task_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Task Type</option>
              <option value="Incident">Incident</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Update">Update</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task details"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date_time"
              value={formData.date_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Related Ticket */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Related Ticket (Optional)
            </label>
            <input
              type="text"
              name="related_ticket"
              value={formData.related_ticket}
              onChange={handleChange}
              placeholder="Enter related ticket"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLogEntry;
