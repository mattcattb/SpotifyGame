
// react hooks for game manager stuff

import { useState, useEffect } from 'react';
import GameManager from '../GameManager';
import { getRandomSongs } from '../../../utils/gameUtils';

const defaultConfig = {
  rounds: 5,
  roundTime: 30,
  clipLength: 5,
  choicesPerRound: 10,
};

export function useGameState(accessToken, config = defaultConfig) {
  const [gameManager, setGameManager] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [gameState, setGameState] = useState({
    isLoading: true,
    isPlaying: false,
    isGameOver: false,
    error: null,
  });

  // Initialize game manager
  useEffect(() => {
    const manager = new GameManager(config);
    setGameManager(manager);
    startNewRound(manager);
  }, []);

  const startNewRound = async (manager) => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    try {
      const roundData = await manager.initializeRound(accessToken, getRandomSongs);
      
      if (roundData.gameOver) {
        setGameState({
          isLoading: false,
          isPlaying: false,
          isGameOver: true,
          error: null,
        });
        return;
      }

      setCurrentRound(roundData);
      setGameState({
        isLoading: false,
        isPlaying: true,
        isGameOver: false,
        error: null,
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start round'
      }));
    }
  };

  const submitGuess = (songId) => {
    if (!gameManager || !currentRound) return;

    const timeElapsed = config.roundTime - currentRound.timeRemaining;
    const result = gameManager.submitGuess(songId, timeElapsed);

    if (result.gameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    } else {
      startNewRound(gameManager);
    }

    return result;
  };

  const getGameStats = () => {
    return gameManager?.getRoundStatistics() || null;
  };

  return {
    currentRound,
    gameState,
    submitGuess,
    getGameStats,
  };
}
