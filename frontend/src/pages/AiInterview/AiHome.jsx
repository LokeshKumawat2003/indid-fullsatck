import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useUserActivityTracker } from '../../hooks/useUserActivityTracker';

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

  // Add state for session management and conversation history
  const [sessionId, setSessionId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Screen Recording States
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [webcamStatus, setWebcamStatus] = useState('inactive'); // 'inactive', 'loading', 'active', 'error'
  const mediaRecorderRef = useRef(null);
  const webcamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const combinedStreamRef = useRef(null);
  const forceRefreshTimeoutRef = useRef(null);

  // AI Interview states
  const [interviewStage, setInterviewStage] = useState('introduction'); // e.g., 'introduction', 'education', 'project_experience', 'wrap_up'
  const [aiQuestion, setAiQuestion] = useState(""); // To store the dynamic question from AI

  // Add voice synthesis functionality
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Modify speech recognition functionality
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const speechRecognitionRef = useRef(null);

  // Add a ref to track the auto-send timeout
  const autoSendTimeoutRef = useRef(null);

  // Add a ref to track the last spoken AI question
  const lastSpokenQuestionRef = useRef("");

  // Function to speak the AI's question
  const speakAiQuestion = useCallback(() => {
    if ('speechSynthesis' in window && aiQuestion) { // Ensure aiQuestion is not empty
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(aiQuestion);
      utterance.rate = 0.9; 
      utterance.pitch = 1; 
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else if (aiQuestion) { // Fallback for browsers that don't support speech synthesis
      toast({
        title: "Voice Not Supported",
        description: "Your browser does not support text-to-speech.",
        status: "warning",
        duration: 3000,
      });
    }
  }, [aiQuestion, setIsSpeaking, toast]);

  const skipQuestion = async () => {
    toast({
      title: "Skipping Question",
      description: "Moving to the next question.",
      status: "info",
      duration: 2000,
    });
    // Send a special prompt to the backend to indicate skipping
    const aiReply = await handleChatResponse("SKIP_CURRENT_QUESTION");

    if (aiReply) {
      setConversationHistory(prevHistory => [
        ...prevHistory,
        { role: "user", text: "Skipped current question.", timestamp: new Date() },
        { role: "ai", text: aiReply, timestamp: new Date() },
      ]);
    }
  };

  const handleChatResponse = async (promptText) => {
    try {
      // Calculate the number of AI questions asked so far
      const questionCount = conversationHistory.filter(msg => msg.role === 'ai' && msg.text.includes("?")).length;

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          sessionId: sessionId, // Send current sessionId
          userId: "60d5ec49f8c7b8001f8e4d3a", // Placeholder userId, replace with actual user ID
          interviewStage: interviewStage, // Send current interview stage
          conversationHistory: conversationHistory, // Send full conversation history
          questionCount: questionCount, // Send the current question count
        }),
      });

      const data = await res.json();

      // console.log(data.response.content[0].text);
      if (data.success && data.response && data.response.content && data.response.content.length > 0) {
        // Update sessionId if a new one is returned
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId);
        }

        const aiResponseContent = data.response.content[0].text; // Get the raw AI response

        // The AI's response might contain both feedback and the next question
        // We'll need to parse this. For now, we'll assume the AI's response is the next question if it starts with a question mark, otherwise it's feedback.
        // A more robust solution might involve the AI structuring its response (e.g., JSON output).

        // Heuristic: only set aiQuestion if the response ends with a question mark, indicating it's a question
        if (aiResponseContent.trim().endsWith('?')) {
          setAiQuestion(aiResponseContent); // Set the AI's response as the next question
        }

        return aiResponseContent; // Return the AI's reply
      } else {
        console.error("Unexpected response format:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      return null;
    }
  };

  // Function to send response with voice input
  const sendVoiceResponse = async (transcript) => {
    // If no transcript is provided, use the current voiceText
    const responseText = transcript || voiceText;

    if (responseText.trim()) {
      // Implement your response sending logic here
      toast({
        title: "Response Sent",
        description: "Your voice response has been recorded.",
        status: "success",
        duration: 2000,
      });

      // Call the chat response handler
      const aiReply = await handleChatResponse(responseText);

      if (aiReply) {
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: "user", text: responseText, timestamp: new Date() },
          { role: "ai", text: aiReply, timestamp: new Date() },
        ]);
      }

      // Reset voice text and move to next question
      setVoiceText('');
      setLiveTranscript('');

      // The AI is now responsible for progressing the interview
      // No longer need to manually increment currentQuestionIndex
      // if (currentQuestionIndex < questions.length - 1) {
      //   setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      // } else {
      //   // End of interview
      //   toast({
      //     title: "Interview Completed",
      //     description: "You've answered all questions.",
      //     status: "info",
      //     duration: 3000,
      //   });
      // }
    }
  };

  // Function to start voice recording with improved auto-send
  const startVoiceRecording = () => {
    // Stop any ongoing speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Check browser support for speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      // Create speech recognition instance
      speechRecognitionRef.current = new SpeechRecognition();

      // Configure speech recognition
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'en-US'; // Set language to English

      // Tracking variables for auto-send
      let lastSpeechTime = Date.now();
      let finalTranscript = '';

      // Event handlers
      speechRecognitionRef.current.onstart = () => {
        setIsListening(true);
        setLiveTranscript(''); // Clear previous transcript
        finalTranscript = ''; // Reset final transcript

        // Clear any existing auto-send timeout
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
        }

        toast({
          title: "Listening",
          description: "Speak your response... (Auto-send after 3 seconds of silence)",
          status: "info",
          duration: 2000,
        });
      };

      speechRecognitionRef.current.onresult = (event) => {
        // Combine all recognized speech
        let interimTranscript = '';
        let newFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript + ' ';
          }
        }

        // Update final transcript
        finalTranscript += newFinalTranscript;

        // Update live transcript
        const combinedTranscript = (interimTranscript || newFinalTranscript).trim();
        setLiveTranscript(combinedTranscript);

        // Update last speech time
        lastSpeechTime = Date.now();

        // Clear previous timeout and set a new one
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
        }

        // Set a new auto-send timeout
        autoSendTimeoutRef.current = setTimeout(() => {
          // Check if 3 seconds have passed since last speech
          if (Date.now() - lastSpeechTime >= 3000) {
            // Auto-send the response
            sendVoiceResponse(finalTranscript);

            // Stop recognition
            if (speechRecognitionRef.current) {
              speechRecognitionRef.current.stop();
            }
          }
        }, 3000); // 3 seconds of silence
      };

      speechRecognitionRef.current.onerror = (event) => {
        // Clear auto-send timeout on error
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
        }

        setIsListening(false);
        setLiveTranscript('');
        toast({
          title: "Speech Recognition Error",
          description: event.error,
          status: "error",
          duration: 3000,
        });
      };

      speechRecognitionRef.current.onend = () => {
        // Clear auto-send timeout
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
        }

        setIsListening(false);

        // Auto-send if there's a final transcript
        if (finalTranscript.trim()) {
          sendVoiceResponse(finalTranscript);
        }

        // Clear live transcript
        setLiveTranscript('');
      };

      // Start listening
      speechRecognitionRef.current.start();
    } else {
      // Fallback for browsers without speech recognition
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        status: "warning",
        duration: 3000,
      });
    }
  };

  // Function to stop voice recording
  const stopVoiceRecording = () => {
    // Clear auto-send timeout
    if (autoSendTimeoutRef.current) {
      clearTimeout(autoSendTimeoutRef.current);
    }

    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setLiveTranscript('');
    }
  };

  // Function to send response (you can customize this based on your existing logic)
  const sendResponse = async () => {
    if (voiceText.trim()) {
      // Add user's typed response to conversation history
      setConversationHistory(prevHistory => [
        ...prevHistory,
        { role: "user", text: voiceText, timestamp: new Date() },
      ]);

      // Call the chat response handler with the typed text
      const aiReply = await handleChatResponse(voiceText);

      if (aiReply) {
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: "ai", text: aiReply, timestamp: new Date() },
        ]);
      }

      // Clear the text area after sending
      setVoiceText('');

      // The AI is now responsible for progressing the interview
      // No longer need to manually increment currentQuestionIndex
      // if (currentQuestionIndex < questions.length - 1) {
      //   setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      // } else {
      //   // End of interview
      //   toast({
      //     title: "Interview Completed",
      //     description: "You've answered all questions.",
      //     status: "info",
      //     duration: 3000,
      //   });
      // }

      toast({
        title: "Response Sent",
        description: "Your response has been recorded.",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Empty Response",
        description: "Please type a response before sending.",
        status: "warning",
        duration: 2000,
      });
    }
  };

  // Function to speak the current question (OLD - to be removed or refactored)
  // const speakQuestion = () => {
  //   // Check if browser supports speech synthesis
  //   if ('speechSynthesis' in window) {
  //     // Stop any ongoing speech
  //     window.speechSynthesis.cancel();
  // 
  //     // Create a new speech utterance
  //     const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex]);
  // 
  //     // Optional: Configure speech properties
  //     utterance.rate = 0.9; // Slightly slower speech
  //     utterance.pitch = 1; // Normal pitch
  // 
  //     // Event listeners for speaking state
  //     utterance.onstart = () => setIsSpeaking(true);
  //     utterance.onend = () => setIsSpeaking(false);
  // 
  //     // Speak the question
  //     window.speechSynthesis.speak(utterance);
  //   } else {
  //     // Fallback for browsers that don't support speech synthesis
  //     toast({
  //       title: "Voice Not Supported",
  //       description: "Your browser does not support text-to-speech.",
  //       status: "warning",
  //       duration: 3000,
  //     });
  //   }
  // };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Force refresh function for webcam
  const forceRefreshWebcam = () => {
    // console.log('Force refreshing webcam...');

    // Clear any existing timeout
    if (forceRefreshTimeoutRef.current) {
      clearTimeout(forceRefreshTimeoutRef.current);
      forceRefreshTimeoutRef.current = null;
    }

    // Force stop everything
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
    }, 4000);
  };

  // Separate function to start webcam only
  const startWebcam = async () => {
    try {
      setWebcamStatus('loading');
      // console.log('Starting webcam...');

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

      // Set up auto force refresh after 5 seconds if still loading
      forceRefreshTimeoutRef.current = setTimeout(() => {
        if (webcamStatus === 'loading') {
          // console.log('Auto force refresh triggered after 5 seconds');
          toast({
            title: "Auto Refresh",
            description: "Camera taking too long to load, refreshing automatically...",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          forceRefreshWebcam();
        }
      }, 5000);

      // Request webcam with simpler constraints first
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320, max: 640 },
          height: { ideal: 240, max: 480 },
          frameRate: { ideal: 15, max: 30 }
        },
        audio: false
      });

      // console.log('Webcam stream obtained:', webcamStream);
      // console.log('Video tracks:', webcamStream.getVideoTracks());

      // Check if video track is active
      const videoTrack = webcamStream.getVideoTracks()[0];
      if (videoTrack) {
        // console.log('Video track state:', videoTrack.readyState);
        // console.log('Video track settings:', videoTrack.getSettings());
      }

      // Store stream
      webcamStreamRef.current = webcamStream;

      // Set up webcam display with promise-based approach
      if (webcamRef.current && webcamStream) {
        // console.log('Setting up webcam video element...');

        return new Promise((resolve, reject) => {
          const video = webcamRef.current;
          let timeoutId;

          const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (forceRefreshTimeoutRef.current) {
              clearTimeout(forceRefreshTimeoutRef.current);
              forceRefreshTimeoutRef.current = null;
            }
            video.onloadedmetadata = null;
            video.oncanplay = null;
            video.oncanplaythrough = null;
            video.onerror = null;
          };

          const handleSuccess = () => {
            // console.log('Webcam setup successful');
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
            // console.log('Webcam metadata loaded');
            // console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          };

          video.oncanplay = () => {
            // console.log('Webcam can play');
            handleSuccess();
          };

          video.oncanplaythrough = () => {
            // console.log('Webcam can play through');
            handleSuccess();
          };

          video.onerror = (e) => {
            console.error('Webcam video error:', e);
            handleError(e);
          };

          // Set timeout as fallback
          timeoutId = setTimeout(() => {
            // console.log('Webcam setup timeout - forcing success');
            handleSuccess();
          }, 3000);

          // Set the stream
          video.srcObject = webcamStream;

          // Force play immediately
          video.play().then(() => {
            // console.log('Video play() succeeded');
            // Don't call handleSuccess here, let the events handle it
          }).catch((playError) => {
            console.error('Video play() failed:', playError);
            // Try without autoplay
            video.muted = true;
            video.playsInline = true;
            video.play().catch(() => {
              // console.log('Second play attempt failed, but continuing...');
              // Don't fail completely, the video might still work
            });
          });
        });
      }

      return webcamStream;
    } catch (err) {
      console.error("Webcam start error:", err);
      setWebcamStatus('error');

      // Clear the auto refresh timeout on error
      if (forceRefreshTimeoutRef.current) {
        clearTimeout(forceRefreshTimeoutRef.current);
        forceRefreshTimeoutRef.current = null;
      }

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
      setTimeout(forceRefreshWebcam, 4000);
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

  // setInterval(() => {

  // }, 5000);

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

  // Add a method to automatically speak the first question when interview starts
  useEffect(() => {
    // Initiate the interview by asking the first question based on the interview stage
    if (hasStarted && !aiQuestion) { // Only ask if interview started and no question has been set yet
      // This initial prompt will kick off the AI to ask the first question (Introduction)
      handleChatResponse("Start the interview."); 
    }
  }, [hasStarted, handleChatResponse, aiQuestion]); // Added aiQuestion and handleChatResponse to dependencies

  // Effect to speak the AI's question when it changes
  useEffect(() => {
    if (aiQuestion && !isSpeaking && aiQuestion !== lastSpokenQuestionRef.current) {
      speakAiQuestion();
      lastSpokenQuestionRef.current = aiQuestion; // Update the ref with the newly spoken question
    }
  }, [aiQuestion, isSpeaking, speakAiQuestion]);

  // Cleanup effect
  useEffect(() => {
    const cleanup = () => {
      // console.log('=== CLEANUP ON UNMOUNT ===');

      // Clear auto refresh timeout
      if (forceRefreshTimeoutRef.current) {
        clearTimeout(forceRefreshTimeoutRef.current);
        forceRefreshTimeoutRef.current = null;
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          track.stop();
          // console.log('Cleanup: stopped screen track');
        });
        screenStreamRef.current = null;
      }

      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => {
          track.stop();
          // console.log('Cleanup: stopped webcam track');
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
        // console.log('Cleanup: stopped media recorder');
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

  // Cleanup effect to stop speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Cleanup effect to clear timeout on component unmount
  useEffect(() => {
    return () => {
      // Stop speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }

      // Clear auto-send timeout
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current);
      }
    };
  }, []);

  const startScreenRecording = async () => {
    try {
      if (isScreenRecording) {
        // console.log('Recording already in progress');
        return;
      }

      // console.log('Starting recording...');

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

      // Start webcam separately with auto refresh
      const webcamStream = await startWebcam();

      // console.log('Both streams obtained');
      screenStreamRef.current = screenStream;

      // Create combined stream for recording
      const combinedStream = new MediaStream();

      // Add video tracks
      screenStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
        // console.log('Added screen video track');
      });

      if (webcamStream) {
        webcamStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track);
          // console.log('Added webcam video track');
        });
      }

      // Add only screen audio
      screenStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
        // console.log('Added screen audio track');
      });

      combinedStreamRef.current = combinedStream;

      // Handle screen share stop by user
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      if (screenVideoTrack) {
        screenVideoTrack.onended = () => {
          // console.log('Screen sharing ended by user - stopping recording');
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
          // console.log('Data chunk recorded:', e.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        // console.log('MediaRecorder stopped');
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `interview_recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
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

      // console.log('Recording started successfully');

    } catch (err) {
      console.error("Recording start error:", err);

      // Clean up any streams that were created
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          track.stop();
          // console.log('Stopped screen track on error');
        });
        screenStreamRef.current = null;
      }

      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => {
          track.stop();
          // console.log('Stopped webcam track on error');
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
    // console.log('=== STOPPING SCREEN RECORDING ===');

    try {
      // Clear auto refresh timeout
      if (forceRefreshTimeoutRef.current) {
        clearTimeout(forceRefreshTimeoutRef.current);
        forceRefreshTimeoutRef.current = null;
      }

      if (mediaRecorderRef.current) {
        const state = mediaRecorderRef.current.state;
        // console.log('MediaRecorder state:', state);

        if (state === 'recording') {
          mediaRecorderRef.current.stop();
          // console.log('MediaRecorder stopped');
        }
        mediaRecorderRef.current = null;
      }

      if (screenStreamRef.current) {
        // console.log('Stopping screen sharing tracks...');
        screenStreamRef.current.getTracks().forEach((track, index) => {
          // console.log(`Stopping screen track ${index}:`, track.kind, track.readyState);
          track.stop();
          // console.log(`Screen track ${index} stopped, new state:`, track.readyState);
        });
        screenStreamRef.current = null;
        // console.log('Screen stream cleared');
      }

      if (webcamStreamRef.current) {
        // console.log('Stopping webcam tracks...');
        webcamStreamRef.current.getTracks().forEach((track, index) => {
          // console.log(`Stopping webcam track ${index}:`, track.kind, track.readyState);
          track.stop();
          // console.log(`Webcam track ${index} stopped, new state:`, track.readyState);
        });
        webcamStreamRef.current = null;
        // console.log('Webcam stream cleared');
      }

      if (combinedStreamRef.current) {
        // console.log('Stopping combined stream tracks...');
        combinedStreamRef.current.getTracks().forEach((track, index) => {
          // console.log(`Stopping combined track ${index}:`, track.kind, track.readyState);
          track.stop();
        });
        combinedStreamRef.current = null;
        // console.log('Combined stream cleared');
      }

      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
        webcamRef.current.load();
        // console.log('Webcam video element cleared');
      }

      setIsScreenRecording(false);
      setIsRecording(false);
      setIsTimerRunning(false);
      setWebcamStatus('inactive');

      // console.log('=== ALL RECORDING STOPPED ===');

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

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = () => {
    const totalSeconds = 45 * 60;
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  // Add user activity tracking
  useUserActivityTracker(toast);

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
                <HStack spacing={2} align="center">
                  <Text fontSize="lg">{aiQuestion}</Text>
                  <IconButton
                    icon={isSpeaking ? <FaStop /> : <FaMicrophone />}
                    onClick={speakAiQuestion}
                    colorScheme={isSpeaking ? "red" : "blue"}
                    size="sm"
                    variant="outline"
                    aria-label={isSpeaking ? "Stop Speaking" : "Speak Question"}
                    isDisabled={isSpeaking}
                  />
                </HStack>
              </Box>

              {/* Conversation History */}
              <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto" p={3} bg={cardBg} borderRadius="md" boxShadow="inner">
                {conversationHistory.map((message, index) => (
                  <Flex
                    key={index}
                    justify={message.role === "user" ? "flex-end" : "flex-start"}
                  >
                    <Box
                      bg={message.role === "user" ? "blue.100" : "gray.100"}
                      color={message.role === "user" ? "blue.800" : "gray.800"}
                      px={4}
                      py={2}
                      borderRadius="lg"
                      maxW="70%"
                      boxShadow="sm"
                    >
                      <Text fontSize="sm" fontWeight="bold" mb={1}>
                        {message.role === "user" ? "You" : "AI Interviewer"}
                      </Text>
                      <Text>{message.text}</Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>

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
                {isListening && liveTranscript && (
                  <Box
                    bg="green.50"
                    color="green.800"
                    p={2}
                    borderRadius="md"
                    mt={2}
                    fontSize="sm"
                  >
                    <Text fontWeight="bold">Live Transcript:</Text>
                    <Text>{liveTranscript}</Text>
                  </Box>
                )}
                <HStack mt={3} spacing={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={sendResponse}
                  >
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
                  <IconButton
                    icon={isListening ? <FaStop /> : <FaMicrophone />}
                    colorScheme={isListening ? "red" : "green"}
                    onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                    size="sm"
                    aria-label={isListening ? "Stop Recording" : "Start Recording"}
                  />
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
                      // colorScheme="blue"
                      aria-label="Speak"
                      w="full"
                      colorScheme={isListening ? "red" : "green"}
                      onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                    // onClick={() => setVoiceText("Voice input captured...")}
                    />
                  </Tooltip>

                  {/* Force Refresh Webcam - Only show when loading and needed */}
                  {webcamStatus === 'loading' && (
                    <Tooltip label="Force refresh if stuck on loading">
                      <Button
                        colorScheme="yellow"
                        w="full"
                        leftIcon={<FaCamera />}
                        onClick={forceRefreshWebcam}
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
                    <Text fontSize="sm" color="gray.500">Stage:</Text>
                    <Badge colorScheme="purple">{interviewStage.replace("_", " ").toUpperCase()}</Badge>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.500">Questions:</Text>
                    <Badge>{conversationHistory.filter(msg => msg.role === 'ai' && msg.text.includes("?")).length}</Badge>
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
              // console.log('Video loaded data event');
              if (webcamStatus === 'loading') {
                setWebcamStatus('active');
              }
            }}
            onPlaying={() => {
              // console.log('Video playing event');
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

      {/* User Activity Toast */}
      {/* The useUserActivityTracker hook now manages its own toast */}
    </Box>
  );
};

export default AiHome;