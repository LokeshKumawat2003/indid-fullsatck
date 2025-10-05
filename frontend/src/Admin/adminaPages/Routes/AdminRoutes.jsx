import { Routes, Route } from "react-router-dom";
import Applications from "../Applications";
import CreateJobPost from "../CreateJobPost";
import Interview from "../Interview";
import JobsHome from "../JobsHome";
import JobPostDetails from "../JobpostDetails";
import JobEdit from "../jobEidit";
import StudentResponse from "../StudentResponce";
import FinalRound from "../Finelround";

export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default child route for /admin */}
      <Route index element={<CreateJobPost />} />
      <Route path="create-job-post" element={<CreateJobPost />} />
      <Route path="applications" element={<Applications />} />
      <Route path="interview" element={<Interview />} />
      <Route path="JobsHome" element={<JobsHome/>} />
      <Route path="job-details/:jobId" element={<JobPostDetails/>} />
      <Route path="Editjob/:jobId" element={<JobEdit/>} />
      <Route path="StudentResponse" element={<StudentResponse/>} />
      <Route path="FinalRound" element={<FinalRound/>} />
    </Routes>
  );
};
