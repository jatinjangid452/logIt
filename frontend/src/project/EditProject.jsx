import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    startDate: "",
    endDate: "",
    technicians: [],
  });
  const [users, setUsers] = useState([]);

  // ✅ Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/users");
        setUsers(res.data.filter((u) => u.role === "Technician"));
      } catch (err) {
        toast.error("Failed to fetch technicians");
      }
    };
    fetchTechnicians();
  }, []);

  // ✅ Fetch existing project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/projects/${id}`);
        setFormData({
          name: res.data.name,
          manager: res.data.manager,
          startDate: res.data.startDate?.split("T")[0] || "",
          endDate: res.data.endDate?.split("T")[0] || "",
          technicians: res.data.technicians || [],
        });
      } catch (err) {
        toast.error("Failed to fetch project");
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTechnicianSelect = (e) => {
    const techId = e.target.value;
    if (techId && !formData.technicians.includes(techId)) {
      setFormData({
        ...formData,
        technicians: [...formData.technicians, techId],
      });
    }
  };

  const handleRemoveTechnician = (techId) => {
    setFormData({
      ...formData,
      technicians: formData.technicians.filter((id) => id !== techId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/projects/${id}`, formData);
      toast.success("✅ Project updated successfully!");
      navigate("/projects/list");
    } catch (err) {
      toast.error("❌ Failed to update project");
    }
  };

  const handleBack = () => navigate("/projects/list");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> Edit Project</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          ← Back
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Manager */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Manager Name
            </label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Enter manager name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Technicians */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Assign Technicians
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={handleTechnicianSelect}
            >
              <option value="">Select Technician</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            {formData.technicians.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.technicians.map((id) => {
                  const tech = users.find((u) => u._id === id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech?.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnician(id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const EditProject = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     manager: "",
//     startDate: "",
//     endDate: "",
//     technicians: [],
//   });
//   const [users, setUsers] = useState([]);

//   // Fetch all technicians
//   useEffect(() => {
//     const fetchTechnicians = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/auth/users");
//         setUsers(res.data.filter(u => u.role === "Technician"));
//       } catch (err) {
//         toast.error("Failed to fetch technicians");
//       }
//     };
//     fetchTechnicians();
//   }, []);

//   // Fetch project data
//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/projects/${id}`);
//         setFormData({
//           name: res.data.name,
//           manager: res.data.manager,
//           startDate: res.data.startDate?.split("T")[0] || "",
//           endDate: res.data.endDate?.split("T")[0] || "",
//           technicians: res.data.technicians || [],
//         });
//       } catch (err) {
//         toast.error("Failed to fetch project");
//       }
//     };
//     fetchProject();
//   }, [id]);

//   const handleChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleTechnicianSelect = e => {
//     const techId = e.target.value;
//     if (techId && !formData.technicians.includes(techId)) {
//       setFormData({ ...formData, technicians: [...formData.technicians, techId] });
//     }
//   };

//   const handleRemoveTechnician = id => {
//     setFormData({ 
//       ...formData, 
//       technicians: formData.technicians.filter(tid => tid !== id) 
//     });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3000/api/projects/${id}`, formData);
//       toast.success("Project updated successfully!");
//       navigate("/projects/list");
//     } catch (err) {
//       toast.error("Failed to update project");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto mt-12 bg-white rounded shadow">
//       <h2 className="text-2xl font-semibold mb-6">Edit Project</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Project Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Manager Name:</label>
//           <input
//             type="text"
//             name="manager"
//             value={formData.manager}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Start Date:</label>
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">End Date:</label>
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//      <div>
//         <label className="block mb-1 font-medium">Technician:</label>
//         <select
//           className="w-full border px-3 py-2 rounded"
//           name="technician"
//           value={formData.technicians[0] || ""} // show first technician as selected
//           onChange={e => setFormData({ ...formData, technicians: [e.target.value] })}
//         >
//           <option value="">Select Technician</option>
//           {users.map(u => (
//             <option key={u._id} value={u._id}>
//               {u.name}
//             </option>
//           ))}
//         </select>
//       </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Update Project
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProject;
