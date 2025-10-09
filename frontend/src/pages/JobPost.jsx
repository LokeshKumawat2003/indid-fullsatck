"use client";
import React from "react";
import { Box, Flex, Text, VStack, useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import JobList from "../components/jobpost/JobList";
import JobDetail from "../components/jobpost/JobDetail";
import Filters from "../components/jobpost/Filters";
import dummyJobs from "../data/dummyJobs.json";
import { appRequest } from "../Routes/backendRutes";

const initialJobs = Array.isArray(dummyJobs) ? dummyJobs : [];

export default function JobPost() {
  const location = useLocation();
  const [originalJobs, setOriginalJobs] = React.useState(initialJobs);
  const [jobs, setJobs] = React.useState(initialJobs);
  const [selectedJob, setSelectedJob] = React.useState(initialJobs[0] || null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const [searchParams, setSearchParams] = React.useState({ jobTitle: '', location: '' });
  const [activeFilters, setActiveFilters] = React.useState({});
    const fetchJobs = async () => {
        try {
          setLoading(true);
          const response = await appRequest("post", "getAllJobPosts");
          if (Array.isArray(response)) {
            // Keep a copy of original jobs for filtering
            setOriginalJobs(response);
            setJobs(response);
            setSelectedJob(response[0] || null);
          } else {
            console.warn("API response for job posts was not an array:", response);
            setOriginalJobs([]);
            setJobs([]); // Ensure jobs is always an array
            setSelectedJob(null);
          }
        } catch (error) {
          console.error("Error fetching job posts:", error);
          toast({
            title: "Error fetching job posts",
            description: error?.message || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
    };

      // Fetch jobs from backend when component mounts
      React.useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  // Comprehensive job filtering function
  const filterJobs = React.useCallback(() => {
    let filteredJobs = [...originalJobs];

    // First, filter by search params from Home page
    if (searchParams.jobTitle || searchParams.location) {
      filteredJobs = filteredJobs.filter(job => {
        const matchesJobTitle = !searchParams.jobTitle || 
          job.title.toLowerCase().includes(searchParams.jobTitle.toLowerCase()) || 
          job.company.toLowerCase().includes(searchParams.jobTitle.toLowerCase());
        
        const matchesLocation = !searchParams.location || 
          job.location.toLowerCase().includes(searchParams.location.toLowerCase());
        
        return matchesJobTitle && matchesLocation;
      });
    }

    // Then apply additional filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return; // Skip if no filter value selected

      filteredJobs = filteredJobs.filter(job => {
        switch(key) {
          case 'pay':
            const jobSalary = parseFloat(job.salary.replace('$', '').replace('k', '000'));
            const filterSalary = parseFloat(value.replace('$', '').replace('k', '000'));
            return jobSalary >= filterSalary;
          case 'workMode':
            return job.workMode.toLowerCase() === value.toLowerCase();
          case 'company':
            return job.company.toLowerCase() === value.toLowerCase();
          case 'jobType':
            return job.jobType.toLowerCase() === value.toLowerCase();
          case 'language':
            return job.language.toLowerCase() === value.toLowerCase();
          case 'skills':
            return job.skills.some(skill => skill.toLowerCase() === value.toLowerCase());
          case 'distance':
            // Simplified distance filtering
            return true; // You'd need more job data to implement actual distance filtering
          default:
            return true;
        }
      });
    });

    // Update jobs and select first job if exists
    setJobs(filteredJobs);
    setSelectedJob(filteredJobs[0] || null);
  }, [originalJobs, searchParams, activeFilters]);

  // Apply filters whenever search params or active filters change
  React.useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  // Log and filter input values from Home page
  React.useEffect(() => {
    const state = location.state || {};
    const { jobTitle = '', location: jobLocation = '' } = state;
    
    // Update search params state
    setSearchParams({ jobTitle, location: jobLocation });
  }, [location.state]);

  // Handle filter changes
  const handleFilterChange = React.useCallback((key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value || undefined // Use undefined to remove the filter
    }));
  }, []);

  // Add debug logging
  const handleJobSelect = React.useCallback((job) => {
    console.log('Job selected:', job);
    setSelectedJob(job);
  }, []);

  return (
    <Box>
      <Filters onFilterChange={handleFilterChange} />
      {jobs.length === 0 ? (
        <VStack p={8} align="center">
          <Text fontSize="xl" color="gray.500">
            No jobs found matching "{searchParams.jobTitle}" in "{searchParams.location}"
          </Text>
        </VStack>
      ) : (
        <Flex>
          <JobList jobs={jobs} onSelect={handleJobSelect} />
          <JobDetail job={selectedJob} />
        </Flex>
      )}
    </Box>
  );
}