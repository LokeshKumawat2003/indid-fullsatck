import React, { useEffect, useState } from "react";
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
import { appRequest } from "../../Routes/backendRutes";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApps, setSelectedApps] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [assignment, setAssignment] = useState("");
    const toast = useToast();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Use the 'application' group and the 'getById' action so the backend
                // can resolve the user id from the auth token (no explicit id passed).
                const res = await appRequest("application", "getById");
                console.log("Raw fetched applications response:", res);
                // Log array elements when available (supports response directly or under `data`).
                if (Array.isArray(res)) {
                    res.forEach((el, i) => console.log(el.job, "element"));
                } else if (res && Array.isArray(res.data)) {
                    res.data.forEach((el, i) => console.log(el, "element (from data)"));
                } else {
                    console.log("Response is not an array — logging full payload:", res);
                }
                // Normalize possible response shapes into an array of application objects.
                const normalize = (payload) => {
                    if (!payload) return [];
                    if (Array.isArray(payload)) return payload;
                    if (Array.isArray(payload.applications)) return payload.applications;
                    if (Array.isArray(payload.application)) return payload.application;
                    if (payload.application && typeof payload.application === "object") return [payload.application];
                    if (payload.applications && typeof payload.applications === "object") return [payload.applications];
                    if (payload.data && Array.isArray(payload.data)) return payload.data;
                    if (payload.data && typeof payload.data === "object") return [payload.data];
                    if (typeof payload === "object") return [payload];
                    return [];
                };

                // Prefer `res.data` when backend returns { success, data, meta }
                const source = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : res);
                const apps = normalize(source);
                console.log("Normalized applications:", apps);

                // Map into a predictable, flat shape for the UI (pick nested user/job fields when present)
                const normalizedApps = apps.map((a) => {
                    const id = a._id || a.id || (a.job && a.job._id) || (a.user && a.user._id) || `${a.email || 'unknown'}-${Math.random().toString(36).slice(2,8)}`;

                    // Prefer skills from the application, then user, then job
                    const skills = Array.isArray(a.skills)
                        ? a.skills
                        : Array.isArray(a.user?.skills)
                        ? a.user.skills
                        : Array.isArray(a.job?.skills)
                        ? a.job.skills
                        : (typeof a.skills === 'string' ? a.skills.split(',').map(s=>s.trim()) : []);

                    // Github/resume field names in DB: githubProfile, resumeUrl — fallback to other possible keys
                    const github = a.github || a.user?.github || a.user?.githubProfile || a.user?.githubURL || a.user?.github_url || '#';
                    const resume = a.resume || a.user?.resume || a.user?.resumeUrl || a.user?.resumeURL || a.user?.resume_url || '#';

                    return {
                        id,
                        fullName: a.fullName || a.user?.fullName || a.user?.name || 'Unnamed Applicant',
                        email: a.email || a.user?.email || a.user?.contact || 'no-email@example.com',
                        appliedFor: a.appliedFor || a.job?.title || a.position || '—',
                        developerType: a.developerType || a.role || a.user?.developerType || a.job?.company || 'N/A',
                        skills,
                        github,
                        resume,
                        raw: a,
                    };
                });

                setApplications(normalizedApps);
            } catch (err) {
                console.error("Failed fetching applications", err);
                toast({
                    title: "Failed to load applications",
                    description: err?.message || "An error occurred while fetching applications.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchApplications();
    }, [toast]);

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
                {applications.map((app) => {
                    const appId = app?.id || app?._id || `${app?.email || 'unknown'}-${Math.random().toString(36).slice(2,8)}`;
                    const skills = Array.isArray(app?.skills) ? app.skills : (typeof app?.skills === 'string' ? app.skills.split(',').map(s=>s.trim()) : []);

                    return (
                    <Box
                        key={appId}
                        p={6}
                        bg="white"
                        borderRadius="2xl"
                        shadow="sm"
                        borderWidth="1px"
                        borderColor={selectedApps.includes(appId) ? "blue.300" : "gray.100"}
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
                                        {app.fullName || app?.name || 'Unnamed Applicant'}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                        {app.appliedFor || app?.position || '—'}
                                    </Text>
                                    <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} rounded="md">
                                        {app.developerType || app?.role || 'N/A'}
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
                                <Text fontSize="sm">{app.email || app?.contact || 'no-email@example.com'}</Text>
                            </Flex>
                            <Text fontSize="sm" color="gray.700">
                                <Text as="span" fontWeight="semibold">Education:</Text> {app.education}
                            </Text>
                            <HStack spacing={4}>
                                <Link 
                                    href={app.github || '#'} 
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
                                    href={app.resume || '#'} 
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
                                {skills.map((skill, idx) => (
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
                )})}
            </SimpleGrid>
        </Box>
    );
};

export default Applications;