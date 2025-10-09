import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  List,
  ListItem,
  Link,
  Badge,
  Divider
} from "@chakra-ui/react"
import {
  Bookmark,
  Share2,
  MapPin,
  Briefcase,
  IndianRupee,
  Star,
  X,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appRequest } from "../../Routes/backendRutes";
import { useToast } from "@chakra-ui/react";

export default function JobDetail({ job }) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const navigate = useNavigate()
  // const handleApplyNow = () => setShowCustomModal(true);
  const closeModal = () => setShowCustomModal(false);

  const handleAiInterviewConfirm = () => {
    navigate("/ai")
    closeModal();
  };
  const toast = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyNow = async () => {
    try {
      setIsApplying(true);
      // get current user's account (backend will resolve 'me' from token)
      const response = await appRequest("userAccount", "getAccountById");
      const userData = Array.isArray(response) ? response[0] : response;

      const payload = {
        userAccount: userData?._id,
        jobpostID: job?._id || job?.id,
        adminId: job?.userid || job?.userId || null,
      };

      // Basic validation: ensure jobpostID looks like an ObjectId (24 hex chars)
      const jobId = payload.jobpostID;
      if (!jobId || !/^[0-9a-fA-F]{24}$/.test(String(jobId))) {
        toast({ title: "Invalid job", description: "This job is not eligible for application or is missing a proper id.", status: "error", duration: 4000, isClosable: true });
        return;
      }

      const createRes = await appRequest("application", "create", payload);
      console.log("Application response:", createRes);
      if (createRes && createRes.success) {
        toast({ title: "Application submitted", description: "Your application was created.", status: "success", duration: 4000, isClosable: true });
        // open AI interview modal to offer next step
        // setShowCustomModal(true);
      } else {
        const msg = (createRes && createRes.message) || "Failed to submit application";
        toast({ title: "Application failed", description: msg, status: "error", duration: 4000, isClosable: true });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Server error", status: "error", duration: 4000, isClosable: true });
    } finally {
      setIsApplying(false);
    }
  };
  const handleStandardApply = () => {
    console.log("Submitting standard application");
    closeModal();
  };

  return (
    <>
      <Box width="5xl" mx="auto" bg="white" borderRadius="12px" shadow="lg" h={"80vh"} overflow={"auto"}>
        {/* Header Section */}
        <Box p={8} bg="gradient-to-r" bgGradient="linear(to-r, blue.50, purple.50)">
          <HStack justify="space-between" align="start" mb={4}>
            <VStack align="start" spacing={3} flex="1">
              <Heading as="h1" size="xl" color="gray.800">
                {job?.title ?? 'Job Title Not Available'}
              </Heading>

              <HStack spacing={3} flexWrap="wrap">
                <Link
                  color="blue.600"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ color: "blue.700", textDecoration: "underline" }}
                >
                  {job?.company ?? 'Company Not Specified'}
                </Link>
                {job?.rating && (
                  <HStack
                    spacing={1}
                    bg="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    shadow="sm"
                  >
                    <Box as={Star} w={4} h={4} fill="#F6AD55" color="#F6AD55" />
                    <Text fontSize="sm" color="gray.700" fontWeight="600">
                      {job.rating}
                    </Text>
                  </HStack>
                )}
              </HStack>

              <HStack spacing={2}>
                <Box as={MapPin} w={4} h={4} color="gray.600" />
                <Text color="gray.700" fontSize="md" fontWeight="500">
                  {job?.location ?? 'Location Not Specified'}
                </Text>
              </HStack>

              <HStack
                bg="green.50"
                px={4}
                py={2}
                borderRadius="md"
                borderWidth="1px"
                borderColor="green.200"
              >
                <Box as={IndianRupee} w={5} h={5} color="green.600" />
                <Text color="green.700" fontWeight="700" fontSize="lg">
                  {job?.salary ?? 'Salary Not Disclosed'}
                </Text>
              </HStack>
            </VStack>

            <HStack spacing={2}>
              <IconButton
                aria-label="Bookmark"
                icon={<Bookmark size={20} />}
                bg="white"
                _hover={{ bg: "blue.50", color: "blue.600" }}
                shadow="sm"
                borderRadius="full"
                color="gray.600"
              />
              <IconButton
                aria-label="Share"
                icon={<Share2 size={20} />}
                bg="white"
                _hover={{ bg: "blue.50", color: "blue.600" }}
                shadow="sm"
                borderRadius="full"
                color="gray.600"
              />
            </HStack>
          </HStack>

          <Button
            bg="blue.600"
            _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            color="white"
            px={8}
            py={6}
            fontSize="md"
            fontWeight="600"
            borderRadius="lg"
            shadow="md"
            transition="all 0.2s"
            onClick={handleApplyNow}
          >
            Apply Now
          </Button>
        </Box>

        {/* Job Details */}
        <Box p={8}>
          <Heading as="h2" size="md" color="gray.800" mb={5}>
            Job Details
          </Heading>

          <HStack spacing={8} flexWrap="wrap">
            <HStack
              spacing={3}
              bg="gray.50"
              px={5}
              py={4}
              borderRadius="lg"
              flex="1"
              minW="200px"
            >
              <Box as={IndianRupee} w={6} h={6} color="blue.500" />
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">Pay</Text>
                <Text fontWeight="600" color="gray.800" fontSize="md">{job?.salary ?? 'Not Disclosed'}</Text>
              </Box>
            </HStack>

            <HStack
              spacing={3}
              bg="gray.50"
              px={5}
              py={4}
              borderRadius="lg"
              flex="1"
              minW="200px"
            >
              <Box as={Briefcase} w={6} h={6} color="purple.500" />
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">Job Type</Text>
                <Badge colorScheme="purple" fontSize="sm" px={2} py={1} borderRadius="md">
                  {job?.jobType ?? 'Not specified'}
                </Badge>
              </Box>
            </HStack>
          </HStack>
        </Box>

        <Divider />

        {/* Benefits */}
        {(() => {
          // Normalize benefits into an array (handles string, array, or missing)
          const benefits = Array.isArray(job?.benefits)
            ? job.benefits
            : typeof job?.benefits === 'string'
            ? job.benefits.split(',').map(b => b.trim()).filter(Boolean)
            : [];

          return benefits.length > 0 ? (
          <Box p={8}>
            <Heading as="h2" size="md" color="gray.800" mb={2}>
              Benefits & Perks
            </Heading>
            <Text color="gray.500" fontSize="sm" mb={5}>
              What you'll receive as part of this role
            </Text>
            <VStack spacing={3} align="start">
              {benefits.map((benefit, idx) => (
                <HStack key={idx} spacing={3}>
                  <Box as={CheckCircle} w={5} h={5} color="green.500" />
                  <Text color="gray.700" fontSize="md">{benefit}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
          ) : null;
        })()}

        <Divider />

        {/* Full Job Description */}
        {job?.description && (
          <Box p={8}>
            <Heading as="h2" size="md" color="gray.800" mb={5}>
              About This Role
            </Heading>
            <Text lineHeight="tall" color="gray.700" fontSize="md">{job.description}</Text>
          </Box>
        )}
      </Box>

      {/* Custom Modal */}
      {showCustomModal && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.700"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          backdropFilter="blur(4px)"
        >
          <Box
            bg="white"
            borderRadius="20px"
            boxShadow="2xl"
            w="90%"
            maxW="520px"
            p={8}
            position="relative"
          >
            <IconButton
              aria-label="Close"
              icon={<X size={20} />}
              position="absolute"
              top={4}
              right={4}
              size="sm"
              variant="ghost"
              borderRadius="full"
              _hover={{ bg: "gray.100" }}
              onClick={closeModal}
            />

            <VStack spacing={4} mb={6}>
              <Box
                bg="blue.50"
                p={4}
                borderRadius="full"
                mb={2}
              >
                <Box as={Star} w={8} h={8} color="blue.500" />
              </Box>

              <Heading size="lg" color="gray.800" textAlign="center">
                AI Interview Available
              </Heading>

              <Text color="gray.600" textAlign="center" fontSize="md" lineHeight="tall">
                This position offers an AI-powered interview experience.
                Would you like to showcase your skills through our AI Interview?
              </Text>
            </VStack>

            <VStack spacing={3}>
              <Button
                colorScheme="blue"
                w="full"
                py={6}
                fontSize="md"
                fontWeight="600"
                borderRadius="xl"
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
                onClick={handleAiInterviewConfirm}
              >
                Start AI Interview
              </Button>
              <Button
                variant="outline"
                w="full"
                py={6}
                fontSize="md"
                fontWeight="600"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ bg: "gray.50" }}
                onClick={handleStandardApply}
              >
                Continue Browsing
              </Button>
            </VStack>

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
              The AI Interview helps employers understand your unique qualifications better.
            </Text>
          </Box>
        </Box>
      )}
    </>
  )
}