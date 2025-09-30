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

function App() {




  return (
    <>
      {/* Navbar stays visible on all pages */}
      <Navbar />
      {/* Define routes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AiHome />} />
        <Route path="/MyJobs" element={<MyJobs />} />
        <Route path="/jobpost" element={<JobPost />} />
        <Route path="/companyreviews" element={<Companyreviews />} />
        <Route path="/Salaryguide" element={<Salaryguide />} />
        <Route path="/Auth" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
