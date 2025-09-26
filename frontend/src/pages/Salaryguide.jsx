"use client";

import React from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Select,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";

const jobsData = [
  { title: "Software Engineer", salary: "₹8,39,091 per year" },
  { title: "Registered Nurse", salary: "₹2,15,150 per year" },
  { title: "Accountant", salary: "₹2,53,474 per year" },
  { title: "Business Analyst", salary: "₹8,28,268 per year" },
  { title: "Nursing Assistant", salary: "₹2,64,893 per year" },
  { title: "Sales Executive", salary: "₹2,47,302 per year" },
  { title: "Human Resources Specialist", salary: "₹2,81,964 per year" },
  { title: "Customer Service Representative", salary: "₹2,50,375 per year" },
  { title: "Assistant Store Manager", salary: "₹3,41,554 per year" },
  { title: "Elementary School Teacher", salary: "₹2,48,508 per year" },
  { title: "Customer Care Specialist", salary: "₹2,16,948 per year" },
  { title: "Office Assistant", salary: "₹1,98,057 per year" },
  { title: "Back Office Executive", salary: "₹4,50,181 per year" },
  { title: "Data Entry Clerk", salary: "₹2,90,958 per year" },
  { title: "Graphic Designer", salary: "₹2,50,913 per year" },
  { title: "Front Desk Manager", salary: "₹2,65,600 per year" },
];

export default function Salaryguide() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* Header Section */}
      <Box bg="blue.900" color="white" py={12} px={6}>
        <VStack spacing={4} maxW="3xl" mx="auto">
          <Text fontSize="2xl" fontWeight="bold">
            Discover your earning potential
          </Text>
          <Text fontSize="md" textAlign="center">
            Explore high-paying careers, salaries and job openings by industry
            and location.
          </Text>

          {/* Search Box */}
          <Flex w="full" maxW="2xl" mt={4}>
            <Input placeholder="Job title" bg="white" mr={2} />
            <Input placeholder="India" bg="white" mr={2} />
            <Button colorScheme="blue">Search</Button>
          </Flex>
        </VStack>
      </Box>

      {/* Industry Filter */}
      <Box maxW="6xl" mx="auto" mt={8} px={6}>
        <Text fontSize="lg" mb={2}>
          Browse top-paying jobs by industry
        </Text>
        <Select maxW="sm" mb={6} placeholder="All Industries">
          <option value="all">All Industries</option>
        </Select>

        {/* Jobs Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {jobsData.map((job, index) => (
            <Box
              key={index}
              bg="white"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              shadow="sm"
            >
              <Text fontWeight="bold">{job.title}</Text>
              <Text fontSize="sm" color="gray.600">
                Average salary {job.salary}
              </Text>
              <Link color="blue.600" fontSize="sm" mt={2} display="block">
                Job openings
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <Box mt={16} py={8} bg="black" color="white">
        <Text textAlign="center">© Indeed</Text>
      </Box>
    </Box>
  );
}
