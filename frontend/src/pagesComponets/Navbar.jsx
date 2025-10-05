import { Box, Flex, HStack, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
    return (
        <Box as="header" borderBottom="1px" borderColor="gray.200" bg="white">
            <Flex
                mx="auto"
                px={{ base: 4, md: 6, lg: 8 }}
                h="16"
                align="center"
                justify="space-between"
            >
                {/* Logo and Navigation */}
                <HStack spacing={8}>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600" as={RouterLink}
                        to="/">
                        TakeJob
                    </Text>

                    <HStack
                        as="nav"
                        spacing={8}
                        display={{ base: "none", md: "flex" }}
                    >
                        <Box
                            as={RouterLink}
                            to="/"
                            color="gray.700"
                            pb={1}
                            _hover={{
                                textDecoration: "none",
                                color: "blue.500",
                                borderBottom: "2px",
                                borderColor: "blue.600",
                            }}
                            _focus={{ boxShadow: "none" }}
                        >
                            Home
                        </Box>
                        <Box
                            as={RouterLink}
                            to="/applications"
                            color="gray.700"
                            pb={1}
                            _hover={{
                                textDecoration: "none",
                                color: "blue.500",
                                borderBottom: "2px",
                                borderColor: "blue.600",
                            }}
                            _focus={{ boxShadow: "none" }}
                        >
                            applications
                        </Box>
                        <Box
                            as={RouterLink}
                            to="/companyreviews"
                            color="gray.700"
                            pb={1}
                            _hover={{
                                textDecoration: "none",
                                color: "blue.500",
                                borderBottom: "2px",
                                borderColor: "blue.600",
                            }}
                            _focus={{ boxShadow: "none" }}
                        >
                            Company reviews
                        </Box>
                        <Box
                            as={RouterLink}
                            to="/jobpost"
                            color="gray.700"
                            pb={1}
                            _hover={{
                                textDecoration: "none",
                                color: "blue.500",
                                borderBottom: "2px",
                                borderColor: "blue.600",
                            }}
                            _focus={{ boxShadow: "none" }}
                        >
                            jobpost
                        </Box>

                        <Box
                            as={RouterLink}
                            to="/salaryguide"
                            color="gray.700"
                            pb={1}
                            _hover={{
                                textDecoration: "none",
                                color: "blue.500",
                                borderBottom: "2px",
                                borderColor: "blue.600",
                            }}
                            _focus={{ boxShadow: "none" }}
                        >
                            Salary guide
                        </Box>
                    </HStack>
                </HStack>

                {/* Right buttons */}
                <HStack spacing={4}>
                    <Button
                        as={RouterLink}
                        to="/Auth"
                        variant="ghost"
                        colorScheme="blue"
                        _focus={{ boxShadow: "none" }}
                    >
                        Sign in
                    </Button>
                    <Button
                        as={RouterLink}
                        to="/employers"
                        variant="outline"
                        borderColor="blue.600"
                        color="blue.600"
                        bg="transparent"
                        _hover={{ bg: "blue.50" }}
                        _focus={{ boxShadow: "none" }}
                    >
                        Employers / Post Job
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}
