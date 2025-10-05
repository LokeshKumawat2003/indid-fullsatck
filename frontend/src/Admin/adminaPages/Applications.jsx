import React, { useState } from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Input,
    Button,
    Checkbox,
    Avatar,
    Tag,
    SimpleGrid,
    useToast,
    Icon,
    Link,
    Flex,
    Badge,
    Divider,
} from "@chakra-ui/react";
import { FiMail, FiGithub, FiFileText, FiSend, FiUsers } from "react-icons/fi";

// Dummy application data with developerType
const dummyApplications = [
    {
        id: "app1",
        fullName: "John Doe",
        email: "johndoe@example.com",
        education: "M.Sc. Computer Science",
        developerType: "Frontend Developer",
        github: "https://github.com/johndoe",
        resume: "https://example.com/resume/johndoe.pdf",
        skills: ["React", "Node.js", "QA Testing"],
        appliedFor: "Software QA Engineer",
    },
    {
        id: "app2",
        fullName: "Jane Smith",
        email: "janesmith@example.com",
        education: "B.Tech Information Technology",
        developerType: "Fullstack Developer",
        github: "https://github.com/janesmith",
        resume: "https://example.com/resume/janesmith.pdf",
        skills: ["JavaScript", "UI/UX", "Automation"],
        appliedFor: "Frontend Developer",
    },
];

const Applications = () => {
    const [applications, setApplications] = useState(dummyApplications);
    const [selectedApps, setSelectedApps] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [assignment, setAssignment] = useState("");
    const toast = useToast();

    // Handle selecting a single applicant
    const handleSelect = (id) => {
        setSelectedApps((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Handle select all toggle
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedApps([]);
            setSelectAll(false);
        } else {
            setSelectedApps(applications.map((app) => app.id));
            setSelectAll(true);
        }
    };

    // Send assignment to selected applicants
    const handleSendAssignment = () => {
        if (!assignment || selectedApps.length === 0) {
            toast({
                title: "Error",
                description: "Enter assignment and select at least one applicant.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        console.log("Assignment sent to:", selectedApps, "Assignment:", assignment);
        toast({
            title: "Assignment Sent",
            description: `Assignment sent to ${selectedApps.length} applicants.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        // Reset
        setAssignment("");
        setSelectedApps([]);
        setSelectAll(false);
    };

    return (
        <Box p={6} bg="gray.50" minH="100vh">
            {/* Header */}
            <Box mb={8}>
                <Heading as="h1" size="xl" color="gray.800" fontWeight="bold" mb={2}>
                    Job Applications
                </Heading>
                <Text color="gray.600" fontSize="md">
                    Review and manage candidate applications
                </Text>
            </Box>

            {/* Assignment Controls */}
            <Box 
                bg="white" 
                p={5} 
                borderRadius="xl" 
                shadow="sm" 
                mb={6}
                borderWidth="1px"
                borderColor="gray.100"
            >
                <Flex 
                    direction={{ base: "column", md: "row" }}
                    gap={4}
                    align={{ md: "center" }}
                >
                    <Flex align="center" gap={3}>
                        <Checkbox
                            isChecked={selectAll}
                            onChange={handleSelectAll}
                            colorScheme="blue"
                            size="lg"
                            _focus={{ boxShadow: "none" }}
                        >
                            <Text fontWeight="medium" color="gray.700">
                                Select All ({applications.length})
                            </Text>
                        </Checkbox>
                        {selectedApps.length > 0 && (
                            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} rounded="full">
                                {selectedApps.length} selected
                            </Badge>
                        )}
                    </Flex>
                    
                    <Flex flex="1" gap={3}>
                        <Input
                            placeholder="Enter assignment details or link..."
                            value={assignment}
                            onChange={(e) => setAssignment(e.target.value)}
                            rounded="lg"
                            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                        />
                        <Button 
                            colorScheme="blue" 
                            onClick={handleSendAssignment}
                            leftIcon={<FiSend />}
                            px={6}
                            rounded="lg"
                            _focus={{ boxShadow: "none" }}
                        >
                            Send
                        </Button>
                    </Flex>
                </Flex>
            </Box>

            {/* Applications Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {applications.map((app) => (
                    <Box
                        key={app.id}
                        p={6}
                        bg="white"
                        borderRadius="2xl"
                        shadow="sm"
                        borderWidth="1px"
                        borderColor={selectedApps.includes(app.id) ? "blue.300" : "gray.100"}
                        transition="all 0.3s ease"
                        _hover={{ 
                            shadow: "md",
                            transform: "translateY(-2px)",
                            borderColor: "blue.200"
                        }}
                    >
                        {/* Header with Avatar and Checkbox */}
                        <Flex justify="space-between" align="start" mb={4}>
                            <HStack spacing={4}>
                                <Avatar 
                                    name={app.fullName} 
                                    size="lg" 
                                    bg="blue.500"
                                />
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                        {app.fullName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                        {app.appliedFor}
                                    </Text>
                                    <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} rounded="md">
                                        {app.developerType}
                                    </Badge>
                                </VStack>
                            </HStack>
                            <Checkbox
                                colorScheme="blue"
                                size="lg"
                                isChecked={selectedApps.includes(app.id)}
                                onChange={() => handleSelect(app.id)}
                                _focus={{ boxShadow: "none" }}
                            />
                        </Flex>

                        <Divider mb={4} />

                        {/* Contact & Details */}
                        <VStack align="stretch" spacing={3} mb={4}>
                            <Flex align="center" gap={2} color="gray.600">
                                <Icon as={FiMail} boxSize={4} />
                                <Text fontSize="sm">{app.email}</Text>
                            </Flex>
                            <Text fontSize="sm" color="gray.700">
                                <Text as="span" fontWeight="semibold">Education:</Text> {app.education}
                            </Text>
                            <HStack spacing={4}>
                                <Link 
                                    href={app.github} 
                                    isExternal 
                                    color="blue.500"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    _hover={{ color: "blue.600" }}
                                >
                                    <Icon as={FiGithub} />
                                    GitHub
                                </Link>
                                <Link 
                                    href={app.resume} 
                                    isExternal 
                                    color="blue.500"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    _hover={{ color: "blue.600" }}
                                >
                                    <Icon as={FiFileText} />
                                    Resume
                                </Link>
                            </HStack>
                        </VStack>

                        {/* Skills */}
                        <Box>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2} textTransform="uppercase">
                                Skills
                            </Text>
                            <HStack spacing={2} wrap="wrap">
                                {app.skills.map((skill, idx) => (
                                    <Tag 
                                        key={idx} 
                                        size="md" 
                                        colorScheme="gray" 
                                        variant="subtle"
                                        rounded="full"
                                        px={3}
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </HStack>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Applications;