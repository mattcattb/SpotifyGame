import React, { useEffect, useState } from 'react';
import { getRandomSongs } from '../utils/gameUtils';  // Assume this fetches songs based on user's library

const game_config = {
  rounds: 5,
  round_time: 30, // how many seconds each round lasts
  clip_length: 5, // seconds of clip
  choices: 10, // number of other song choices
};

const GamePage = ({ accessToken }) => {
  const [choices, setChoices] = useState([]); // array of song choices for the current round
  const [correctSong, setCorrectSong] = useState(null);
  const [curRound, setCurRound] = useState(0); // current round number
  const [timeLeft, setTimeLeft] = useState(game_config.round_time); // countdown timer for round
  const [playingClip, setPlayingClip] = useState(false); // flag to indicate if the clip is playing
  const [userGuess, setUserGuess] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  

  // Fetch a random selection of songs for the current round
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true); // Start loading
      try {
        if (curRound < game_config.rounds) {
          const songs = await getRandomSongs(accessToken, game_config.choices);
          console.log("Fetched songs: ", songs);
          setChoices(songs);
  
          const randomSong = songs[Math.floor(Math.random() * songs.length)];
          setCorrectSong(randomSong);
          console.log("Correct song: ", randomSong);
          setPlayingClip(true);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetch completes
      }
    };
  
    fetchSongs();
  }, [curRound, accessToken]);

  useEffect(() => {
    console.log("Choices updated: ", choices);
  }, [choices]);
  

  // Timer for each round
  useEffect(() => {
    if (playingClip) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1); // Decrease time left by 1 every second
      }, 1000);

      // Cleanup the timer once it reaches 0
      return () => clearInterval(timer);
    }
  }, [playingClip]);

  // When the timer finishes, move to the next round
  const handleTimerFinish = () => {
    setIsLoading(true)
    if (curRound < game_config.rounds - 1) {
      // Check user's guess (optional: you can give feedback here)
      if (userGuess === correctSong.name) {
        console.log('Correct guess!');
      } else {
        console.log('Wrong guess!');
      }

      // Proceed to the next round
      setCurRound((prev) => prev + 1);
      setTimeLeft(game_config.round_time); // Reset timer
      setPlayingClip(false); // Stop playing clip
      setUserGuess(null); // Reset the guess for the next round
    } else {
      console.log("Game Over!");
    }
    setIsLoading(false);
  };

  // Display choices and move to next round automatically when the timer ends
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimerFinish(); // Automatically go to the next round
    }
  }, [timeLeft]);

  // Handle user's guess
  const handleGuess = (song) => {
    setUserGuess(song.name); // Set the user's guess
  };

  return (
    <div>
      <h2>Game</h2>
      <p>Round {curRound + 1} of {game_config.rounds}</p>
      <p>Time Left: {timeLeft}s</p>
      {isLoading ? (
        <p>Loading stuff...</p>
      ) : (
      <div>
        { playingClip && audioUrl}
        <p>Playing clip... {game_config.clip_length} seconds</p> 
        <div>
          <p>Choose the song:</p>
          {choices.map((song) => (
            <button key={song.id} onClick={() => handleGuess(song)}>
              {song.name}
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
  
};


export default GamePage;
