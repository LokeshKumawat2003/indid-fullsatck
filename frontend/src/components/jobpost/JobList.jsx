import { Box, Text } from "@chakra-ui/react";
import JobCard from "./JobCard";

const JobList = ({ jobs, onSelect }) => (
  <Box p={4} w="40%" borderRight="1px solid #ddd" h="calc(100vh - 120px)" overflowY="auto">
    {(jobs && jobs.length > 0) ? (
      (jobs || []).map((job) => (
        <JobCard key={job.id} job={job} onClick={onSelect} />
      ))
    ) : (
      <Text color="gray.500">No jobs available</Text>
    )}
  </Box>
);

export default JobList;