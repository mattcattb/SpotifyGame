import { useState, useEffect } from 'react';

export function useGameTimer(initialTime, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer
  }, [timeLeft, onTimeUp]);

  return timeLeft;
}
