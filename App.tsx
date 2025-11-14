
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TargetIcon, TrophyIcon, GuessIcon } from './components/icons';

const App: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Guess a number between 1 and 100.');
  const [feedbackColor, setFeedbackColor] = useState<string>('text-cyan-400');
  const [guessCount, setGuessCount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(newTarget);
    setUserGuess('');
    setFeedback('Guess a number between 1 and 100.');
    setFeedbackColor('text-cyan-400');
    setGuessCount(0);
    setIsGameOver(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('guessTheNumberHighScore');
    if (storedHighScore) {
      setHighScore(JSON.parse(storedHighScore));
    }
    resetGame();
  }, [resetGame]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value);
  };

  const handleSubmitGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isGameOver || userGuess === '') return;

    const guess = parseInt(userGuess, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      setFeedback('Please enter a valid number between 1 and 100.');
      setFeedbackColor('text-red-500');
      return;
    }

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    if (guess === targetNumber) {
      setFeedback(`🎉 You got it in ${newGuessCount} guesses! 🎉`);
      setFeedbackColor('text-green-400');
      setIsGameOver(true);
      if (highScore === null || newGuessCount < highScore) {
        setHighScore(newGuessCount);
        localStorage.setItem('guessTheNumberHighScore', JSON.stringify(newGuessCount));
      }
    } else if (guess < targetNumber) {
      setFeedback('Too low! Try again.');
      setFeedbackColor('text-yellow-400');
    } else {
      setFeedback('Too high! Try again.');
      setFeedbackColor('text-yellow-400');
    }
    setUserGuess('');
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans p-4 text-white antialiased">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 border border-slate-700">
        <header className="flex items-center justify-center gap-3 mb-6">
          <TargetIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
            Guess the Number
          </h1>
        </header>

        <div className="flex justify-around mb-6 text-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-yellow-400"/>
                <div>
                    <div className="text-sm text-slate-400">High Score</div>
                    <div className="text-xl font-semibold">{highScore === null ? '-' : highScore}</div>
                </div>
            </div>
            <div className="border-l border-slate-700"></div>
            <div className="flex items-center gap-2">
                <GuessIcon className="w-6 h-6 text-fuchsia-400"/>
                <div>
                    <div className="text-sm text-slate-400">Guesses</div>
                    <div className="text-xl font-semibold">{guessCount}</div>
                </div>
            </div>
        </div>

        <div className="h-12 flex items-center justify-center mb-6">
            <p className={`text-lg font-medium text-center transition-colors duration-300 ${feedbackColor}`}>
                {feedback}
            </p>
        </div>

        <form onSubmit={handleSubmitGuess} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="number"
            value={userGuess}
            onChange={handleInputChange}
            placeholder="Your guess..."
            disabled={isGameOver}
            className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-lg text-white text-center text-xl tracking-widest font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {!isGameOver ? (
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={userGuess === ''}
            >
              Submit Guess
            </button>
          ) : (
            <button
              type="button"
              onClick={resetGame}
              className="w-full px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold rounded-lg hover:from-fuchsia-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-fuchsia-500 transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
              Play Again
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;
