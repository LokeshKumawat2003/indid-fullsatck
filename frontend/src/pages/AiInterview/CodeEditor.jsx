import React, { useState } from 'react';
import {
  Box,
  Textarea,
  Flex,
  Heading,
  HStack,
  Button,
  useColorModeValue,
  Text,
  VStack,
  Divider,
  Spinner, // Import Spinner
} from '@chakra-ui/react';
import { FaCode } from 'react-icons/fa';

const CodeEditor = () => {
  const [code, setCode] = useState(
`function isPalindrome(str) {
  let i = 0, j = str.length - 1;
  while (i < j) {
    if (str[i] !== str[j]) return false;
    i++; j--;
  }
  return true;
}

console.log(isPalindrome("madam"));`
  );
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const runCode = async () => {
    setIsLoading(true); // Set loading to true before API call
    try {
      const res = await fetch("http://localhost:5000/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: code }), // ✅ match backend
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.output); // raw AI output
      } else {
        setOutput("Error: " + (data.error || "Unknown error occurred."));
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setIsLoading(false); // Set loading to false after API call completes (success or error)
    }
  };

  return (
    <VStack spacing={4} w="full">
      {/* Code editor box */}
      <Box
        w="full"
        p={4}
        bg={cardBg}
        borderRadius="md"
        border={`1px solid ${borderColor}`}
        boxShadow="sm"
      >
        <Flex align="center" mb={2}>
          <FaCode size={20} />
          <Heading size="md" ml={2}>
            DSA Code Editor (JS Only)
          </Heading>
        </Flex>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          minH="200px"
          fontFamily="monospace"
          fontSize="sm"
          borderColor={borderColor}
          resize="vertical"
        />
        <HStack mt={2} justify="flex-end">
          <Button colorScheme="blue" onClick={runCode}>
            Run Code
          </Button>
        </HStack>
      </Box>

      {/* Output box */}
      <Box
        w="full"
        p={4}
        bg={cardBg}
        borderRadius="md"
        border={`1px solid ${borderColor}`}
        boxShadow="sm"
      >
        <Heading size="sm" mb={2}>
          Output:
        </Heading>
        <Divider mb={2} />
        {isLoading ? (
          <Flex justify="center" align="center" minH="100px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Text fontFamily="monospace" whiteSpace="pre-wrap">
            {output}
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default CodeEditor;
