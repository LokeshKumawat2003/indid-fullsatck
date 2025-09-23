"use client";
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import JobList from "../components/jobpost/JobList";
import JobDetail from "../components/jobpost/JobDetail";
import Filters from "../components/jobpost/Filters";
import dummyJobs from "../data/dummyJobs.json";

const initialJobs = Array.isArray(dummyJobs) ? dummyJobs : [];

export default function JobPost() {
  const [jobs, setJobs] = React.useState(initialJobs);
  const [selectedJob, setSelectedJob] = React.useState(initialJobs[0] || null);

  React.useEffect(() => {
    setJobs(initialJobs);
    if (!selectedJob && initialJobs.length > 0) {
      setSelectedJob(initialJobs[0]);
    }
  }, []);

  // Add debug logging
  const handleJobSelect = React.useCallback((job) => {
    console.log('Job selected:', job);
    setSelectedJob(job);
  }, []);

  return (
    <Box>
      <Filters />
      <Flex>
        <JobList jobs={jobs} onSelect={handleJobSelect} />
        <JobDetail job={selectedJob} />
      </Flex>
    </Box>
  );
}