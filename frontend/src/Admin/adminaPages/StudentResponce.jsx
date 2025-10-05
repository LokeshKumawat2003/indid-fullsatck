import React, { useState } from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Tag,
    Avatar,
    SimpleGrid,
    Link,
    Button,
    Input,
    Textarea,
    Icon,
    Flex,
    Badge,
    Divider,
    InputGroup,
    InputLeftElement,
    useToast,
} from "@chakra-ui/react";
import { FiMail, FiPhone, FiGithub, FiFileText, FiExternalLink, FiCalendar, FiVideo, FiClock, FiLink, FiMessageSquare } from "react-icons/fi";

// Dummy student responses
const dummyResponses = [
    {
        id: "stu1",
        fullName: "John Doe",
        developerType: "Frontend Developer",
        education: "M.Sc. Computer Science",
        mobile: "+1 555-123-4567",
        assignmentTitle: "React ToDo App",
        deployedLink: "https://john-todo-app.vercel.app",
        github: "https://github.com/johndoe/todo-app",
        skills: ["React", "Chakra UI", "JavaScript"],
        resume: "https://example.com/resume/johndoe.pdf",
        email: "johndoe@example.com",
        interviewTime: "",
        meetLink: "",
        comment: "",
    },
    {
        id: "stu2",
        fullName: "Jane Smith",
        developerType: "Fullstack Developer",
        education: "B.Tech IT",
        mobile: "+1 555-987-6543",
        assignmentTitle: "Node.js Blog API",
        deployedLink: "https://jane-blog-app.vercel.app",
        github: "https://github.com/janesmith/blog-api",
        skills: ["Node.js", "Express", "MongoDB"],
        resume: "https://example.com/resume/janesmith.pdf",
        email: "janesmith@example.com",
        interviewTime: "",
        meetLink: "",
        comment: "",
    },
];

