import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Avatar,
  Divider,
  Stack,
} from "@chakra-ui/react";

export const ApplicationResponse = () => {
  // Example selected applications
  const selectedApps = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Google",
      location: "Bangalore, India",
      date: "Oct 1, 2025",
      stage: "Final Round Cleared",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Adobe",
      location: "Remote",
      date: "Sept 28, 2025",
      stage: "Offer Letter Sent",
    },
  ];

  return (
    <Box bg="gray.50" minH="100vh" p={6}>
      {/* Page Title */}
      <Heading mb={6} color="green.600" fontSize="2xl">
        🎉 Selected Applications
      </Heading>

      <VStack spacing={5} align="stretch">
        {selectedApps.map((job) => (
          <Box
            key={job.id}
            p={5}
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            shadow="md"
            _hover={{ shadow: "lg" }}
          >
            <HStack justify="space-between" align="start">
              <Stack direction="row" spacing={4}>
                <Avatar name={job.company} />
                <Box>
                  <Heading fontSize="lg" color="green.700">
                    {job.title}
                  </Heading>
                  <Text fontWeight="medium">{job.company}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {job.location}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Selected on {job.date}
                  </Text>
                </Box>
              </Stack>

              <Badge
                fontSize="0.8em"
                colorScheme="green"
                px={3}
                py={1}
                borderRadius="md"
              >
                {job.stage}
              </Badge>
            </HStack>

            <Divider my={4} />

            <HStack justify="flex-end">
              <Button size="sm" colorScheme="green">
                View Offer
              </Button>
              <Button size="sm" colorScheme="blue" variant="outline">
                Contact HR
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
