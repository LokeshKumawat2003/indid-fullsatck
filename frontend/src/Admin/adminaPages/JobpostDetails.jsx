import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Divider,
  Tag,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import dummyJobs from "../../data/dummyJobs.json";

const JobPostDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const foundJob = dummyJobs.find(j => j.id === jobId);
    console.log(foundJob);
    setJob(foundJob);
  }, [jobId]);

  if (!job) return <Text>Loading job details...</Text>;

  return (
    <Box  mx="auto" mt={10} bg="white" p={8} borderRadius="xl" shadow="xl">
      {/* Header */}
      <VStack align="stretch" spacing={4}>
        <Text fontSize="3xl" fontWeight="bold" color="teal.600">
          {job.title}
        </Text>
        <HStack spacing={3}>
          <Text fontSize="lg" fontWeight="semibold">{job.company}</Text>
          <Badge colorScheme="green">{job.location}</Badge>
          <Badge colorScheme="yellow">Rating: {job.rating} ⭐</Badge>
          {job.easyApply && <Badge colorScheme="blue">Easy Apply</Badge>}
        </HStack>
      </VStack>

      <Divider my={5} />

      {/* Job Details */}
      <SimpleGrid columns={[1, 2]} spacing={6}>
        <Box>
          <Text fontWeight="semibold">Salary:</Text>
          <Text>{job.salary}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Work Mode:</Text>
          <Text>{job.workMode}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Job Type:</Text>
          <Text>{job.jobType}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Language:</Text>
          <Text>{job.language}</Text>
        </Box>
        <Box>
  <Text fontWeight="semibold">AI Interview:</Text>
  <Text>{job.aiinterview ? "AI Interview Available ✅" : "AI Interview Not Available ❌"}</Text>
</Box>

        <Box>
          <Text fontWeight="semibold">Response Time:</Text>
          <Text>{job.responseTime}</Text>
        </Box>
   
      </SimpleGrid>

      <Divider my={5} />

      {/* Skills */}
      <Box>
        <Text fontWeight="semibold" mb={2}>Required Skills:</Text>
        <HStack spacing={2} wrap="wrap">
          {job.skills.map((skill, idx) => (
            <Tag key={idx} size="sm" colorScheme="blue">
              {skill}
            </Tag>
          ))}
        </HStack>
      </Box>

      <Divider my={5} />

      {/* Benefits */}
      <Box>
        <Text fontWeight="semibold" mb={2}>Benefits:</Text>
        <HStack spacing={2} wrap="wrap">
          {job.benefits.map((benefit, idx) => (
            <Tag key={idx} size="sm" colorScheme="purple" variant="subtle">
              {benefit}
            </Tag>
          ))}
        </HStack>
      </Box>

      <Divider my={5} />

      {/* Job Description */}
      <Box>
        <Text fontWeight="semibold" mb={2}>Job Description:</Text>
        <Text lineHeight="tall">{job.description}</Text>
      </Box>
    </Box>
  );
};

export default JobPostDetails;