const StudentResponse = () => {
    const [responses, setResponses] = useState(dummyResponses);
    const [globalMeetLink, setGlobalMeetLink] = useState("");
    const [globalComment, setGlobalComment] = useState("");
    const toast = useToast();

    const handleInterviewChange = (id, value) => {
        setResponses((prev) =>
            prev.map((stu) =>
                stu.id === id ? { ...stu, interviewTime: value } : stu
            )
        );
    };

    const handleScheduleInterview = (id) => {
        const student = responses.find((stu) => stu.id === id);
        
        if (!student.interviewTime) {
            toast({
                title: "Date Required",
                description: "Please select a date and time first.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setResponses((prev) =>
            prev.map((stu) =>
                stu.id === id
                    ? {
                          ...stu,
                          meetLink: globalMeetLink,
                          comment: globalComment,
                      }
                    : stu
            )
        );

        toast({
            title: "Interview Scheduled",
            description: `Interview scheduled for ${student.fullName}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const formatDateTime = (datetime) => {
        if (!datetime) return "";
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
                    Student Submissions
                </Heading>
                <Text color="gray.600" fontSize="md">
                    Review assignments and schedule interviews
                </Text>
            </Box>

            {/* Global Interview Setup */}
            <Box 
                mb={6} 
                p={6} 
                bg="white" 
                borderRadius="2xl" 
                shadow="sm"
                borderWidth="1px"
                borderColor="gray.100"
            >
                <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={4}>
                    Interview Setup (Global)
                </Text>
                <VStack align="stretch" spacing={4}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiLink} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Enter Google Meet link for all interviews"
                            value={globalMeetLink}
                            onChange={(e) => setGlobalMeetLink(e.target.value)}
                            rounded="lg"
                            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiMessageSquare} color="gray.400" />
                        </InputLeftElement>
                        <Textarea
                            placeholder="Add a comment or instructions"
                            value={globalComment}
                            onChange={(e) => setGlobalComment(e.target.value)}
                            rounded="lg"
                            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                            pl={10}
                            rows={2}
                        />
                    </InputGroup>
                </VStack>
            </Box>

            {/* Student Cards Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {responses.map((stu) => (
                    <Box
                        key={stu.id}
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
                        {/* Header */}
                        <HStack spacing={4} mb={4}>
                            <Avatar 
                                name={stu.fullName} 
                                size="lg"
                                bg="blue.500"
                            />
                            <VStack align="start" spacing={1} flex="1">
                                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                    {stu.fullName}
                                </Text>
                                <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} rounded="md">
                                    {stu.developerType}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                    {stu.education}
                                </Text>
                            </VStack>
                        </HStack>

                        <Divider mb={4} />

                        {/* Contact Info */}
                        <VStack align="stretch" spacing={2} mb={4}>
                            <Flex align="center" gap={2} color="gray.600">
                                <Icon as={FiMail} boxSize={4} />
                                <Text fontSize="sm">{stu.email}</Text>
                            </Flex>
                            <Flex align="center" gap={2} color="gray.600">
                                <Icon as={FiPhone} boxSize={4} />
                                <Text fontSize="sm">{stu.mobile}</Text>
                            </Flex>
                        </VStack>

                        {/* Assignment Info */}
                        <Box mb={4} p={3} bg="blue.50" rounded="lg">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                {stu.assignmentTitle}
                            </Text>
                            <VStack align="stretch" spacing={2}>
                                <Link 
                                    href={stu.deployedLink} 
                                    isExternal 
                                    color="blue.500"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    _hover={{ color: "blue.600" }}
                                >
                                    <Icon as={FiExternalLink} />
                                    View Live Demo
                                </Link>
                                <Link 
                                    href={stu.github} 
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
                                    GitHub Repository
                                </Link>
                                <Link 
                                    href={stu.resume} 
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
                            </VStack>
                        </Box>

                        {/* Skills */}
                        <Box mb={4}>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2} textTransform="uppercase">
                                Skills
                            </Text>
                            <HStack spacing={2} wrap="wrap">
                                {stu.skills.map((skill, idx) => (
                                    <Tag 
                                        key={idx} 
                                        colorScheme="gray" 
                                        variant="subtle"
                                        rounded="full"
                                        px={3}
                                        size="sm"
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </HStack>
                        </Box>

                        <Divider mb={4} />

                        {/* Interview Scheduling */}
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                                Schedule Interview
                            </Text>
                            <HStack spacing={2} mb={3}>
                                <InputGroup size="sm" flex="1">
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FiCalendar} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        type="datetime-local"
                                        value={stu.interviewTime}
                                        onChange={(e) =>
                                            handleInterviewChange(stu.id, e.target.value)
                                        }
                                        rounded="lg"
                                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                                    />
                                </InputGroup>
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleScheduleInterview(stu.id)}
                                    _focus={{ boxShadow: "none" }}
                                    rounded="lg"
                                    px={6}
                                >
                                    Schedule
                                </Button>
                            </HStack>

                            {/* Scheduled Info */}
                            {stu.interviewTime && (
                                <VStack align="stretch" spacing={2} p={3} bg="green.50" rounded="lg">
                                    <Flex align="center" gap={2}>
                                        <Icon as={FiClock} color="green.600" boxSize={4} />
                                        <Text fontSize="sm" color="green.700" fontWeight="medium">
                                            {formatDateTime(stu.interviewTime)}
                                        </Text>
                                    </Flex>
                                    {stu.meetLink && (
                                        <Flex align="center" gap={2}>
                                            <Icon as={FiVideo} color="blue.600" boxSize={4} />
                                            <Link 
                                                href={stu.meetLink}
                                                isExternal
                                                fontSize="sm" 
                                                color="blue.600"
                                                fontWeight="medium"
                                                noOfLines={1}
                                            >
                                                {stu.meetLink}
                                            </Link>
                                        </Flex>
                                    )}
                                    {stu.comment && (
                                        <Text fontSize="sm" color="gray.700">
                                            <Text as="span" fontWeight="semibold">Note:</Text> {stu.comment}
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default StudentResponse;