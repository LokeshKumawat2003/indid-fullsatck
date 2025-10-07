import React, { useState, useEffect } from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Tag,
    TagLabel,
    SimpleGrid,
    useDisclosure,
    useToast,
    Badge,
    Flex,
    Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiDollarSign, FiClock, FiMonitor, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { appRequest } from "../../../Routes/backendRutes";
import JobPostDetails from "./JobpostDetails";
import JobEdit from "./jobEidit";

const JobsHome = () => {
    const [jobs, setJobs] = useState([]);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await appRequest("post", "getAllJobPosts");
            if (Array.isArray(response)) {
                setJobs(response);
            } else {
                console.warn("API response for job posts was not an array:", response);
                setJobs([]); // Ensure jobs is always an array
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

    const handleView = (job) => {
        navigate(`/admin/job-details/${job._id}`);
    };

    const handleDelete = (id) => {
        setJobs(jobs.filter((job) => job.id !== id));
        toast({ title: "Job deleted", status: "info", duration: 2000, isClosable: true });
    };

    const handleEdit = (job) => {
        navigate(`/admin/Editjob/${job._id}`);
    };

    const handleUpdate = () => {
        setJobs(jobs.map((job) => (job.id === editData.id ? editData : job)));
        toast({ title: "Job updated successfully", status: "success", duration: 2000, isClosable: true });
        onEditClose();
    };

    return (
        <Box p={6} bg="gray.50" minH="100vh">
            {/* Header */}
            <Box mb={8}>
                <Heading as="h1" size="xl" color="gray.800" fontWeight="bold" mb={2}>
                    Jobs Dashboard
                </Heading>
                <Text color="gray.600" fontSize="md">
                    Manage and track all job postings
                </Text>
            </Box>

            {/* Job Cards Grid */}
            {loading ? (
                <Text key="loading-message" textAlign="center" fontSize="xl" mt={10}>Loading job posts...</Text>
            ) : jobs.length === 0 ? (
                <Text key="no-jobs-message" textAlign="center" fontSize="xl" mt={10}>No job posts found.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {jobs.map((job) => (
                        <Box
                            key={job.id}
                            bg="white"
                            p={6}
                            shadow="sm"
                            rounded="2xl"
                            borderWidth="1px"
                            borderColor="gray.100"
                            w="100%"
                            transition="all 0.3s ease"
                            _hover={{ 
                                transform: "translateY(-4px)", 
                                shadow: "xl",
                                borderColor: "blue.200"
                            }}
                        >
                            {/* Job Header */}
                            <VStack align="stretch" spacing={3} mb={4}>
                                <Heading size="md" color="gray.800" fontWeight="semibold" noOfLines={1}>
                                    {job.title}
                                </Heading>
                                <Text fontSize="md" color="gray.600" fontWeight="medium">
                                    {job.company}
                                </Text>
                            </VStack>

                            {/* Job Details */}
                            <VStack align="stretch" spacing={2} mb={4}>
                                <Flex key={`location-${job._id}`} align="center" gap={2} color="gray.600" fontSize="sm">
                                    <Icon as={FiMapPin} boxSize={4} />
                                    <Text>{job.location}</Text>
                                </Flex>
                                <Flex key={`salary-${job._id}`} align="center" gap={2} color="gray.600" fontSize="sm">
                                    <Icon as={FiDollarSign} boxSize={4} />
                                    <Text>{job.salary}</Text>
                                </Flex>
                                <HStack key={`badges-${job._id}`} spacing={3} fontSize="sm">
                                    <Badge colorScheme="blue" px={3} py={1} rounded="full">
                                        {job.jobType}
                                    </Badge>
                                    <Badge colorScheme="green" px={3} py={1} rounded="full">
                                        {job.workMode}
                                    </Badge>
                                </HStack>
                            </VStack>

                            {/* Skills Tags */}
                            <HStack spacing={2} wrap="wrap" mb={5}>
                                {(job.skills && Array.isArray(job.skills)) ? job.skills.slice(0, 3).map((skill, idx) => (
                                    <Tag 
                                        key={`${job._id}-skill-${skill}`}
                                        size="sm" 
                                        colorScheme="gray" 
                                        variant="subtle"
                                        rounded="full"
                                        px={3}
                                    >
                                        <TagLabel fontWeight="medium">{skill}</TagLabel>
                                    </Tag>
                                )) : null}
                            </HStack>

                            {/* Action Buttons */}
                            <HStack spacing={2} justify="stretch">
                                <Button 
                                    size="sm" 
                                    flex="1"
                                    leftIcon={<FiEye />}
                                    colorScheme="blue" 
                                    variant="outline" 
                                    onClick={() => handleView(job)}
                                    _focus={{ boxShadow: "none" }}
                                    fontWeight="medium"
                                >
                                    View
                                </Button>
                                <Button 
                                    size="sm" 
                                    leftIcon={<FiEdit2 />}
                                    colorScheme="orange" 
                                    variant="ghost" 
                                    onClick={() => handleEdit(job)}
                                    _focus={{ boxShadow: "none" }}
                                />
                                <Button 
                                    size="sm" 
                                    leftIcon={<FiTrash2 />}
                                    colorScheme="red" 
                                    variant="ghost" 
                                    onClick={() => handleDelete(job.id)}
                                    _focus={{ boxShadow: "none" }}
                                />
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            <JobEdit 
                isOpen={isEditOpen} 
                onClose={onEditClose} 
                editData={editData} 
                setEditData={setEditData} 
                handleUpdate={handleUpdate} 
            />
        </Box>
    );
};

export default JobsHome;