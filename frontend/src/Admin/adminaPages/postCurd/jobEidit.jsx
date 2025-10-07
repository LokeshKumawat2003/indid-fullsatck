import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Heading,
  Divider,
  Text,
  Tag,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import dummyJobs from "../../../data/dummyJobs.json";

const JobEdit = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const foundJob = dummyJobs.find((j) => j.id === jobId);
    setJob(foundJob);
    setEditData(foundJob || {});
  }, [jobId]);

  const handleUpdate = () => {
    // Here you would update your backend or state
    console.log("Updated Job Data:", editData);
    alert("Job updated successfully!");
    navigate("/admin/JobsHome"); // navigate back to jobs list or details page
  };

  if (!job) return <Text>Loading job data...</Text>;

  return (
    <Box mx="auto" mt={10} bg="white" p={8} borderRadius="xl" shadow="xl">
      {/* Header */}
      <VStack align="stretch" spacing={4}>
        <Text fontSize="3xl" fontWeight="bold" color="teal.600">
          Edit Job: {job.title}
        </Text>
        <HStack spacing={3}>
          <Text fontSize="lg" fontWeight="semibold">
            {job.company}
          </Text>
          <Badge colorScheme="green">{job.location}</Badge>
          {job.easyApply && <Badge colorScheme="blue">Easy Apply</Badge>}
        </HStack>
      </VStack>

      <Divider my={5} />

      {/* Job Details */}
      <SimpleGrid columns={[1, 2]} spacing={6}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            value={editData.title || ""}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Company</FormLabel>
          <Input
            value={editData.company || ""}
            onChange={(e) =>
              setEditData({ ...editData, company: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            value={editData.location || ""}
            onChange={(e) =>
              setEditData({ ...editData, location: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Salary</FormLabel>
          <Input
            value={editData.salary || ""}
            onChange={(e) =>
              setEditData({ ...editData, salary: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Work Mode</FormLabel>
          <Select
            value={editData.workMode || ""}
            onChange={(e) =>
              setEditData({ ...editData, workMode: e.target.value })
            }
          >
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Job Type</FormLabel>
          <Select
            value={editData.jobType || ""}
            onChange={(e) =>
              setEditData({ ...editData, jobType: e.target.value })
            }
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>AI Interview:</FormLabel>
          <Select
            value={editData.aiinterview ? "yes" : "no"}
            onChange={(e) =>
              setEditData({ ...editData, aiinterview: e.target.value === "yes" })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </FormControl>
      </SimpleGrid>

      <Divider my={5} />

      {/* Skills */}
      <Box>
        <FormControl>
          <FormLabel>Skills (comma separated)</FormLabel>
          <Input
            value={editData.skills ? editData.skills.join(", ") : ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                skills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </FormControl>
        <HStack spacing={2} wrap="wrap" mt={2}>
          {editData.skills &&
            editData.skills.map((skill, idx) => (
              <Tag key={idx} size="sm" colorScheme="blue">
                {skill}
              </Tag>
            ))}
        </HStack>
      </Box>

      <Divider my={5} />

      {/* Benefits */}
      <Box>
        <FormControl>
          <FormLabel>Benefits (comma separated)</FormLabel>
          <Input
            value={editData.benefits ? editData.benefits.join(", ") : ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                benefits: e.target.value.split(",").map((b) => b.trim()),
              })
            }
          />
        </FormControl>
        <HStack spacing={2} wrap="wrap" mt={2}>
          {editData.benefits &&
            editData.benefits.map((benefit, idx) => (
              <Tag key={idx} size="sm" colorScheme="purple" variant="subtle">
                {benefit}
              </Tag>
            ))}
        </HStack>
      </Box>

      <Divider my={5} />

      {/* Job Description */}
      <Box>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={editData.description || ""}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
        </FormControl>
      </Box>

      <HStack spacing={4} pt={4} justify="flex-end">
        <Button colorScheme="teal" onClick={handleUpdate}>
          Update Job
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};

export default JobEdit;
