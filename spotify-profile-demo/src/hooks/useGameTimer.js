// src/hooks/useGameTimer.js
import { useState, useEffect, useRef } from 'react';

export function useGameTimer(initialTime, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(initialTime);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialTime, onTimeUp]);

  return timeLeft;
}