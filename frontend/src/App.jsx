import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobPost from "./pages/JobPost";
import Companyreviews from "./pagesComponets/Companyreviews";
import Navbar from "./pagesComponets/Navbar";
import Salaryguide from "./pages/Salaryguide";
import AuthPage from "./pages/AuthPage";
import MyJobs from "./pages/MyJobs";
import AiHome from "./pages/AiInterview/AiHome";
import { useEffect } from "react";
import { Application } from "./pages/applicationResponse/Application";
import { ApplicationResponse } from "./pages/applicationResponse/ApplicationResponse";
import { Applications } from "./pages/applicationResponse/Applications";
import AdminDeshBord from "./Admin/adminaPages/AdminDeshBord";
import { AdminRoutes } from "./Admin/adminaPages/Routes/AdminRoutes";
// ...existing code...

function App() {




  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications/*" element={<Applications />} />
        <Route path="/applications/:id" element={<Application />} />
        <Route path="/applications/selected" element={<ApplicationResponse />} />

        <Route path="/ai" element={<AiHome />} />
        <Route path="/MyJobs" element={<MyJobs />} />
        <Route path="/jobpost" element={<JobPost />} />
        <Route path="/companyreviews" element={<Companyreviews />} />
        <Route path="/Salaryguide" element={<Salaryguide />} />
        <Route path="/Auth" element={<AuthPage />} />

        <Route path="/admin/*" element={<AdminDeshBord />} />

      </Routes>
      
    </>
  );
}

export default App;
