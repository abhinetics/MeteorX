import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../contex/user.context";

export default function Home() {
  const { user } = useContext(UserContext);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [projectname, setProjectName] = useState("");
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  // 🧠 Fetch all projects
  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProject(res.data.projects || []);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // ➕ Create project
  function createProject(e) {
    e.preventDefault();
    if (!projectname.trim()) return;

    axios
      .post("/projects/create", { name: projectname })
      .then((res) => {
        setProject((prev) => [...prev, res.data.project]);
        setisModalOpen(false);
        setProjectName("");
      })
      .catch((error) => {
        console.error(error);
        alert("Error creating project");
      });
  }

  // 🔀 Navigate to project
  function navigateToProject(proj) {
    navigate(`/project`, { state: { project: proj } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 🌌 Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 🧭 Navbar */}
      <nav className="relative border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-xl font-bold text-white">CodeSpace</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Documentation
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-300">
                {user?.name || "Developer"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 🧱 Main Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">Your Projects</h2>
          <p className="text-slate-400">
            Create and manage your development projects
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* ➕ New Project Card */}
          <button
            onClick={() => setisModalOpen(true)}
            className="group relative overflow-hidden bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 mb-4 bg-slate-800 group-hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors">
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-slate-300 font-semibold group-hover:text-white transition-colors">
                New Project
              </p>
            </div>
          </button>

          {/* 📂 Project Cards */}
          {project.map((proj) => (
            <div
              key={proj._id}
              onClick={() => navigateToProject(proj)}
              className="group relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 cursor-pointer min-h-[200px]"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>

              <div className="relative h-full flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {proj.name}
                </h3>

                <div className="flex-1"></div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM6 10a2 2 0 114 0 2 2 0 01-4 0zM18 10a2 2 0 114 0 2 2 0 01-4 0z"
                      />
                    </svg>
                    <span>{proj.users?.length || 0}</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🧩 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Create New Project
                </h2>
                <button
                  onClick={() => setisModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={createProject} className="space-y-6">
                <div>
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Project Name
                  </label>
                  <input
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectname}
                    type="text"
                    id="projectName"
                    placeholder="Enter project name..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setisModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
