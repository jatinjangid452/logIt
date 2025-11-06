import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
const Logs_Rating = () => {
  const [logs, setLogs] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const fetchAllData = async () => {
    try {
      const [logsRes, ratingRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/logEntries"),
        axios.get("http://localhost:3000/api/ratings"),
        axios.get("http://localhost:3000/api/auth/users"),
      ]);

      const techs = usersRes.data.filter((u) => u.role === "Technician");
      setUsers(techs);
      setLogs(logsRes.data);
      setRatings(ratingRes.data);
      toast.success("All data loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch one or more APIs");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getTechnicianName = (id) => {
    const tech = users.find((u) => u._id === id);
    return tech ? tech.name : "Unknown Technician";
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 mb-4"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Logs and Ratings (Read-Only)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Project</th>
              <th className="border px-4 py-2">Technicians</th>
              <th className="border px-4 py-2">Task Type</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Date & Time</th>
              <th className="border px-4 py-2">Related Ticket</th>
              <th className="border px-4 py-2">Rating / Feedback</th>
            </tr>
          </thead> 

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{log.project_name}</td>
                  <td className="border px-4 py-2">
                    {Array.isArray(log.technicians)
                      ? log.technicians
                          .map((techId) => getTechnicianName(techId))
                          .join(", ")
                      : getTechnicianName(log.technicians)}
                  </td>
                  <td className="border px-4 py-2">{log.task_type}</td>
                  <td className="border px-4 py-2">{log.description}</td>
                  <td className="border px-4 py-2">
                    {new Date(log.date_time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    {log.related_ticket || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex items-center space-x-1">
                      {ratings
                        .filter((r) => r.log_id === log._id)
                        .map((r) => (
                          <React.Fragment key={r._id}>
                            {Array.from({ length: 5 }).map((_, i) =>
                              i < r.rating_value ? (
                                <FaStar key={i} className="text-yellow-400" />
                              ) : (
                                <FaRegStar key={i} className="text-gray-300" />
                              )
                            )}
                            {r.comments && (
                              <span className="text-gray-700 text-sm ml-2">
                                {r.comments}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 font-medium"
                >
                  No logs or ratings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs_Rating;
