import React from "react";
import { Box, Flex, Heading, Text, Avatar, Spacer, IconButton } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AdminRoutes } from "./Routes/AdminRoutes";

function AdminDeshBord() {
  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w={{ base: "60", md: "100" }}
        bg="white"
        boxShadow="md"
        p="0"
        position="sticky"
        top="0"
        h="100vh"
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Top Navbar */}
        <Flex
          as="header"
          bg="white"
          p="4"
          boxShadow="sm"
          align="center"
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Heading size="md" color="blue.600">
            Admin Dashboard
          </Heading>
          <Spacer />
          <Flex align="center" gap="3">
            <Text fontWeight="medium">Admin</Text>
            <Avatar size="sm" name="Admin User" />
            <IconButton
              icon={<FiLogOut />}
              aria-label="Logout"
              variant="ghost"
              colorScheme="red"
            />
          </Flex>
        </Flex>

        {/* Page Content */}
        <Box as="main" flex="1" p="6" overflowY="auto">
          {/* <Outlet /> */}
          <AdminRoutes/>
        </Box>
      </Flex>
    </Flex>
  );
}

export default AdminDeshBord;
