import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Users } from "lucide-react";

const AllUserList = () => {
  const [users, setUsers] = useState([]);

  const fetchLoginUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users");

      const filteredUsers = res.data.filter(
        (user) => user.role?.toLowerCase() !== "admin"
      );

      setUsers(filteredUsers);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/auth/users/${id}`);
      toast.success("User deleted successfully ✅");
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchLoginUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-500" /> All Users
          </h2>
          <p className="text-gray-500 text-sm">
            Excluding Admins • {users.length} Users Found
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border border-gray-200 rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3 capitalize text-gray-700">
                      {user.role}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 mx-auto transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found (Admins excluded)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUserList;

