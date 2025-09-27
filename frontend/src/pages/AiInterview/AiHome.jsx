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
  Tooltip
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
  FaPlay
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';

const AiHome = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Basic states
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState({ minutes: 45, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [interviewMode] = useState('technical');
  const [hasStarted, setHasStarted] = useState(false);
  const [code, setCode] = useState('// Write your code here');

  // Screen Recording States
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [webcamStatus, setWebcamStatus] = useState('inactive'); // 'inactive', 'loading', 'active', 'error'
  const mediaRecorderRef = useRef(null);
  const webcamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const combinedStreamRef = useRef(null);

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

  // Separate function to start webcam only
  const startWebcam = async () => {
    try {
      setWebcamStatus('loading');
      console.log('Starting webcam...');
      
      // Stop any existing webcam stream first
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }

      // Clear the video element
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
        webcamRef.current.load();
      }

      // Request webcam with simpler constraints first
      const webcamStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 320, max: 640 },
          height: { ideal: 240, max: 480 },
          frameRate: { ideal: 15, max: 30 }
        },
        audio: false
      });

      console.log('Webcam stream obtained:', webcamStream);
      console.log('Video tracks:', webcamStream.getVideoTracks());

      // Check if video track is active
      const videoTrack = webcamStream.getVideoTracks()[0];
      if (videoTrack) {
        console.log('Video track state:', videoTrack.readyState);
        console.log('Video track settings:', videoTrack.getSettings());
      }

      // Store stream
      webcamStreamRef.current = webcamStream;

      // Set up webcam display with promise-based approach
      if (webcamRef.current && webcamStream) {
        console.log('Setting up webcam video element...');
        
        return new Promise((resolve, reject) => {
          const video = webcamRef.current;
          let timeoutId;
          
          const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            video.onloadedmetadata = null;
            video.oncanplay = null;
            video.oncanplaythrough = null;
            video.onerror = null;
          };
          
          const handleSuccess = () => {
            console.log('Webcam setup successful');
            cleanup();
            setWebcamStatus('active');
            resolve(webcamStream);
          };
          
          const handleError = (error) => {
            console.error('Webcam setup error:', error);
            cleanup();
            setWebcamStatus('error');
            reject(error);
          };
          
          // Set up event listeners
          video.onloadedmetadata = () => {
            console.log('Webcam metadata loaded');
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          };
          
          video.oncanplay = () => {
            console.log('Webcam can play');
            handleSuccess();
          };
          
          video.oncanplaythrough = () => {
            console.log('Webcam can play through');
            handleSuccess();
          };
          
          video.onerror = (e) => {
            console.error('Webcam video error:', e);
            handleError(e);
          };
          
          // Set timeout as fallback
          timeoutId = setTimeout(() => {
            console.log('Webcam setup timeout - forcing success');
            handleSuccess();
          }, 3000);
          
          // Set the stream
          video.srcObject = webcamStream;
          
          // Force play immediately
          video.play().then(() => {
            console.log('Video play() succeeded');
            // Don't call handleSuccess here, let the events handle it
          }).catch((playError) => {
            console.error('Video play() failed:', playError);
            // Try without autoplay
            video.muted = true;
            video.playsInline = true;
            video.play().catch(() => {
              console.log('Second play attempt failed, but continuing...');
              // Don't fail completely, the video might still work
            });
          });
        });
      }

      return webcamStream;
    } catch (err) {
      console.error("Webcam start error:", err);
      setWebcamStatus('error');
      
      let errorMessage = "Failed to access webcam.";
      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Camera is being used by another application. Please close other apps using the camera.";
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = "Camera constraints not supported. Trying with basic settings...";
        
        // Retry with most basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false
          });
          
          webcamStreamRef.current = basicStream;
          if (webcamRef.current) {
            webcamRef.current.srcObject = basicStream;
            await webcamRef.current.play();
            setWebcamStatus('active');
            return basicStream;
          }
        } catch (retryErr) {
          console.error('Retry with basic constraints failed:', retryErr);
        }
      }
      
      toast({
        title: "Webcam Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      throw err;
    }
  };

  // Auto start camera and screen recording when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const autoStartRecording = async () => {
      if (!isMounted || hasStarted || isScreenRecording) {
        return;
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        
        await startScreenRecording();
        
        if (isMounted) {
          setHasStarted(true);
          setIsRecording(true);
          setIsTimerRunning(true);
          
          toast({
            title: "Interview Started!",
            description: "Camera and screen recording are active.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Auto start failed:", error);
        if (isMounted) {
          toast({
            title: "Setup Required",
            description: "Please allow camera and screen sharing permissions to continue.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    autoStartRecording();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
            stopScreenRecording();
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

  // Cleanup effect
  useEffect(() => {
    const cleanup = () => {
      console.log('=== CLEANUP ON UNMOUNT ===');
      
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Cleanup: stopped screen track');
        });
        screenStreamRef.current = null;
      }
      
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Cleanup: stopped webcam track');
        });
        webcamStreamRef.current = null;
      }
      
      if (combinedStreamRef.current) {
        combinedStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        combinedStreamRef.current = null;
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        console.log('Cleanup: stopped media recorder');
      }
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, []);

  const startScreenRecording = async () => {
    try {
      if (isScreenRecording) {
        console.log('Recording already in progress');
        return;
      }

      console.log('Starting recording...');
      
      // Request screen sharing first
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          mediaSource: 'screen',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Start webcam separately
      const webcamStream = await startWebcam();

      console.log('Both streams obtained');
      screenStreamRef.current = screenStream;

      // Create combined stream for recording
      const combinedStream = new MediaStream();
      
      // Add video tracks
      screenStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
        console.log('Added screen video track');
      });
      
      if (webcamStream) {
        webcamStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track);
          console.log('Added webcam video track');
        });
      }
      
      // Add only screen audio
      screenStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
        console.log('Added screen audio track');
      });

      combinedStreamRef.current = combinedStream;

      // Handle screen share stop by user
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      if (screenVideoTrack) {
        screenVideoTrack.onended = () => {
          console.log('Screen sharing ended by user - stopping recording');
          stopScreenRecording();
        };
      }

      // Set up media recorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }
      
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log('Data chunk recorded:', e.data.size);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped');
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview_recording_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        toast({
          title: "Recording Saved",
          description: "Your interview recording has been downloaded successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      };
      
      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
      };
      
      mediaRecorder.start(1000);
      setIsScreenRecording(true);
      
      console.log('Recording started successfully');
      
    } catch (err) {
      console.error("Recording start error:", err);
      
      // Clean up any streams that were created
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped screen track on error');
        });
        screenStreamRef.current = null;
      }
      
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped webcam track on error');
        });
        webcamStreamRef.current = null;
      }
      
      let errorMessage = "Failed to start recording. Please try again.";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Permission denied. Please allow screen sharing and camera access.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "Camera or screen not found.";
      } else if (err.name === 'AbortError') {
        errorMessage = "Recording setup was cancelled.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Recording not supported by this browser.";
      }
      
      toast({
        title: "Recording Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const stopScreenRecording = () => {
    console.log('=== STOPPING SCREEN RECORDING ===');
    
    try {
      if (mediaRecorderRef.current) {
        const state = mediaRecorderRef.current.state;
        console.log('MediaRecorder state:', state);
        
        if (state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('MediaRecorder stopped');
        }
        mediaRecorderRef.current = null;
      }
      
      if (screenStreamRef.current) {
        console.log('Stopping screen sharing tracks...');
        screenStreamRef.current.getTracks().forEach((track, index) => {
          console.log(`Stopping screen track ${index}:`, track.kind, track.readyState);
          track.stop();
          console.log(`Screen track ${index} stopped, new state:`, track.readyState);
        });
        screenStreamRef.current = null;
        console.log('Screen stream cleared');
      }
      
      if (webcamStreamRef.current) {
        console.log('Stopping webcam tracks...');
        webcamStreamRef.current.getTracks().forEach((track, index) => {
          console.log(`Stopping webcam track ${index}:`, track.kind, track.readyState);
          track.stop();
          console.log(`Webcam track ${index} stopped, new state:`, track.readyState);
        });
        webcamStreamRef.current = null;
        console.log('Webcam stream cleared');
      }
      
      if (combinedStreamRef.current) {
        console.log('Stopping combined stream tracks...');
        combinedStreamRef.current.getTracks().forEach((track, index) => {
          console.log(`Stopping combined track ${index}:`, track.kind, track.readyState);
          track.stop();
        });
        combinedStreamRef.current = null;
        console.log('Combined stream cleared');
      }
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
        webcamRef.current.load();
        console.log('Webcam video element cleared');
      }
      
      setIsScreenRecording(false);
      setIsRecording(false);
      setIsTimerRunning(false);
      setWebcamStatus('inactive');
      
      console.log('=== ALL RECORDING STOPPED ===');
      
      toast({
        title: "Interview Finished",
        description: "Recording stopped. Camera and screen sharing permissions revoked.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      
      setIsScreenRecording(false);
      setIsRecording(false);
      setIsTimerRunning(false);
      setWebcamStatus('error');
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
      }
      
      toast({
        title: "Recording Stopped",
        description: "Recording ended with some cleanup issues. Please refresh if needed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVoiceText("");
    } else {
      toast({
        title: "Interview Completed!",
        description: "No more questions left.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      stopScreenRecording();
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
    <Box minH="100vh" bg={bgColor} p={4} position="relative">
      <Container maxW="7xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <HStack>
            <IconButton
              icon={<FaHome />}
              variant="ghost"
              size="lg"
              aria-label="Home"
              onClick={() => navigate('/')}
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
                <Text fontSize="lg">{questions[currentQuestionIndex]}</Text>
              </Box>

              {/* Code Editor */}
              <CodeEditor
                code={code}
                setCode={setCode}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onRun={() => {
                  console.log('Run code:', code);
                  toast({
                    title: "Code Executed",
                    description: "Check console for output",
                    status: "info",
                    duration: 2000,
                  });
                }}
              />

              {/* User Response */}
              <Box 
                bg={cardBg} 
                borderColor={borderColor}
                borderRadius="md"
                p={4}
              >
                <Heading size="md" mb={3}>Your Response</Heading>
                <Textarea
                  placeholder="Type your response here or use the microphone..."
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
                      w="full"
                      onClick={() => setVoiceText("Voice input captured...")}
                    />
                  </Tooltip>
                  
                  {/* Webcam Test Button */}
                  <Tooltip label="Test webcam separately">
                    <Button
                      colorScheme="purple"
                      w="full"
                      leftIcon={<FaCamera />}
                      onClick={() => {
                        setWebcamStatus('loading');
                        startWebcam().catch(err => {
                          console.error('Manual webcam test failed:', err);
                          setWebcamStatus('error');
                        });
                      }}
                      isLoading={webcamStatus === 'loading'}
                      loadingText="Starting..."
                      size="sm"
                    >
                      {webcamStatus === 'error' ? 'Retry Webcam' : 'Test Webcam'}
                    </Button>
                  </Tooltip>
                  
                  {/* Force Refresh Webcam */}
                  {webcamStatus === 'loading' && (
                    <Tooltip label="Force refresh if stuck on loading">
                      <Button
                        colorScheme="yellow"
                        w="full"
                        leftIcon={<FaCamera />}
                        onClick={() => {
                          // Force stop everything and restart
                          if (webcamStreamRef.current) {
                            webcamStreamRef.current.getTracks().forEach(track => track.stop());
                            webcamStreamRef.current = null;
                          }
                          if (webcamRef.current) {
                            webcamRef.current.srcObject = null;
                            webcamRef.current.load();
                          }
                          setWebcamStatus('inactive');
                          
                          // Restart after a delay
                          setTimeout(() => {
                            startWebcam().catch(err => {
                              console.error('Force refresh failed:', err);
                              setWebcamStatus('error');
                            });
                          }, 1000);
                        }}
                        size="sm"
                      >
                        Force Refresh
                      </Button>
                    </Tooltip>
                  )}
                  
                  <Tooltip label="Stop Interview and End Recording">
                    <Button
                      colorScheme="red"
                      w="full"
                      leftIcon={<FaStop />}
                      onClick={stopScreenRecording}
                      isDisabled={!isScreenRecording}
                      size="lg"
                    >
                      Stop Recording
                    </Button>
                  </Tooltip>

                  {!isScreenRecording && (
                    <Tooltip label="Restart Recording (New permissions will be requested)">
                      <Button
                        colorScheme="green"
                        w="full"
                        leftIcon={<FaRecordVinyl />}
                        onClick={() => {
                          setHasStarted(false);
                          startScreenRecording().then(() => {
                            setHasStarted(true);
                            setIsRecording(true);
                            setIsTimerRunning(true);
                          });
                        }}
                        size="lg"
                      >
                        Restart Recording
                      </Button>
                    </Tooltip>
                  )}
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
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.500">Camera:</Text>
                    <Badge colorScheme={
                      webcamStatus === 'active' ? 'green' : 
                      webcamStatus === 'loading' ? 'yellow' : 
                      webcamStatus === 'error' ? 'red' : 'gray'
                    }>
                      {webcamStatus === 'active' ? 'Active' : 
                       webcamStatus === 'loading' ? 'Loading' : 
                       webcamStatus === 'error' ? 'Error' : 'Inactive'}
                    </Badge>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* Webcam Display - Top Right Corner */}
      {(isScreenRecording || webcamStatus === 'active') && (
        <Box 
          position="fixed" 
          top="20px" 
          right="20px" 
          width="200px" 
          height="150px" 
          zIndex={1000} 
          borderRadius="md" 
          overflow="hidden"
          boxShadow="lg"
          border="3px solid"
          borderColor={
            webcamStatus === 'active' ? 'green.500' : 
            webcamStatus === 'loading' ? 'yellow.500' : 
            webcamStatus === 'error' ? 'red.500' : 'blue.500'
          }
          bg="black"
        >
          {webcamStatus === 'loading' && (
            <Flex justify="center" align="center" h="100%" color="white">
              <Text>Loading...</Text>
            </Flex>
          )}
          
          {webcamStatus === 'error' && (
            <Flex justify="center" align="center" h="100%" color="white" direction="column">
              <FaCamera size={24} />
              <Text fontSize="xs" mt={2}>Camera Error</Text>
            </Flex>
          )}
          
          <video 
            ref={webcamRef} 
            autoPlay
            playsInline
            muted
            controls={false}
            width="200"
            height="150"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              backgroundColor: '#000',
              display: webcamStatus === 'active' ? 'block' : 'none'
            }}
            onLoadedData={() => {
              console.log('Video loaded data event');
              if (webcamStatus === 'loading') {
                setWebcamStatus('active');
              }
            }}
            onPlaying={() => {
              console.log('Video playing event');
              setWebcamStatus('active');
            }}
          />
          
          {/* Recording Indicator */}
          {isScreenRecording && (
            <Box
              position="absolute"
              top="5px"
              left="5px"
              bg="red.500"
              color="white"
              px={2}
              py={1}
              borderRadius="sm"
              fontSize="xs"
              fontWeight="bold"
            >
              ● REC
            </Box>
          )}
          
          {/* Status Indicator */}
          <Box
            position="absolute"
            bottom="5px"
            left="5px"
            bg="rgba(0,0,0,0.7)"
            color="white"
            px={2}
            py={1}
            borderRadius="sm"
            fontSize="xs"
          >
            {webcamStatus === 'active' ? 'LIVE' : 
             webcamStatus === 'loading' ? 'LOADING' : 
             webcamStatus === 'error' ? 'ERROR' : 'OFF'}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AiHome;