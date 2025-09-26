"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  SimpleGrid,
  Link,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

export default function MyJobs() {
  const [jobsSaved, setJobsSaved] = useState([]); // empty saved jobs

  const tabs = [
    { label: "Saved", count: jobsSaved.length },
    { label: "Applied", count: 1 },
    { label: "Interviews", count: 0 },
    { label: "Archived", count: 0 },
  ];

  return (
    <Box bg="gray.50" minH="100vh" px={{ base: 4, md: 8 }}>
      {/* Header */}
      <Text fontSize="2xl" fontWeight="bold" mt={8}>
        My jobs
      </Text>

      {/* Tabs */}
      <Tabs variant="unstyled" mt={4}>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
              }}
              _focus={{ boxShadow: "none" }}
              _hover={{ color: "blue.400" }}
              mr={4}
              pb={2}
            >
              <Flex direction="column" align="center">
                <Text fontWeight="bold">{tab.count}</Text>
                <Text fontSize="sm">{tab.label}</Text>
              </Flex>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={index} py={10}>
              {tab.label === "Saved" && jobsSaved.length === 0 ? (
                <VStack spacing={4} mt={8}>
                  <Image
                    src="/mnt/data/37d88953-2fa7-4a79-8d4d-aed57da9f3d0.png"
                    alt="No jobs saved"
                    boxSize="150px"
                  />
                  <Text fontWeight="bold">No jobs saved yet</Text>
                  <Text color="gray.600">Jobs you save appear here.</Text>
                  <Link color="blue.600">Having an issue with My jobs? Tell us more</Link>
                  <Link color="blue.600">Not seeing a job?</Link>
                  <Button colorScheme="blue">Find jobs →</Button>
                </VStack>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {jobsSaved.map((job, idx) => (
                    <Box key={idx} bg="white" p={4} rounded="md" shadow="sm">
                      <Text fontWeight="bold">{job.title}</Text>
                      <Text fontSize="sm">{job.company}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Footer */}
      <Flex wrap="wrap" justify="center" mt={16} mb={8} fontSize="sm" color="gray.600">
        {[
          "Career advice",
          "Browse jobs",
          "Browse companies",
          "Salaries",
          "Indeed Events",
          "Work at Indeed",
          "Countries",
          "About",
          "Help",
          "ESG at Indeed",
          "Guidelines for safe job search",
        ].map((link, i) => (
          <Link key={i} mx={2} my={1}>
            {link}
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
