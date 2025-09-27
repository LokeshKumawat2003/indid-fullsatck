import { useState, useEffect, useCallback } from 'react';

export const useUserActivityTracker = (toast) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [hasShownToast, setHasShownToast] = useState(false);

  const handleMouseMove = useCallback((event) => {
    const currentTime = Date.now();
    const { clientX, clientY } = event;

    // Check if mouse has moved significantly
    const hasMoved = 
      Math.abs(clientX - mousePosition.x) > 50 || 
      Math.abs(clientY - mousePosition.y) > 50;

    if (hasMoved) {
      setMousePosition({ x: clientX, y: clientY });
      setLastMoveTime(currentTime);
      setHasShownToast(false);
    }
  }, [mousePosition]);

  useEffect(() => {
    // Only proceed if toast function is provided
    if (!toast) return;

    // Set up mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    // Check for inactivity every second
    const inactivityCheck = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMoveTime;

      // If mouse hasn't moved significantly for more than 2 seconds
      // and toast hasn't been shown yet
      if (timeSinceLastMove > 2000 && !hasShownToast) {
        toast({
          title: "Activity Check",
          description: "Are you still there? Please continue with your interview.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        setHasShownToast(true);
      }
    }, 1000);

    // Cleanup listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(inactivityCheck);
    };
  }, [handleMouseMove, lastMoveTime, toast, hasShownToast]);

  return {};
};
