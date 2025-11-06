import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogFormAdd from "./pages/logForm/AddLogEntry";
import LogList from "./pages/logForm/LogList";
import EditLogEntry from "./pages/logForm/EditLogEntry";
import AddProject from "./project/addProject";
import ProjectList from "./project/ProjectList";
import EditProject from "./project/EditProject";
import RatingLogForm from "./pages/logForm/Rating";
import AllUserList from "./pages/AllUserList";
import Logs_Rating from "./Viewer/Logs_Rating";
import { Toaster } from "react-hot-toast";
import Layout from "./Layout";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/allUserList" element={<AllUserList />} />
          <Route path="/logRating" element={<Logs_Rating />} />
          <Route path="/logForm/AddLogEntry" element={<LogFormAdd />} />
          <Route path="/logForm/LogList" element={<LogList />} />
          <Route path="/logForm/EditLogEntry/:id" element={<EditLogEntry />} />
          <Route path="/logForm/Rating/:id" element={<RatingLogForm />} />
          <Route path="/AddProject" element={<AddProject />} />
          <Route path="/projects/list" element={<ProjectList />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
