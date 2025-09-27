"use client"

import React, { useState } from "react"
import {
  Box,
  Container,
  Flex,
  Input,
  Button,
  Text,
  Heading,
  VStack,
  HStack,
  InputGroup,
  InputLeftElement,
  Image,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

// Import only named exports correctly from react-icons
import { FiSearch, FiMapPin, FiArrowRight, FiFileText, FiTrendingUp, FiBriefcase, FiDollarSign, FiTarget } from "react-icons/fi"
import { FaHandPaper, FaBuilding } from "react-icons/fa"
import { MdHealthAndSafety } from "react-icons/md"
import { HiChartBar } from "react-icons/hi"
import { AiOutlineBgColors } from "react-icons/ai"

export default function Home() {
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  // State for job search inputs
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  // Hooks
  const navigate = useNavigate()
  const toast = useToast()

  // Handle Get Started button click
  const handleGetStarted = () => {
    // Validate inputs
    if (!jobTitle.trim() || !location.trim()) {
      toast({
        title: "Input Required",
        description: "Please fill in both job title and location.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      return
    }

    // Navigate to JobPost page with input values
    navigate("/jobpost", {
      state: {
        jobTitle,
        location
      }
    })
  }
  const handlemovejob = () => {
    navigate("/jobpost")
  }
  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header Search Section */}
      <Box bg={cardBg} py={8} borderBottom="1px" borderColor={borderColor}>
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            gap={4}
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="lg"
            border="1px"
            borderColor="gray.200"
          >
            <InputGroup flex={2} maxW="400px">
              <InputLeftElement pointerEvents="none" top="5px">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Job title, keywords, or company"
                size="lg"
                bg="white"
                border="1px"
                borderColor="gray.300"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              />
            </InputGroup>

            <InputGroup flex={1} maxW="300px">
              <InputLeftElement pointerEvents="none" top="5px">
                <FiMapPin color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Delhi"
                size="lg"
                bg="white"
                border="1px"
                borderColor="gray.300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              />
            </InputGroup>

            <Button colorScheme="blue" size="lg" px={8} onClick={handleGetStarted} rightIcon={<FiSearch />}>
              Find jobs
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Container maxW="6xl" py={12}>
        <VStack spacing={8} align="center" textAlign="center">
          {/* Hero Illustration */}
          <Box position="relative" w="full" maxW="600px" h="300px">
            <Image
              src="/homeimg.jpg"
              alt="Diverse professionals collaborating"
              w="full"
              h="full"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>

          {/* Welcome Section */}
          <VStack spacing={4} maxW="2xl">
            <Heading as="h1" size="2xl" fontWeight="bold" color="gray.800" textAlign="center">
              <HStack justify="center" align="center">
                <Text>Welcome to TakeJob!</Text>
                <FaHandPaper color="#3182ce" />
              </HStack>
            </Heading>

            <Text fontSize="lg" color="gray.600" textAlign="center" lineHeight="tall">
              Create an account or sign in to see your personalised job recommendations.
            </Text>

            <Button
              colorScheme="blue"
              size="lg"
              px={8}
              py={6}
              fontSize="lg"
              rightIcon={<FiArrowRight />}
              mt={4}
              onClick={handlemovejob}
            >
              Get Started
            </Button>
          </VStack>

          {/* Resume Upload Section */}
          <Box pt={8}>
            <Link href="#" color="blue.500" fontSize="lg" textDecoration="underline" _hover={{ color: "blue.600" }}>
              <HStack justify="center" align="center">
                <FiFileText />
                <Text>Post your resume - It only takes a few seconds</Text>
              </HStack>
            </Link>
          </Box>

          {/* Trending Section */}
          <Box w="full" maxW="2xl" pt={8}>
            <Accordion allowToggle>
              <AccordionItem border="1px" borderColor={borderColor} borderRadius="md">
                <AccordionButton py={4} _hover={{ bg: "gray.50" }} justifyContent="space-between">
                  <HStack>
                    <FiTrendingUp color="#3182ce" />
                    <Text fontSize="lg" fontWeight="medium">
                      What's trending on Indeed
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="start" spacing={3}>
                    <Link href="#" color="blue.500" _hover={{ color: "blue.600" }}>
                      <HStack>
                        <FiBriefcase />
                        <Text>Remote Software Developer Jobs</Text>
                      </HStack>
                    </Link>
                    <Link href="#" color="blue.500" _hover={{ color: "blue.600" }}>
                      <HStack>
                        <MdHealthAndSafety />
                        <Text>Healthcare Jobs in Delhi</Text>
                      </HStack>
                    </Link>
                    <Link href="#" color="blue.500" _hover={{ color: "blue.600" }}>
                      <HStack>
                        <HiChartBar />
                        <Text>Data Analyst Positions</Text>
                      </HStack>
                    </Link>
                    <Link href="#" color="blue.500" _hover={{ color: "blue.600" }}>
                      <HStack>
                        <AiOutlineBgColors />
                        <Text>UI/UX Designer Roles</Text>
                      </HStack>
                    </Link>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>


        </VStack>
      </Container>
    </Box>
  )
}
