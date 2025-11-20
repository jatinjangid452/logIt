import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
const LogList = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loginUser, setLoginUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();
  const [loginUserCondition, setLoginUserCondition] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterTechnician, setFilterTechnician] = useState("");
  const [filterTaskType, setFilterTaskType] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterProjectName, setFilterProjectName] = useState("");

  useEffect(() => {
    fetchLogs();
    fetchUsers();
    fetchLoginUsers();
    fetchRatings();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/logEntries");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch log entries");
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/ratings");
      setRatings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users");
      const techs = res.data.filter((u) => u.role === "Technician");
      setUsers(techs);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchLoginUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/managers");
      setLoginUser(res.data[0]);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/logEntries/${id}`);
      setLogs(logs.filter((log) => log._id !== id));
      toast.success("Log entry deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete log entry");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };
  const handleAdd = () => {
    navigate("/logForm/AddLogEntry");
  };

  const filteredLogs = logs
    .filter((log) =>
      filterProjectName
        ? (log.project_name || "")
            .toLowerCase()
            .includes(filterProjectName.toLowerCase())
        : true
    )
    .filter((log) =>
      log.description.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .filter((log) =>
      filterTechnician ? log.technicians.includes(filterTechnician) : true
    )
    .filter((log) =>
      filterTaskType
        ? log.task_type.toLowerCase().includes(filterTaskType.toLowerCase())
        : true
    )
    .filter((log) => {
      if (!filterRating) return true;
      const ratingObj = ratings.find((r) => r.log_id === log._id);
      return ratingObj
        ? ratingObj.rating_value === Number(filterRating)
        : false;
    })
    .filter((log) => {
      const logDate = new Date(log.date_time);
      if (filterStartDate && logDate < new Date(filterStartDate)) return false;
      if (filterEndDate && logDate > new Date(filterEndDate)) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA, valB;

      if (sortField === "date") {
        valA = new Date(a.date_time);
        valB = new Date(b.date_time);
      } else if (sortField === "rating") {
        valA = ratings.find((r) => r.log_id === a._id)?.rating_value || 0;
        valB = ratings.find((r) => r.log_id === b._id)?.rating_value || 0;
      } else if (sortField === "technician") {
        valA = a.technicians
          .map((id) => users.find((u) => u._id === id)?.name || "")
          .join(", ");
        valB = b.technicians
          .map((id) => users.find((u) => u._id === id)?.name || "")
          .join(", ");
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);
    const goToPage = (num) => setCurrentPage(num);

  return (
    <div className="min-h-screen p-6 bg-cover bg-center bg-no-repeat">
      <button
        onClick={handleBack}
        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 mb-4"
      >
        Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">Log Entries</h2>

      <div className="mb-6 p-4 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🔍 Search & Filter Logs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Project Name</label>
            <input
              type="text"
              placeholder="e.g. CRM App"
              value={filterProjectName}
              onChange={(e) => setFilterProjectName(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Server issue"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Technician</label>
            <select
              value={filterTechnician}
              onChange={(e) => setFilterTechnician(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All Technicians</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Task Type</label>
            <input
              type="text"
              placeholder="e.g. Maintenance"
              value={filterTaskType}
              onChange={(e) => setFilterTaskType(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="1 - 5"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Sort By</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Field</option>
              <option value="date">Date</option>
              <option value="rating">Rating</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSearchKeyword("");
              setFilterTechnician("");
              setFilterTaskType("");
              setFilterRating("");
              setFilterStartDate("");
              setFilterEndDate("");
              setSortField("");
              setSortOrder("asc");
              setFilterProjectName("");
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 mb-4"
      >
        Add Logs Tsk
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Project</th>
            <th className="border px-4 py-2">Technicians</th>
            <th className="border px-4 py-2">Task Type</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Date & Time</th>
            <th className="border px-4 py-2">Related Ticket</th>
            <th className="border px-4 py-2">Actions</th>
            <th className="border px-4 py-2">Rating / Feedback</th>
          </tr>
        </thead>

        <tbody className="bg-white" style={{textAlign:"center"}}>
          {currentLogs.length > 0 ? (
            currentLogs.map((log) => (
              <tr key={log._id}>
                <td className="border px-4 py-2">
                  {log.project_name || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {log.technicians && log.technicians.length
                    ? log.technicians
                        .map((id) => users.find((u) => u._id === id)?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "None"}
                </td>
                <td className="border px-4 py-2">{log.task_type}</td>
                <td className="border px-4 py-2">{log.description}</td>
                <td className="border px-4 py-2">{log.date_time? (() => 
                {
                  const d = new Date(log.date_time);
                  const datePart = d.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });
                        const timePart = d.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        });
                        return `${datePart} ${timePart}`;
                      })()
                    : "-"}
                </td>

                <td className="border px-4 py-2">
                  {log.related_ticket || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {(loginUserCondition?.role === "Admin" ||
                    loginUserCondition?.role === "Technician") && (
                    <div className="flex space-x-2">
                      <Link
                        to={`/logForm/EditLogEntry/${log._id}`}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FiEdit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex items-center space-x-2 justify-between whitespace-nowrap">
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

                    {loginUser?.role === "Manager" && (
                      <Link
                        to={`/logForm/Rating/${log._id}?managerId=${loginUser._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Rate/Edit Task"
                      >
                        {(loginUserCondition?.role === "Admin" ||
                          loginUserCondition?.role === "Manager") && (
                          <FiEdit size={20} />
                        )}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No log entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
       <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    
  );
};

export default LogList;
