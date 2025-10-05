import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Container,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/react";

// Import Pages
import { Application } from "./Application";
import { ApplicationResponse } from "./ApplicationResponse";

export const Applications = () => {
  return (
    
      <Box bg="gray.50" minH="100vh">
        {/* Navigation Bar */}
        <Flex
          bg="blue.600"
          color="white"
          px={6}
          py={4}
          justify="space-between"
          align="center"
          shadow="sm"
        >
          <Heading fontSize="xl">Job Portal</Heading>

          <HStack spacing={4}>
            <Button as={Link} to="/applications" colorScheme="whiteAlpha" variant="ghost">
              Applications
            </Button>
            <Button
              as={Link}
              to="/applications/selected"
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              Selected
            </Button>
          </HStack>
        </Flex>

        {/* Page Routes */}
        <Container maxW="container.lg" py={10}>
          <Routes>
            <Route
              path="/applications"
              element={
                <VStack spacing={6} align="stretch">
                  <Box shadow="md" border="1px" borderColor="gray.200">
                    <Box>
                      <Stack spacing={3}>
                        <Heading size="md">Applications</Heading>
                        <Text color="gray.600">
                          View all the applications you have submitted here.
                        </Text>
                      </Stack>
                    </Box>
                  </Box>
                  <Application />
                </VStack>
              }
            />
            <Route
              path="/applications/selected"
              element={
                <VStack spacing={6} align="stretch">
                  <Box shadow="md" border="1px" borderColor="gray.200">
                    <Box>
                      <Stack spacing={3}>
                        <Heading size="md">Selected Applications</Heading>
                        <Text color="gray.600">
                          Review the applications that have been shortlisted.
                        </Text>
                      </Stack>
                    </Box>
                  </Box>
                  <ApplicationResponse />
                </VStack>
              }
            />
          </Routes>
        </Container>
      </Box>
    
  );
};