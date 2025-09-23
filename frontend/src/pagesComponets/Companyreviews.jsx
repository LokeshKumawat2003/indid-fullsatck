import React from "react";
import {
  Box as ChakraBox,
  Button as ChakraButton,
  Heading as ChakraHeading,
  Text as ChakraText,
  VStack as ChakraVStack,
  HStack as ChakraHStack,
  Input as ChakraInput,
  Grid as ChakraGrid,
  Center as ChakraCenter,
  IconButton as ChakraIconButton,
} from "@chakra-ui/react";
import { FaSearch, FaStar } from "react-icons/fa";

export default function Companyreviews() {
  const companies = [
    { name: "KPMG", logo: "KPMG", rating: 4.2, reviews: 9618, color: "blue.600" },
    { name: "Indeed", logo: "i", rating: 3.8, reviews: 1714, color: "gray.800" },
    { name: "Infosys", logo: "infosys", rating: 4.1, reviews: 16646, color: "teal.600" },
    { name: "Adani Group", logo: "adani", rating: 3.9, reviews: 445, color: "orange.600" },
    { name: "Bajaj Finance", logo: "BF", rating: 3.7, reviews: 801, color: "indigo.600" },
    { name: "EY", logo: "EY", rating: 4.3, reviews: 10506, color: "yellow.500" },
    { name: "WNS Global Services", logo: "WNS", rating: 3.6, reviews: 3081, color: "gray.700" },
    { name: "Rapido Bike Taxi", logo: "R", rating: 4.0, reviews: 32, color: "green.600" },
    { name: "TRANZ INDIA", logo: "TI", rating: 3.5, reviews: 9, color: "red.600" },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="gold" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} color="gold" opacity={0.5} />);
      } else {
        stars.push(<FaStar key={i} color="gray" />);
      }
    }
    return stars;
  };

  return (
    <ChakraBox bg="gray.50" minH="100vh" py={12}>
      <ChakraBox maxW="4xl" mx="auto" px={4}>
        {/* Search Section */}
        <ChakraVStack spacing={4} mb={16} textAlign="center">
          <ChakraHeading size="2xl">Find great places to work</ChakraHeading>
          <ChakraText fontSize="lg" color="gray.600">
            Get access to millions of company reviews
          </ChakraText>

          <ChakraHStack w="full" maxW="2xl">
            <ChakraBox flex={1} position="relative">
              <ChakraInput
                placeholder="Company name or job title"
                h={12}
                pr={12}
                borderWidth={2}
                borderColor="gray.300"
                focusBorderColor="blue.500"
              />
              <FaSearch
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
                size={20}
                color="gray"
              />
            </ChakraBox>
            <ChakraButton colorScheme="blue" px={8} h={12}>
              Find Companies
            </ChakraButton>
          </ChakraHStack>

          <ChakraText as="a" href="#" color="blue.600" fontSize="sm" textDecoration="underline">
            Do you want to search for salaries?
          </ChakraText>
        </ChakraVStack>

        {/* Popular Companies Section */}
        <ChakraBox mb={16}>
          <ChakraHeading size="lg" mb={8}>
            Popular companies
          </ChakraHeading>
          <ChakraGrid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {companies.map((company, idx) => (
              <ChakraBox
                key={idx}
                p={6}
                borderWidth={1}
                borderRadius="md"
                borderColor="gray.200"
                bg="white"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
              >
                <ChakraHStack align="start" mb={4} spacing={4}>
                  <ChakraCenter w={12} h={12} bg={company.color} rounded="md" color="white" fontWeight="bold">
                    {company.logo}
                  </ChakraCenter>
                  <ChakraBox flex={1}>
                    <ChakraHeading size="md" mb={1}>
                      {company.name}
                    </ChakraHeading>
                    <ChakraHStack spacing={2} mb={1}>
                      <ChakraHStack spacing={1}>{renderStars(company.rating)}</ChakraHStack>
                      <ChakraText fontSize="sm" color="blue.600" fontWeight="medium">
                        {company.rating}
                      </ChakraText>
                      <ChakraText fontSize="sm" color="gray.500">
                        {company.reviews.toLocaleString()} reviews
                      </ChakraText>
                    </ChakraHStack>
                  </ChakraBox>
                </ChakraHStack>

                <ChakraHStack spacing={2}>
                  <ChakraButton size="sm" flex={1} variant="outline">
                    Salaries
                  </ChakraButton>
                  <ChakraButton size="sm" flex={1} variant="outline">
                    Questions
                  </ChakraButton>
                  <ChakraButton size="sm" flex={1} variant="outline">
                    Open jobs
                  </ChakraButton>
                </ChakraHStack>
              </ChakraBox>
            ))}
          </ChakraGrid>
        </ChakraBox>

        {/* Employer Rating Section */}
        <ChakraCenter>
          <ChakraBox
            p={8}
            maxW="md"
            w="full"
            textAlign="center"
            bgGradient="linear(to-br, teal.50, blue.50)"
            borderWidth={1}
            borderRadius="md"
            borderColor="teal.200"
          >
            <ChakraCenter w={16} h={16} mb={4} bg="teal.100" rounded="full" mx="auto">
              <ChakraText fontSize="2xl">💼</ChakraText>
            </ChakraCenter>

            <ChakraHeading size="md" mb={4}>
              Rate your recent employer:
            </ChakraHeading>

            <ChakraHStack justify="center" spacing={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <ChakraIconButton
                  key={star}
                  aria-label={`Rate ${star} star`}
                  icon={<FaStar />}
                  variant="ghost"
                  color="gray.300"
                  _hover={{ color: "yellow.400" }}
                  fontSize="2xl"
                />
              ))}
            </ChakraHStack>
          </ChakraBox>
        </ChakraCenter>
      </ChakraBox>
    </ChakraBox>
  );
}
