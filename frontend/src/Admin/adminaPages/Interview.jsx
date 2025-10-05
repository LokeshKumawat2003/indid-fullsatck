import React, { useState } from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Avatar,
    Button,
    Link,
    Tag,
    SimpleGrid,
    Input,
    useToast,
    Icon,
    Flex,
    Badge,
    Divider,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import { FiFileText, FiGithub, FiVideo, FiEdit2, FiSave, FiClock, FiLink, FiX, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";

// Dummy data
const dummyInterviews = [
    {
        id: "int1",
        fullName: "John Doe",
        developerType: "Frontend Developer",
        resume: "https://example.com/resume/johndoe.pdf",
        github: "https://github.com/johndoe/todo-app",
        interviewTime: "2025-10-10T10:30",
        meetLink: "https://meet.google.com/abc-defg-hij",
        status: "Scheduled",
        nextRound: "",
        files: [
            { name: "Assignment.pdf", link: "https://example.com/files/assignment.pdf" },
            { name: "Project.zip", link: "https://example.com/files/project.zip" },
        ],
    },
    {
        id: "int2",
        fullName: "Jane Smith",
        developerType: "Fullstack Developer",
        resume: "https://example.com/resume/janesmith.pdf",
        github: "https://github.com/janesmith/blog-api",
        interviewTime: "2025-10-11T14:00",
        meetLink: "https://meet.google.com/xyz-klmn-opq",
        status: "Scheduled",
        nextRound: "",
        files: [{ name: "Portfolio.pdf", link: "https://example.com/files/portfolio.pdf" }],
    },
];

const nextRoundOptions = [
    { label: "Next Round", icon: FiArrowRight, color: "blue" },
    { label: "Pass", icon: FiCheckCircle, color: "green" },
    { label: "Reject", icon: FiXCircle, color: "red" },
];

const Interview = () => {
    const [interviews, setInterviews] = useState(dummyInterviews);
    const [editingId, setEditingId] = useState(null);
    const [selectedNextRound, setSelectedNextRound] = useState({});
    const toast = useToast();

    const handleTimeChange = (id, value) => {
        setInterviews((prev) =>
            prev.map((intv) => (intv.id === id ? { ...intv, interviewTime: value } : intv))
        );
    };

    const handleMeetChange = (id, value) => {
        setInterviews((prev) =>
            prev.map((intv) => (intv.id === id ? { ...intv, meetLink: value } : intv))
        );
    };

    const handleCancel = (id) => {
        setInterviews((prev) =>
            prev.map((intv) => (intv.id === id ? { ...intv, status: "Cancelled" } : intv))
        );
        toast({
            title: "Interview Cancelled",
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
        setEditingId(null);
    };

    const toggleEdit = (id) => {
        setEditingId(editingId === id ? null : id);
    };

    const selectNextRoundOption = (id, option) => {
        setSelectedNextRound((prev) => ({ ...prev, [id]: option }));
    };

    const submitNextRound = (id) => {
        const option = selectedNextRound[id];
        if (!option) return;
        setInterviews((prev) =>
            prev.map((intv) => (intv.id === id ? { ...intv, nextRound: option } : intv))
        );
        toast({
            title: "Next Round Updated",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
        setSelectedNextRound((prev) => ({ ...prev, [id]: "" }));
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <Box p={6} bg="gray.50" minH="100vh">
            {/* Header */}
            <Box mb={8}>
                <Heading as="h1" size="xl" color="gray.800" fontWeight="bold" mb={2}>
                    Interview Schedule
                </Heading>
                <Text color="gray.600" fontSize="md">
                    Manage and conduct candidate interviews
                </Text>
            </Box>

            {/* Interviews Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {interviews.map((intv) => (
                    <Box
                        key={intv.id}
                        p={6}
                        bg="white"
                        borderRadius="2xl"
                        shadow="sm"
                        borderWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.3s ease"
                        _hover={{ 
                            shadow: "md",
                            transform: "translateY(-2px)"
                        }}
                    >
                        {/* Header with Avatar and Status */}
                        <Flex justify="space-between" align="start" mb={4}>
                            <HStack spacing={4}>
                                <Avatar 
                                    name={intv.fullName} 
                                    size="lg"
                                    bg="blue.500"
                                />
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                        {intv.fullName}
                                    </Text>
                                    <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} rounded="md">
                                        {intv.developerType}
                                    </Badge>
                                </VStack>
                            </HStack>
                            <Tag 
                                colorScheme={intv.status === "Scheduled" ? "green" : "red"}
                                size="md"
                                rounded="full"
                                px={3}
                            >
                                {intv.status}
                            </Tag>
                        </Flex>

                        <Divider mb={4} />

                        {/* Interview Details */}
                        <VStack align="stretch" spacing={3} mb={4}>
                            {/* Time Display */}
                            {!editingId || editingId !== intv.id ? (
                                <Flex align="center" gap={2} color="gray.600">
                                    <Icon as={FiClock} boxSize={4} />
                                    <Text fontSize="sm" fontWeight="medium">
                                        {formatDateTime(intv.interviewTime)}
                                    </Text>
                                </Flex>
                            ) : null}

                            {/* Links */}
                            <HStack spacing={4}>
                                <Link 
                                    href={intv.resume} 
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
                                <Link 
                                    href={intv.github} 
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
                            </HStack>

                            {/* Files */}
                            {intv.files.length > 0 && (
                                <Box>
                                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2} textTransform="uppercase">
                                        Submitted Files
                                    </Text>
                                    <VStack align="start" spacing={1}>
                                        {intv.files.map((file, idx) => (
                                            <Link 
                                                key={idx} 
                                                href={file.link} 
                                                color="blue.500" 
                                                fontSize="sm"
                                                isExternal
                                                _hover={{ color: "blue.600" }}
                                            >
                                                📎 {file.name}
                                            </Link>
                                        ))}
                                    </VStack>
                                </Box>
                            )}

                            {/* Edit Mode */}
                            {editingId === intv.id && intv.status !== "Cancelled" && (
                                <VStack align="stretch" spacing={3} mt={2} p={4} bg="gray.50" rounded="lg">
                                    <InputGroup size="sm">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FiClock} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            type="datetime-local"
                                            value={intv.interviewTime}
                                            onChange={(e) => handleTimeChange(intv.id, e.target.value)}
                                            bg="white"
                                            rounded="lg"
                                            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                                        />
                                    </InputGroup>
                                    <InputGroup size="sm">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FiLink} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Google Meet Link"
                                            value={intv.meetLink}
                                            onChange={(e) => handleMeetChange(intv.id, e.target.value)}
                                            bg="white"
                                            rounded="lg"
                                            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                                        />
                                    </InputGroup>
                                    <HStack spacing={2}>
                                        <Button 
                                            colorScheme="blue" 
                                            size="sm" 
                                            leftIcon={<FiSave />}
                                            onClick={() => setEditingId(null)}
                                            flex="1"
                                            _focus={{ boxShadow: "none" }}
                                        >
                                            Save
                                        </Button>
                                        <Button 
                                            colorScheme="red" 
                                            size="sm" 
                                            variant="outline"
                                            leftIcon={<FiX />}
                                            onClick={() => handleCancel(intv.id)}
                                            flex="1"
                                            _focus={{ boxShadow: "none" }}
                                        >
                                            Cancel
                                        </Button>
                                    </HStack>
                                </VStack>
                            )}

                            {/* Next Round Selection */}
                            {intv.status !== "Cancelled" && (
                                <Box mt={2}>
                                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2} textTransform="uppercase">
                                        Next Step
                                    </Text>
                                    <HStack spacing={2} wrap="wrap">
                                        {nextRoundOptions.map((option) => (
                                            <Button
                                                key={option.label}
                                                size="sm"
                                                leftIcon={<Icon as={option.icon} />}
                                                colorScheme={selectedNextRound[intv.id] === option.label ? option.color : "gray"}
                                                variant={selectedNextRound[intv.id] === option.label ? "solid" : "outline"}
                                                onClick={() => selectNextRoundOption(intv.id, option.label)}
                                                _focus={{ boxShadow: "none" }}
                                                rounded="lg"
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </HStack>
                                    {selectedNextRound[intv.id] && (
                                        <Button
                                            colorScheme="blue"
                                            size="sm"
                                            mt={2}
                                            w="full"
                                            onClick={() => submitNextRound(intv.id)}
                                            _focus={{ boxShadow: "none" }}
                                            rounded="lg"
                                        >
                                            Confirm Selection
                                        </Button>
                                    )}
                                    {intv.nextRound && (
                                        <Flex align="center" gap={2} mt={2}>
                                            <Badge colorScheme="green" fontSize="xs" px={2} py={1} rounded="md">
                                                ✓ {intv.nextRound}
                                            </Badge>
                                        </Flex>
                                    )}
                                </Box>
                            )}
                        </VStack>

                        <Divider mb={4} />

                        {/* Action Buttons */}
                        <HStack spacing={2}>
                            {intv.status === "Scheduled" && (
                                <>
                                    <Button
                                        colorScheme="blue"
                                        as={Link}
                                        href={intv.meetLink}
                                        isExternal
                                        size="sm"
                                        leftIcon={<FiVideo />}
                                        flex="1"
                                        _focus={{ boxShadow: "none" }}
                                        rounded="lg"
                                    >
                                        Join Interview
                                    </Button>
                                    <Button 
                                        colorScheme="gray" 
                                        size="sm" 
                                        variant="outline"
                                        leftIcon={<FiEdit2 />}
                                        onClick={() => toggleEdit(intv.id)}
                                        _focus={{ boxShadow: "none" }}
                                        rounded="lg"
                                    >
                                        Edit
                                    </Button>
                                </>
                            )}
                            {intv.status === "Cancelled" && (
                                <Text color="red.500" fontSize="sm" fontWeight="medium">
                                    ✗ Interview Cancelled
                                </Text>
                            )}
                        </HStack>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Interview;