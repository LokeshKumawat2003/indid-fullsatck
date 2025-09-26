import React, { useState } from 'react';
import { Box, Textarea, Flex, Heading, HStack, Select, Button, useColorModeValue, Text } from '@chakra-ui/react';
import { FaCode } from 'react-icons/fa';

const CodeEditor = ({ code, setCode, selectedLanguage, setSelectedLanguage }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const editorBg = useColorModeValue('gray.50', 'gray.900');

  const [output, setOutput] = useState('');
  const outputBg = useColorModeValue('gray.100', 'gray.700');

  // Run code safely (only JS for now)
  const runCode = () => {
    if (selectedLanguage !== 'javascript') {
      setOutput('Only JavaScript execution is supported currently.');
      return;
    }

    // Capture console.log outputs
    const originalConsoleLog = console.log;
    let capturedLogs = [];
    
    // Override console.log to capture outputs
    console.log = (...args) => {
      capturedLogs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalConsoleLog(...args); // Still log to browser console
    };

    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      
      // Combine console logs and return value
      let finalOutput = '';
      if (capturedLogs.length > 0) {
        finalOutput += capturedLogs.join('\n');
      }
      
      if (result !== undefined) {
        if (finalOutput) finalOutput += '\n\n';
        finalOutput += `Return value: ${result}`;
      }
      
      // If no console logs and no return value, show a message
      if (capturedLogs.length === 0 && result === undefined) {
        finalOutput = 'Code executed successfully (no output or return value)';
      }
      
      setOutput(finalOutput);
    } catch (err) {
      // Enhanced error messages for common mistakes
      let errorMessage = err.message;
      if (errorMessage.includes('Unexpected string')) {
        errorMessage += '\nTip: Check for missing semicolons (;) or commas (,)';
      }
      if (errorMessage.includes('is not defined')) {
        errorMessage += '\nTip: Check for typos in variable/function names';
      }
      if (errorMessage.includes('retuen')) {
        errorMessage += '\nTip: Did you mean "return"?';
      }
      
      setOutput(`Error: ${errorMessage}`);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
    }
  };

  return (
    <Box bg={cardBg} borderColor={borderColor} borderRadius="md" p={4}>
      <Flex justify="space-between" align="center" mb={3}>
        <HStack>
          <FaCode />
          <Heading size="md">Code Editor</Heading>
        </HStack>
        <Select 
          w="150px" 
          size="sm"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </Select>
      </Flex>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fontFamily="Monaco, Consolas, 'Courier New', monospace"
        fontSize="sm"
        minH="300px"
        resize="vertical"
        bg={editorBg}
        border="1px"
        borderColor={borderColor}
        placeholder="// Write your JavaScript code here..."
      />

      <Flex mt={3} gap={2}>
        <Button size="sm" colorScheme="green" onClick={runCode}>
          Run Code
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            setCode('// Write your solution here\nfunction solve() {\n  // code\n}');
            setOutput('');
          }}
        >
          Reset
        </Button>
      </Flex>

      {output && (
        <Box mt={3} p={3} bg={outputBg} borderRadius="md">
          <Text fontWeight="bold" mb={2}>Output:</Text>
          <Text fontFamily="Monaco, Consolas, 'Courier New', monospace" whiteSpace="pre-wrap" fontSize="sm">
            {output}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CodeEditor;