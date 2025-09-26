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
} from "@chakra-ui/react"
import {
  Bookmark,
  Share2,
  MapPin,
  Briefcase,
  IndianRupee,
  Star,
  X
} from "lucide-react";
import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function JobDetail({ job }) {
  const [showCustomModal, setShowCustomModal] = useState(false);
const navigate = useNavigate()
  const handleApplyNow = () => setShowCustomModal(true);
  const closeModal = () => setShowCustomModal(false);

  const handleAiInterviewConfirm = () => {
  navigate("/ai")
    closeModal();
  };

  const handleStandardApply = () => {
    console.log("Submitting standard application");
    closeModal();
  };

  return (
    <>
      <Box width="5xl" mx="auto" bg="white" border="1px" borderColor="gray.300" shadow="sm" h={"80vh"} overflow={"auto"}>
        {/* Header Section */}
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Heading as="h1" size="xl" color="gray.900" mb={2}>
            {job?.title ?? 'Job Title Not Available'}
          </Heading>

          <HStack spacing={2} mb={1}>
            <Link color="blue.600" fontWeight="medium" textDecoration="underline" cursor="pointer">
              {job?.company ?? 'Company Not Specified'}
            </Link>
            {job?.rating && (
              <HStack spacing={1}>
                <Text fontSize="sm" color="gray.600">
                  {job.rating}
                </Text>
                <Box as={Star} w={4} h={4} fill="yellow.400" color="yellow.400" />
              </HStack>
            )}
          </HStack>

          <Text color="gray.600" mb={4}>
            {job?.location ?? 'Location Not Specified'}
          </Text>

          <Text color="gray.900" fontWeight="medium" mb={4}>
            {job?.salary ?? 'Salary Not Disclosed'}
          </Text>

          <HStack spacing={3}>
            <Button 
              bg="blue.600" 
              _hover={{ bg: "blue.700" }} 
              color="white" 
              px={6} 
              py={2}
              onClick={handleApplyNow}
            >
              Apply now
            </Button>
            <IconButton
              aria-label="Bookmark"
              icon={<Bookmark size={20} />}
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              border="1px"
              borderColor="gray.300"
              color="gray.600"
            />
            <IconButton
              aria-label="Share"
              icon={<Share2 size={20} />}
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              border="1px"
              borderColor="gray.300"
              color="gray.600"
            />
          </HStack>
        </Box>

        {/* Job Details */}
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Heading as="h2" size="lg" color="gray.900" mb={4}>
            Job details
          </Heading>

          <VStack spacing={4} align="start">
            <HStack spacing={3} align="start">
              <Box as={IndianRupee} w={5} h={5} color="gray.500" mt={0.5} />
              <Box>
                <Text fontWeight="medium" color="gray.900">Pay</Text>
                <Text color="gray.600">{job?.salary ?? 'Salary Not Disclosed'}</Text>
              </Box>
            </HStack>

            <HStack spacing={3} align="start">
              <Box as={Briefcase} w={5} h={5} color="gray.500" mt={0.5} />
              <Box>
                <Text fontWeight="medium" color="gray.900">Job type</Text>
                <Text color="gray.600">
                  {job?.jobType?.length > 0 ? job.jobType.join(", ") : 'Not specified'}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Location */}
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Heading as="h2" size="lg" color="gray.900" mb={4}>Location</Heading>
          <HStack spacing={2}>
            <Box as={MapPin} w={5} h={5} color="gray.500" />
            <Text color="gray.700">{job?.location ?? 'Location Not Specified'}</Text>
          </HStack>
        </Box>

        {/* Benefits */}
        {job?.benefits?.length > 0 && (
          <Box p={6} borderBottom="1px" borderColor="gray.200">
            <Heading as="h2" size="lg" color="gray.900" mb={2}>
              Benefits
            </Heading>
            <Text color="gray.500" fontSize="sm" mb={4}>
              Pulled from the full job description
            </Text>
            <List styleType="disc" pl={4}>
              {job.benefits.map((benefit, idx) => (
                <ListItem key={idx} color="gray.700">{benefit}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Full Job Description */}
        {job?.description && (
          <Box p={6}>
            <Heading as="h2" size="lg" color="gray.900" mb={4}>
              Full job description
            </Heading>
            <Text lineHeight="relaxed" color="gray.700">{job.description}</Text>
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
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
        >
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="xl"
            w="90%"
            maxW="500px"
            p={6}
            position="relative"
          >
            {/* Close Button */}
            <IconButton
              aria-label="Close"
              icon={<X size={20} />}
              position="absolute"
              top={3}
              right={3}
              size="sm"
              variant="ghost"
              onClick={closeModal}
            />

            <Heading size="md" color="blue.600" mb={4} textAlign="center">
              AI Interview Opportunity
            </Heading>

            <Text color="gray.700" mb={6} textAlign="center">
              This job offers an AI-powered interview experience.
              Would you like to proceed with the AI Interview before submitting your application?
            </Text>

            <VStack spacing={3}>
              <Button
                colorScheme="blue"
                w="full"
                py={3}
                borderRadius="10px"
                onClick={handleAiInterviewConfirm}
              >
                Proceed to AI Interview
              </Button>
              <Button
                variant="outline"
                w="full"
                py={3}
                borderRadius="10px"
                onClick={handleStandardApply}
              >
             Continue with Job Search
              </Button>
            </VStack>

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
              Choose wisely. The AI Interview can provide additional insights into your candidacy.
            </Text>
          </Box>
        </Box>
      )}
    </>
  )
}
