import { Box, Flex, HStack, Text, Button, Link } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Box as="header" borderBottom="1px" borderColor="gray.200" bg="white">
            <Flex
                // maxW="7xl"
                mx="auto"
                px={{ base: 4, md: 6, lg: 8 }}
                h="16"
                align="center"
                justify="space-between"
            >
                {/* Logo and Navigation */}
                <HStack spacing={8}>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        TakeJob
                    </Text>

                    <HStack
                        as="nav"
                        spacing={8}
                        display={{ base: "none", md: "flex" }}
                    >
                        <Link
                            href="#"
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
                        </Link>
                        <Link
                            href="#"
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
                        </Link>

                        <Link
                            href="#"
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
                        </Link>
                    </HStack>
                </HStack>

                {/* Right buttons */}
                <HStack spacing={4}>
                    <Button variant="ghost" colorScheme="blue" _focus={{ boxShadow: "none" }}>
                        Sign in
                    </Button>
                    <Button
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
