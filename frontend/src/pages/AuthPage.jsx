

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
  useToast,
} from "@chakra-ui/react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = isLogin
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/signup";

      const payload = isLogin
        ? {
          email: formData.email,
          password: formData.password,
        }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast({
        title: isLogin ? "Login successful!" : "Signup successful!",
        description: JSON.stringify(data),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Example: save token in localStorage
      if (data.token) {
        localStorage.setItem("aijob", data.token);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" px={4}>
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
            <Input
              name="email"
              placeholder="Email"
              type="email"
              bg="gray.100"
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              bg="gray.100"
              onChange={handleChange}
            />
            <Button
              colorScheme="blue"
              w="full"
              onClick={handleSubmit}
              isLoading={loading}
            >
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
            <Input
              name="name"
              placeholder="Full Name"
              bg="gray.100"
              onChange={handleChange}
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              bg="gray.100"
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              bg="gray.100"
              onChange={handleChange}
            />
            <Input
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              bg="gray.100"
              onChange={handleChange}
            />
            <Button
              colorScheme="blue"
              w="full"
              onClick={handleSubmit}
              isLoading={loading}
            >
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

