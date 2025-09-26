"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup

  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      align="center"
      justify="center"
      px={4}
    >
      <Box
        bg="white"
        p={10}
        rounded="lg"
        shadow="lg"
        w={{ base: "full", md: "md" }}
      >
        {/* Toggle Login / Signup */}
        <HStack justify="center" mb={6}>
          <Button
            variant={isLogin ? "solid" : "ghost"}
            colorScheme="blue"
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "solid" : "ghost"}
            colorScheme="blue"
            onClick={() => setIsLogin(false)}
          >
            Signup
          </Button>
        </HStack>

        <Divider mb={6} />

        {isLogin ? (
          // Login Form
          <VStack spacing={4} align="stretch">
            <Input placeholder="Email" type="email" bg="gray.100" />
            <Input placeholder="Password" type="password" bg="gray.100" />
            <Button colorScheme="blue" w="full">
              Login
            </Button>
            <Text fontSize="sm" textAlign="center">
              Don't have an account?{" "}
              <Link color="blue.500" onClick={() => setIsLogin(false)}>
                Signup
              </Link>
            </Text>
          </VStack>
        ) : (
          // Signup Form
          <VStack spacing={4} align="stretch">
            <Input placeholder="Full Name" bg="gray.100" />
            <Input placeholder="Email" type="email" bg="gray.100" />
            <Input placeholder="Password" type="password" bg="gray.100" />
            <Input placeholder="Confirm Password" type="password" bg="gray.100" />
            <Button colorScheme="blue" w="full">
              Signup
            </Button>
            <Text fontSize="sm" textAlign="center">
              Already have an account?{" "}
              <Link color="blue.500" onClick={() => setIsLogin(true)}>
                Login
              </Link>
            </Text>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
