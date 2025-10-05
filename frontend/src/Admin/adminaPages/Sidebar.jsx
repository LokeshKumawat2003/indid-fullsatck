import React from "react";
import { VStack, Box, Heading, Link as ChakraLink, Flex, Icon, Divider, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPlusSquare, FiFileText, FiVideo, FiUsers, FiCheckCircle } from "react-icons/fi";

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { to: "/admin/JobsHome", label: "Dashboard", icon: FiHome },
        { to: "/admin/create-job-post", label: "Create Job Post", icon: FiPlusSquare },
        { to: "/admin/applications", label: "Applications", icon: FiFileText },

        { to: "/admin/StudentResponse", label: "Student Response", icon: FiUsers },
        { to: "/admin/interview", label: "Interview", icon: FiVideo },
        { to: "/admin/FinalRound", label: "Final Round", icon: FiCheckCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            w="full"
            h="100vh"
            bg="linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)"
            borderRight="1px"
            borderColor="gray.100"
            p="0"
        >
            {/* Sidebar Header */}
            <Box mb="8" p="4">
                <Heading
                    size="xl"
                    mb="1"
                    color="gray.800"
                    fontSize="1.4rem"
                    letterSpacing="tight"
                >
                    Admin
                </Heading>
                <Text fontSize="1rem" color="gray.500" >
                    Management Panel
                </Text>
            </Box>

            <Divider borderColor="gray.200" mb="6" />

            {/* Sidebar Links */}
            <VStack spacing={1.5} align="stretch">
                {links.map((link, i) => (
                    <ChakraLink
                        as={Link}
                        to={link.to}
                        key={i}
                        _hover={{
                            textDecor: "none",
                            bg: isActive(link.to) ? "blue.500" : "gray.50",
                            transform: "translateX(2px)",
                        }}
                        _focus={{
                            boxShadow: "none",
                            outline: "none"
                        }}
                        _active={{
                            transform: "scale(0.98)"
                        }}
                        px="4"
                        py="3.5"
                        borderRadius="xl"
                        fontWeight="500"
                        fontSize="15px"
                        color={isActive(link.to) ? "white" : "gray.700"}
                        bg={isActive(link.to) ? "blue.500" : "transparent"}
                        transition="all 0.2s ease"
                        position="relative"
                        overflow="hidden"
                    >
                        <Flex align="center" gap="3">
                            <Icon
                                as={link.icon}
                                boxSize={5}
                                color={isActive(link.to) ? "white" : "gray.500"}
                            />
                            <Text>{link.label}</Text>
                        </Flex>
                    </ChakraLink>
                ))}
            </VStack>
        </Box>
    );
};

export default Sidebar;