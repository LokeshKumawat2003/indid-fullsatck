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
  Heading,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { appRequest } from "../Routes/backendRutes";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

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
      console.log("Frontend Payload:", payload);
      const response = await appRequest("auth", isLogin ? "login" : "signup", payload);

      const data = response;

      if (!response) {
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
        localStorage.setItem("auth-token", data.token);
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
        p={{ base: 8, md: 10 }}
        rounded="2xl"
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
        w={{ base: "full", md: "md" }}
        maxW="md"
      >
        {/* Header */}
        <VStack spacing={2} mb={8}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {isLogin 
              ? "Enter your credentials to access your account" 
              : "Sign up to get started with your journey"}
          </Text>
        </VStack>

        {/* Toggle Login / Signup */}
        <Flex 
          mb={6} 
          p={1} 
          bg="gray.100" 
          rounded="xl"
          gap={1}
        >
          <Button
            flex="1"
            variant={isLogin ? "solid" : "ghost"}
            colorScheme={isLogin ? "blue" : "gray"}
            bg={isLogin ? "blue.500" : "transparent"}
            color={isLogin ? "white" : "gray.600"}
            onClick={() => setIsLogin(true)}
            _hover={{ bg: isLogin ? "blue.600" : "gray.200" }}
            _focus={{ boxShadow: "none" }}
            rounded="lg"
            fontWeight="medium"
          >
            Login
          </Button>
          <Button
            flex="1"
            variant={!isLogin ? "solid" : "ghost"}
            colorScheme={!isLogin ? "blue" : "gray"}
            bg={!isLogin ? "blue.500" : "transparent"}
            color={!isLogin ? "white" : "gray.600"}
            onClick={() => setIsLogin(false)}
            _hover={{ bg: !isLogin ? "blue.600" : "gray.200" }}
            _focus={{ boxShadow: "none" }}
            rounded="lg"
            fontWeight="medium"
          >
            Signup
          </Button>
        </Flex>

        {isLogin ? (
          // Login Form
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Email
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Password
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLock} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    _focus={{ boxShadow: "none" }}
                    aria-label="Toggle password visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            <Button
              colorScheme="blue"
              w="full"
              onClick={handleSubmit}
              isLoading={loading}
              size="lg"
              rounded="lg"
              _focus={{ boxShadow: "none" }}
              mt={2}
            >
              Login
            </Button>

            <Text fontSize="sm" textAlign="center" color="gray.600" pt={2}>
              Don't have an account?{" "}
              <Link 
                color="blue.500" 
                fontWeight="medium"
                onClick={() => setIsLogin(false)}
                _hover={{ color: "blue.600" }}
              >
                Sign up
              </Link>
            </Text>
          </VStack>
        ) : (
          // Signup Form
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Full Name
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Email
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Password
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLock} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    _focus={{ boxShadow: "none" }}
                    aria-label="Toggle password visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Confirm Password
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLock} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={<Icon as={showConfirmPassword ? FiEyeOff : FiEye} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    _focus={{ boxShadow: "none" }}
                    aria-label="Toggle password visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            <Button
              colorScheme="blue"
              w="full"
              onClick={handleSubmit}
              isLoading={loading}
              size="lg"
              rounded="lg"
              _focus={{ boxShadow: "none" }}
              mt={2}
            >
              Create Account
            </Button>

            <Text fontSize="sm" textAlign="center" color="gray.600" pt={2}>
              Already have an account?{" "}
              <Link 
                color="blue.500" 
                fontWeight="medium"
                onClick={() => setIsLogin(true)}
                _hover={{ color: "blue.600" }}
              >
                Login
              </Link>
            </Text>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}