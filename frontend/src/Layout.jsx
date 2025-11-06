import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout() {
  const [projectOpen, setProjectOpen] = useState(false);
  const [leavesOpen, setLeavesOpen] = useState(false);
  const navigate = useNavigate();


  const loginUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        localStorage.removeItem("user");
        navigate("/login");
      }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">IT Log Book</h1>
        </div>

        <nav className="p-6 space-y-3">
          <Link
            to="/dashboard"
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>

          {loginUser?.role === "Viewer" && (
            <Link
              to="/logRating"
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              View logs & Rating
            </Link>
          )}

          {loginUser?.role === "Admin" && (
            <Link
              to="/allUserList"
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              All Users List
            </Link>
          )}

          {loginUser?.role !== "Viewer" && (
            <>
              <button
                onClick={() => setProjectOpen(!projectOpen)}
                className="flex items-center justify-between w-full rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <span>Project</span>
                <span>{projectOpen ? "▲" : "▼"}</span>
              </button>

              {projectOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/AddProject"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Add Project
                  </Link>
                  <Link
                    to="/projects/list"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Project List
                  </Link>
                </div>
              )}
            </>
          )}

          {loginUser?.role !== "Viewer" && (
            <>
              <button
                onClick={() => setLeavesOpen(!leavesOpen)}
                className="flex items-center justify-between w-full rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <span>Log Entry</span>
                <span>{leavesOpen ? "▲" : "▼"}</span>
              </button>

              {leavesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {(loginUser?.role === "Admin" ||
                    loginUser?.role === "Technician") && (
                    <Link
                      to="/logForm/AddLogEntry"
                      className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Add Log Tasks
                    </Link>
                  )}
                  {(loginUser?.role === "Admin" ||
                    loginUser?.role === "Technician" ||
                    loginUser?.role === "Manager") && (
                    <Link
                      to="/logForm/LogList"
                      className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Tasks List
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          <button
            onClick={handleLogout}
            className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
