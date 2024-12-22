import { useGameState } from '../features/game/hooks/useGameState';
// pages/GamePage.jsx
import { useSpotifyPlayer, useGameTimer } from '../hooks';
import { useCallback, useEffect } from 'react';

// Updated GamePage.jsx
const GamePage = ({ accessToken }) => {
  const {
    currentRound,
    gameState,
    submitGuess,
    getGameStats
  } = useGameState(accessToken);

  const { isReady, playSongClip } = useSpotifyPlayer(accessToken);
  
  const handleTimeUp = useCallback(() => {
    submitGuess(null); // Auto-submit when time is up
  }, [submitGuess]);

  const timeLeft = useGameTimer(
    currentRound?.timeRemaining || 30,
    handleTimeUp
  );

  // Play the clip when round starts
  useEffect(() => {
    if (isReady && currentRound?.correctSong) {
      playSongClip(
        currentRound.correctSong.uri,
        30000, // Start 30 seconds into the song
        5000   // Play for 5 seconds
      );
    }
  }, [isReady, currentRound, playSongClip]);

  const handleSongGuess = (song) => {
    const result = submitGuess(song.id);
    // Handle the result (show feedback, update score, etc.)
    console.log("guess just happened! this is the result: ", result)
  };

  if (gameState.isLoading) {
    return <div>Loading...</div>;
  }

  if (gameState.error) {
    return <div>Error: {gameState.error}</div>;
  }

  if (gameState.isGameOver) {
    const stats = getGameStats();
    return (
      <div>
        <h2>Game Over!</h2>
        <p>Final Score: {stats.currentScore}</p>
        <p>Accuracy: {stats.accuracy.toFixed(1)}%</p>
        <p>Average Response Time: {stats.averageResponseTime.toFixed(1)}s</p>
        {/* Add replay button or other end-game options */}
      </div>
    );
  }

  return (
    <div>
      <h2>Round {currentRound?.roundNumber} of {getGameStats()?.totalRounds}</h2>
      <p>Score: {getGameStats()?.currentScore}</p>
      <p>Time Left: {timeLeft}</p>
      
      <div>
        {currentRound?.correctSong && (
          <div>
            {/* Add your audio player component here */}
            <p>Playing clip... {currentRound.clipLength} seconds</p>
          </div>
        )}
        
        <div>
          <p>Choose the song:</p>
          {currentRound?.choices.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSongGuess(song)}
            >
              {song.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;