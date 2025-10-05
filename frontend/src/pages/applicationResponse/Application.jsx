import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Avatar,
  Divider,
  Stack,
} from "@chakra-ui/react";

export const Application = () => {
  // Example applied jobs (can replace with API data later)
  const appliedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Bangalore, India",
      status: "Applied",
      appliedDate: "Sept 28, 2025",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "CodeWorks",
      location: "Remote",
      status: "Interview Scheduled",
      appliedDate: "Sept 21, 2025",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "Delhi, India",
      status: "Rejected",
      appliedDate: "Sept 10, 2025",
    },
  ];

  return (
    <Box bg="gray.50" minH="100vh" p={6}>
      {/* Page Title */}
      <Heading mb={6} color="blue.600" fontSize="2xl">
        My Job Applications
      </Heading>

      <VStack spacing={5} align="stretch">
        {appliedJobs.map((job) => (
          <Box
            key={job.id}
            p={5}
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            shadow="sm"
            _hover={{ shadow: "md" }}
          >
            <HStack justify="space-between" align="start">
              <Stack direction="row" spacing={4}>
                <Avatar name={job.company} size="md" />
                <Box>
                  <Heading fontSize="lg" color="blue.700">
                    {job.title}
                  </Heading>
                  <Text fontWeight="medium">{job.company}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {job.location}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Applied on {job.appliedDate}
                  </Text>
                </Box>
              </Stack>

              <Badge
                fontSize="0.8em"
                colorScheme={
                  job.status === "Applied"
                    ? "blue"
                    : job.status === "Interview Scheduled"
                    ? "green"
                    : "red"
                }
                px={3}
                py={1}
                borderRadius="md"
              >
                {job.status}
              </Badge>
            </HStack>

            <Divider my={4} />

            <HStack justify="flex-end">
              <Button size="sm" colorScheme="blue" variant="solid">
                View Job
              </Button>
              <Button size="sm" colorScheme="gray" variant="outline">
                Withdraw
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
