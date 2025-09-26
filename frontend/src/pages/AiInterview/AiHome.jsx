import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Badge,
  Textarea,
  Select,
  Progress,
  useColorModeValue,
  useToast,
  Avatar,
  Tooltip
} from '@chakra-ui/react';
import { 
  FaStop, 
  FaMicrophone, 
  FaCode,
  FaClock,
  FaHome,
  FaChartLine,
  FaForward
} from 'react-icons/fa';
import CodeEditor from './CodeEditor';

const AiHome = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [timer, setTimer] = useState({ minutes: 45, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [interviewMode] = useState('technical');
  const [hasStarted, setHasStarted] = useState(false);
  const [code, setCode] = useState('// Write your code here');

  // AI Questions
  const questions = [
    "Welcome to the interview! Please introduce yourself.",
    "What are the key differences between JavaScript and TypeScript?",
    "Solve this DSA problem: Find the longest substring without repeating characters.",
    "Explain the concept of closures in JavaScript.",
    "How would you optimize the performance of a React application?"
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Start interview toast only once
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      toast({
        title: "Interview Started!",
        description: "Recording is active...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [hasStarted, toast]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer.seconds > 0) {
            return { ...prevTimer, seconds: prevTimer.seconds - 1 };
          } else if (prevTimer.minutes > 0) {
            return { minutes: prevTimer.minutes - 1, seconds: 59 };
          } else {
            setIsTimerRunning(false);
            setIsRecording(false);
            toast({
              title: "Time's up!",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
            return { minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, toast]);

  const stopInterview = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
    toast({
      title: "Interview Finished",
      description: "Recording stopped.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVoiceText(""); // clear response
    } else {
      toast({
        title: "Interview Completed!",
        description: "No more questions left.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      stopInterview();
    }
  };

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = () => {
    const totalSeconds = 45 * 60;
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      <Container maxW="7xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <HStack>
            <IconButton
              icon={<FaHome />}
              variant="ghost"
              size="lg"
              aria-label="Home"
            />
            <Heading size="lg" color="blue.500">
              AI Interview Assistant
            </Heading>
          </HStack>
          
          <HStack spacing={3}>
            <Badge colorScheme={isTimerRunning ? 'green' : 'gray'} p={2} borderRadius="md">
              <HStack>
                <FaClock />
                <Text fontWeight="bold">{formatTime(timer.minutes, timer.seconds)}</Text>
              </HStack>
            </Badge>
          </HStack>
        </Flex>

        {/* Timer Progress */}
        <Box mb={4}>
          <Progress 
            value={getTimerProgress()} 
            colorScheme={timer.minutes < 5 ? 'red' : 'blue'} 
            size="sm" 
            borderRadius="md"
          />
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 300px' }} gap={6}>
          {/* Main Content */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* AI Speaking Box */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
                border="2px dashed"
              >
                <Text fontWeight="bold" color="blue.500" mb={2}>AI Interviewer says:</Text>
                <Text>{questions[currentQuestionIndex]}</Text>
              </Box>

              {/* Code Editor */}
              <CodeEditor
                code={code}
                setCode={setCode}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onRun={() => {
                  // safe placeholder: console.log the code
                  console.log('Run code:', code);
                }}
              />

              {/* User Response */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
              >
                <Heading size="md">Your Response</Heading>
                <Textarea
                  placeholder="Your voice will be transcribed here, or you can type your response..."
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  minH="120px"
                  resize="vertical"
                />
                <HStack mt={3} spacing={3}>
                  <Button colorScheme="blue" size="sm">
                    Send Response
                  </Button>
                  <Button 
                    leftIcon={<FaForward />} 
                    colorScheme="orange" 
                    size="sm" 
                    onClick={skipQuestion}
                  >
                    Skip Question
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              {/* AI Interviewer Profile */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
                textAlign="center"
              >
                <Avatar size="xl" name="AI Interviewer" mb={3} />
                <Heading size="md">AI Interviewer</Heading>
                <Text fontSize="sm" color="gray.500">Technical Specialist</Text>
              </Box>

              {/* Controls */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
              >
                <Heading size="md" mb={3}>Controls</Heading>
                <VStack spacing={3}>
                  <Tooltip label="Use microphone to speak">
                    <IconButton
                      icon={<FaMicrophone />}
                      colorScheme="blue"
                      aria-label="Speak"
                      onClick={() => setVoiceText("This is my spoken response...")}
                    />
                  </Tooltip>
                  <Tooltip label="Finish Interview">
                    <Button
                      colorScheme="red"
                      w="full"
                      leftIcon={<FaStop />}
                      onClick={stopInterview}
                      isDisabled={!isRecording}
                    >
                      Stop Recording
                    </Button>
                  </Tooltip>
                </VStack>
              </Box>

              {/* Interview Stats */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
              >
                <HStack>
                  <FaChartLine />
                  <Heading size="md">Session Stats</Heading>
                </HStack>
                <VStack align="stretch" spacing={3} mt={2}>
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.500">Questions:</Text>
                    <Badge>{currentQuestionIndex + 1}/{questions.length}</Badge>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.500">Mode:</Text>
                    <Badge colorScheme="blue">{interviewMode}</Badge>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.500">Status:</Text>
                    <Badge colorScheme={isRecording ? "green" : "gray"}>
                      {isRecording ? "Recording" : "Stopped"}
                    </Badge>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default AiHome;
