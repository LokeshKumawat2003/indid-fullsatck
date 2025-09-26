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
} from '@chakra-ui/react';
import { FaCode } from 'react-icons/fa';

const CodeEditor = () => {
  const [code, setCode] = useState(
`// Example DSA code
function sum(a) {
  for (let i = 0; i < a; i++) {
    if (i === 3) {
      console.log("Found 3 at index:", i);
    }
  }
}
// Call the function
sum(5);`
  );
  const [output, setOutput] = useState('');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const runCode = () => {
    try {
      let result = '';
      // Override console.log to capture output
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        result += args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ') + '\n';
      };

      // eslint-disable-next-line no-eval
      eval(code); // Run JS code

      console.log = originalConsoleLog;
      setOutput(result || 'Code executed successfully, but no output.');
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  return (
    <VStack spacing={4} w="full">
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
        <Text fontFamily="monospace" whiteSpace="pre-wrap">
          {output}
        </Text>
      </Box>
    </VStack>
  );
};

export default CodeEditor;
