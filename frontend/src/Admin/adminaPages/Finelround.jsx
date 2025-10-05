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
  IconButton,
  Icon,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { FiTrash2, FiFileText, FiGithub, FiCheckCircle, FiXCircle, FiClock, FiSend, FiX } from "react-icons/fi";

// Dummy data for final round candidates
const dummyFinalRound = [
  {
    id: "fr1",
    fullName: "John Doe",
    developerType: "Frontend Developer",
    resume: "https://example.com/resume/johndoe.pdf",
    github: "https://github.com/johndoe/todo-app",
    status: "Scheduled",
    finalStatus: "",
    files: [
      { name: "Assignment.pdf", link: "https://example.com/files/assignment.pdf" },
    ],
  },
  {
    id: "fr2",
    fullName: "Jane Smith",
    developerType: "Fullstack Developer",
    resume: "https://example.com/resume/janesmith.pdf",
    github: "https://github.com/janesmith/blog-api",
    status: "Scheduled",
    finalStatus: "",
    files: [],
  },
];

const finalOptions = [
  { label: "Pass", icon: FiCheckCircle, color: "green" },
  { label: "Fail", icon: FiXCircle, color: "red" },
  { label: "Hold", icon: FiClock, color: "orange" },
];

const FinalRound = () => {
  const [candidates, setCandidates] = useState(dummyFinalRound);
  const [selectedFinal, setSelectedFinal] = useState({});
  const [showOfferInput, setShowOfferInput] = useState({});
  const [offerText, setOfferText] = useState({});
  const toast = useToast();

  const selectFinalOption = (id, option) => {
    setSelectedFinal((prev) => ({ ...prev, [id]: option }));
  };

  const submitFinalStatus = (id) => {
    const option = selectedFinal[id];
    if (!option) return;
    setCandidates((prev) =>
      prev.map((cand) => (cand.id === id ? { ...cand, finalStatus: option } : cand))
    );
    toast({
      title: "Final Status Updated",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setSelectedFinal((prev) => ({ ...prev, [id]: "" }));
  };

  const deleteCandidate = (id) => {
    const candidate = candidates.find((cand) => cand.id === id);
    setCandidates((prev) => prev.filter((cand) => cand.id !== id));
    toast({
      title: `${candidate.fullName} removed from final round`,
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleOfferInput = (id) => {
    setShowOfferInput((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sendOffer = (id) => {
    const text = offerText[id];
    if (!text) {
      toast({
        title: "Please enter the offer message",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const candidate = candidates.find((cand) => cand.id === id);
    toast({
      title: `Offer sent to ${candidate.fullName}`,
      description: text,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Hide input after sending
    setShowOfferInput((prev) => ({ ...prev, [id]: false }));
    setOfferText((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading as="h1" size="xl" color="gray.800" fontWeight="bold" mb={2}>
          Final Round Candidates
        </Heading>
        <Text color="gray.600" fontSize="md">
          Review and make final hiring decisions
        </Text>
      </Box>

      {/* Candidates Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {candidates.map((cand) => (
          <Box
            key={cand.id}
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
            position="relative"
          >
            {/* Delete button */}
            <IconButton
              aria-label="Delete Candidate"
              icon={<FiTrash2 />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              position="absolute"
              top={4}
              right={4}
              onClick={() => deleteCandidate(cand.id)}
              _focus={{ boxShadow: "none" }}
              rounded="lg"
            />

            {/* Header */}
            <Flex justify="space-between" align="start" mb={4}>
              <HStack spacing={4}>
                <Avatar 
                  name={cand.fullName} 
                  size="lg"
                  bg="purple.500"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" fontSize="lg" color="gray.800">
                    {cand.fullName}
                  </Text>
                  <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} rounded="md">
                    {cand.developerType}
                  </Badge>
                  <Tag 
                    colorScheme={cand.status === "Scheduled" ? "green" : "red"}
                    size="sm"
                    rounded="full"
                  >
                    {cand.status}
                  </Tag>
                </VStack>
              </HStack>
            </Flex>

            <Divider mb={4} />

            {/* Links */}
            <VStack align="stretch" spacing={3} mb={4}>
              <HStack spacing={4}>
                <Link 
                  href={cand.resume} 
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
                  href={cand.github} 
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
              {cand.files.length > 0 && (
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2} textTransform="uppercase">
                    Submitted Files
                  </Text>
                  <VStack align="start" spacing={1}>
                    {cand.files.map((file, idx) => (
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
            </VStack>

            {/* Final Status Selection */}
            {cand.status !== "Cancelled" && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                  Final Decision
                </Text>
                <HStack spacing={2} wrap="wrap" mb={3}>
                  {finalOptions.map((option) => (
                    <Button
                      key={option.label}
                      size="sm"
                      leftIcon={<Icon as={option.icon} />}
                      colorScheme={selectedFinal[cand.id] === option.label ? option.color : "gray"}
                      variant={selectedFinal[cand.id] === option.label ? "solid" : "outline"}
                      onClick={() => selectFinalOption(cand.id, option.label)}
                      _focus={{ boxShadow: "none" }}
                      rounded="lg"
                    >
                      {option.label}
                    </Button>
                  ))}
                </HStack>

                {selectedFinal[cand.id] && (
                  <Button
                    colorScheme="purple"
                    size="sm"
                    w="full"
                    onClick={() => submitFinalStatus(cand.id)}
                    _focus={{ boxShadow: "none" }}
                    rounded="lg"
                    mb={3}
                  >
                    Confirm Decision
                  </Button>
                )}

                {cand.finalStatus && (
                  <Badge 
                    colorScheme={
                      cand.finalStatus === "Pass" ? "green" : 
                      cand.finalStatus === "Fail" ? "red" : 
                      "orange"
                    } 
                    fontSize="sm" 
                    px={3} 
                    py={1} 
                    rounded="md"
                    mb={3}
                  >
                    ✓ Decision: {cand.finalStatus}
                  </Badge>
                )}

                {/* Send Offer Section */}
                {cand.finalStatus === "Pass" && (
                  <Box mt={4} p={4} bg="green.50" rounded="lg">
                    <Text fontSize="sm" fontWeight="semibold" color="green.800" mb={3}>
                      Send Job Offer
                    </Text>
                    {!showOfferInput[cand.id] ? (
                      <Button
                        colorScheme="green"
                        size="sm"
                        leftIcon={<FiSend />}
                        onClick={() => toggleOfferInput(cand.id)}
                        _focus={{ boxShadow: "none" }}
                        rounded="lg"
                      >
                        Compose Offer
                      </Button>
                    ) : (
                      <VStack align="stretch" spacing={2}>
                        <Input
                          placeholder="Enter offer message or details..."
                          size="sm"
                          value={offerText[cand.id] || ""}
                          onChange={(e) =>
                            setOfferText((prev) => ({ ...prev, [cand.id]: e.target.value }))
                          }
                          bg="white"
                          rounded="lg"
                          _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #48BB78" }}
                        />
                        <HStack spacing={2}>
                          <Button
                            colorScheme="green"
                            size="sm"
                            leftIcon={<FiSend />}
                            onClick={() => sendOffer(cand.id)}
                            flex="1"
                            _focus={{ boxShadow: "none" }}
                            rounded="lg"
                          >
                            Send Offer
                          </Button>
                          <Button
                            colorScheme="gray"
                            size="sm"
                            variant="outline"
                            leftIcon={<FiX />}
                            onClick={() => toggleOfferInput(cand.id)}
                            _focus={{ boxShadow: "none" }}
                            rounded="lg"
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FinalRound;