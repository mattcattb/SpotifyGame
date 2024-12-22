// gameManager.js
class GameManager {
    constructor(config) {
      this.config = {
        rounds: config.rounds || 5,
        roundTime: config.roundTime || 30,
        clipLength: config.clipLength || 5,
        choicesPerRound: config.choicesPerRound || 10
      };
      
      this.currentRound = 0;
      this.score = 0;
      this.gameHistory = [];
    }
  
    async initializeRound(spotifyToken, fetchSongsCallback) {
      // setup a new round
      if (this.currentRound >= this.config.rounds) {
        return { gameOver: true, finalScore: this.score };
      }
  
      const roundSongs = await fetchSongsCallback(spotifyToken, this.config.choicesPerRound);
      const correctSong = roundSongs[Math.floor(Math.random() * roundSongs.length)];
      
      const roundData = {
        roundNumber: this.currentRound + 1,
        choices: roundSongs,
        correctSong,
        timeStarted: Date.now(),
        timeRemaining: this.config.roundTime,
      };
  
      this.gameHistory.push({
        round: this.currentRound + 1,
        correctSong,
        startTime: Date.now()
      });
  
      return roundData;
    }
  
    submitGuess(songId, timeElapsed) {
      // submits a guess that is song id, and returns if correct and game information
      const currentRoundData = this.gameHistory[this.currentRound];
      const isCorrect = songId === currentRoundData.correctSong.id;
      
      // Calculate score based on speed and accuracy
      const timeBonus = Math.max(0, this.config.roundTime - timeElapsed);
      const roundScore = isCorrect ? 100 + timeBonus : 0;
      
      this.score += roundScore;
      
      // Update round history
      currentRoundData.guess = {
        songId,
        timeElapsed,
        isCorrect,
        score: roundScore
      };
      
      this.currentRound++;
      
      return {
        isCorrect,
        roundScore,
        totalScore: this.score,
        gameOver: this.currentRound >= this.config.rounds
      };
    }
  
    getRoundStatistics() {
      // return all info on round
      return {
        currentRound: this.currentRound,
        totalRounds: this.config.rounds,
        currentScore: this.score,
        history: this.gameHistory,
        averageResponseTime: this.calculateAverageResponseTime(),
        accuracy: this.calculateAccuracy()
      };
    }
  
    calculateAverageResponseTime() {
      // data on match stuff
      const completedRounds = this.gameHistory.filter(round => round.guess);
      if (completedRounds.length === 0) return 0;
      
      const totalTime = completedRounds.reduce((sum, round) => sum + round.guess.timeElapsed, 0);
      return totalTime / completedRounds.length;
    }
  
    calculateAccuracy() {
      // more data on class stuff
      const completedRounds = this.gameHistory.filter(round => round.guess);
      if (completedRounds.length === 0) return 0;
      
      const correctGuesses = completedRounds.filter(round => round.guess.isCorrect).length;
      return (correctGuesses / completedRounds.length) * 100;
    }
  }
  
  export default GameManager;