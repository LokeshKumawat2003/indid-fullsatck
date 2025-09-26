import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  useDisclosure,
  Spinner
} from '@chakra-ui/react';
import { 
  FaStop, 
  FaMicrophone, 
  FaCode,
  FaClock,
  FaHome,
  FaChartLine,
  FaForward,
  FaCamera,
  FaRecordVinyl,
  FaPlay,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import html2canvas from 'html2canvas';
import * as faceapi from 'face-api.js';

const AiHome = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Existing states
  const [isRecording, setIsRecording] = useState(true);
  const [timer, setTimer] = useState({ minutes: 45, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [interviewMode] = useState('technical');
  const [hasStarted, setHasStarted] = useState(false);
  const [code, setCode] = useState('// Write your code here');

  // Screen Recording States
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const screenRef = useRef(null);

  // Screenshot Modal State
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  // Permission and Face Detection States
  const [cameraPermission, setCameraPermission] = useState('initial');
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [canStartInterview, setCanStartInterview] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Permission Modal
  const { 
    isOpen: isPermissionModalOpen, 
    onOpen: openPermissionModal, 
    onClose: closePermissionModal 
  } = useDisclosure();

  // Custom model loading function with multiple fallback URLs
  const loadFaceDetectionModels = async () => {
    const modelUrls = [
      '/models',  // Local public directory
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights', // GitHub CDN
      'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights' // JSDelivr CDN
    ];

    const modelFiles = [
      'tiny_face_detector.bin',
      'tiny_face_detector.json',
      'face_landmark_68_model.bin',
      'face_landmark_68_model.json',
      'face_recognition_model.bin',
      'face_recognition_model.json'
    ];

    setIsLoadingModels(true);
    setModelLoadError(null);

    try {
      // Try loading from each URL
      for (const baseUrl of modelUrls) {
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl),
            faceapi.nets.faceLandmark68Net.loadFromUri(baseUrl),
            faceapi.nets.faceRecognitionNet.loadFromUri(baseUrl)
          ]);
          
          // If successful, break the loop
          return true;
        } catch (urlError) {
          console.warn(`Failed to load models from ${baseUrl}:`, urlError);
          continue;
        }
      }

      // If all URLs fail
      throw new Error('Could not load face detection models from any source');
    } catch (error) {
      console.error('Face detection model loading error:', error);
      setModelLoadError(error.message);
      
      toast({
        title: "Face Detection Setup Failed",
        description: "Unable to load face detection models. Please check your internet connection.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return false;
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Camera Permission and Detection Setup
  useEffect(() => {
    const initializeFaceDetection = async () => {
      try {
        // First, load models
        const modelsLoaded = await loadFaceDetectionModels();
        if (!modelsLoaded) {
          return;
        }

        // Check camera devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          setCameraPermission('no-camera');
          openPermissionModal();
          return;
        }

        // Attempt to get media stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false 
        });

        // If successful, set up video and start detection
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
          setCameraPermission('granted');

          // Start periodic face detection
          const intervalId = setInterval(detectFaces, 1000);
          
          // Cleanup function
          return () => {
            clearInterval(intervalId);
            stream.getTracks().forEach(track => track.stop());
          };
        }
      } catch (error) {
        console.error('Camera permission error:', error);
        
        // Different handling based on error type
        if (error.name === 'NotAllowedError') {
          setCameraPermission('denied');
          openPermissionModal();
        } else if (error.name === 'NotFoundError') {
          setCameraPermission('no-camera');
          openPermissionModal();
        } else {
          setCameraPermission('error');
          openPermissionModal();
        }
      }
    };

    initializeFaceDetection();
  }, []);

  const detectFaces = async () => {
    if (videoRef.current && canvasRef.current) {
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();

      if (detections.length > 0) {
        setIsFaceDetected(true);
        setCanStartInterview(true);
        
        // Optional: Draw face landmarks
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      } else {
        setIsFaceDetected(false);
        setCanStartInterview(false);
      }
    }
  };

  const handlePermissionAction = (action) => {
    switch (action) {
      case 'retry':
        // Attempt to get camera permission again
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => {
            setCameraPermission('granted');
            closePermissionModal();
          })
          .catch(error => {
            console.error('Permission retry failed:', error);
            toast({
              title: "Permission Denied",
              description: "Camera access is required to start the interview.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        break;
      case 'back':
        // Navigate back to previous page
        navigate(-1);
        break;
      default:
        navigate(-1);
    }
    closePermissionModal();
  };

  const startInterview = () => {
    if (canStartInterview && cameraPermission === 'granted') {
      // Start screen recording automatically
      startScreenRecording();
      
      setHasStarted(true);
      toast({
        title: "Interview Started!",
        description: "Face verified. Recording started. Good luck!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Cannot Start Interview",
        description: "Please ensure camera access and face is visible.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // AI Questions
  const questions = [
    "Welcome to the interview! Please introduce yourself.",
    "What are the key differences between JavaScript and TypeScript?",
    "Solve this DSA problem: Find the longest substring without repeating characters.",
    "Explain the concept of closures in JavaScript.",
    "How would you optimize the performance of a React application?"
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { mediaSource: 'screen' },
        audio: true 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedChunks(chunks);
        
        // Optional: Download or save the recording
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview_recording_${new Date().toISOString()}.webm`;
        a.click();
      };
      
      mediaRecorder.start();
      setIsScreenRecording(true);
      
      toast({
        title: "Screen Recording Started",
        description: "Your screen is now being recorded.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error starting screen recording:", err);
      toast({
        title: "Recording Failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isScreenRecording) {
      mediaRecorderRef.current.stop();
      setIsScreenRecording(false);
      
      toast({
        title: "Screen Recording Stopped",
        description: "Your screen recording has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const takeScreenshot = () => {
    if (screenRef.current) {
      html2canvas(screenRef.current).then(canvas => {
        const screenshotDataUrl = canvas.toDataURL('image/png');
        setScreenshotUrl(screenshotDataUrl);
        setIsScreenshotModalOpen(true);
        
        // Optional: Download screenshot
        const a = document.createElement('a');
        a.href = screenshotDataUrl;
        a.download = `interview_screenshot_${new Date().toISOString()}.png`;
        a.click();
        
        toast({
          title: "Screenshot Captured",
          description: "Your screenshot has been saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} p={4} ref={screenRef}>
      <Container maxW="7xl">
        {/* Loading Overlay */}
        {isLoadingModels && (
          <Center 
            position="fixed" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            bg="rgba(0,0,0,0.8)" 
            zIndex={1000} 
            flexDirection="column"
          >
            <VStack spacing={6} align="center">
              <Spinner 
                size="xl" 
                color="blue.500" 
                thickness="4px" 
                speed="0.65s" 
              />
              <Heading color="white" size="xl">
                Preparing Interview Environment
              </Heading>
              <Text color="gray.300" textAlign="center">
                Loading face detection models. This may take a moment...
              </Text>
            </VStack>
          </Center>
        )}

        {/* Model Load Error Handling */}
        {modelLoadError && (
          <Center 
            position="fixed" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            bg="rgba(0,0,0,0.8)" 
            zIndex={1000} 
            flexDirection="column"
          >
            <VStack spacing={6} align="center" p={6} bg="red.600" borderRadius="md">
              <FaExclamationTriangle size="64px" color="white" />
              <Heading color="white" size="xl" textAlign="center">
                Face Detection Setup Failed
              </Heading>
              <Text color="white" textAlign="center">
                {modelLoadError}
              </Text>
              <HStack spacing={4}>
                <Button 
                  colorScheme="whiteAlpha" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Button 
                  colorScheme="whiteAlpha" 
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </HStack>
            </VStack>
          </Center>
        )}

        {/* Rest of the existing content remains the same */}
        {!isLoadingModels && !modelLoadError && (
          <>
            {/* Face Detection and Interview Start Screen */}
            {!hasStarted && (
              <Center 
                position="fixed" 
                top={0} 
                left={0} 
                right={0} 
                bottom={0} 
                bg="rgba(0,0,0,0.8)" 
                zIndex={1000} 
                flexDirection="column"
              >
                <VStack spacing={6} align="center">
                  <Heading color="white" size="xl">
                    AI Interview Verification
                  </Heading>
                  
                  {/* Video and Canvas for Face Detection */}
                  <Box position="relative" width="400px" height="300px">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      width={400} 
                      height={300} 
                      onPlay={() => {
                        const intervalId = setInterval(async () => {
                          await detectFaces();
                        }, 1000);
                        return () => clearInterval(intervalId);
                      }}
                    />
                    <canvas 
                      ref={canvasRef} 
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%' 
                      }} 
                    />
                  </Box>
                  
                  {/* Face Detection Status */}
                  <VStack spacing={4}>
                    <Badge 
                      colorScheme={isFaceDetected ? "green" : "red"}
                      fontSize="md"
                      p={2}
                    >
                      {isFaceDetected ? "Face Detected" : "No Face Detected"}
                    </Badge>
                    
                    <Button 
                      colorScheme="blue" 
                      size="lg" 
                      leftIcon={<FaPlay />}
                      onClick={startInterview}
                      isDisabled={!canStartInterview}
                    >
                      Start Interview
                    </Button>
                  </VStack>
                </VStack>
              </Center>
            )}

            {/* Existing interview content */}
            {hasStarted && (
              <>
                {/* Existing header and content */}
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
                          
                          {/* Screen Recording Controls */}
                          <Tooltip label={isScreenRecording ? "Stop Screen Recording" : "Start Screen Recording"}>
                            <Button
                              colorScheme={isScreenRecording ? "red" : "green"}
                              w="full"
                              leftIcon={isScreenRecording ? <FaStop /> : <FaRecordVinyl />}
                              onClick={isScreenRecording ? stopScreenRecording : startScreenRecording}
                            >
                              {isScreenRecording ? "Stop Recording" : "Start Recording"}
                            </Button>
                          </Tooltip>
                          
                          {/* Screenshot Button */}
                          <Tooltip label="Take Screenshot">
                            <Button
                              colorScheme="blue"
                              w="full"
                              leftIcon={<FaCamera />}
                              onClick={takeScreenshot}
                            >
                              Take Screenshot
                            </Button>
                          </Tooltip>
                          
                          {/* Finish Interview */}
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
              </>
            )}

            {/* Screenshot Modal */}
            <Modal isOpen={isScreenshotModalOpen} onClose={() => setIsScreenshotModalOpen(false)} size="4xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Captured Screenshot</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {screenshotUrl && (
                    <img 
                      src={screenshotUrl} 
                      alt="Captured Screenshot" 
                      style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={() => setIsScreenshotModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Permission Modal */}
            <Modal isOpen={isPermissionModalOpen} onClose={closePermissionModal} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Camera Access Required</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <Text>
                      {cameraPermission === 'no-camera' && "No camera device found on your system."}
                      {cameraPermission === 'denied' && "Camera access has been denied. Please enable it in your browser settings."}
                      {cameraPermission === 'error' && "An error occurred while accessing the camera."}
                      {cameraPermission === 'initial' && "Please allow camera access to start the interview."}
                    </Text>
                    <HStack spacing={3}>
                      <Button colorScheme="blue" onClick={() => handlePermissionAction('retry')}>
                        Retry
                      </Button>
                      <Button colorScheme="gray" onClick={() => handlePermissionAction('back')}>
                        Back
                      </Button>
                    </HStack>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AiHome;
