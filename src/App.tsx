import { useEffect, useState, useCallback } from "react";
import words from "./wordList.json";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";

  
function getWord() {
  return words[Math.floor(Math.random() * words.length)];
};
function App() {
  const [wordToGuess, setWordToGuess] = useState((getWord));



  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  );

  const correctLetters = guessedLetters.filter(
    letter => wordToGuess.includes(letter)
  );
const isLoser = incorrectLetters.length >= 6
const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))


  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters,isWinner,isLoser]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      console.log(`Key pressed: ${key}`); // Debugging line
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [addGuessedLetter]);

  useEffect(() => {
    console.log('Guessed letters:', guessedLetters); // Debugging line
  }, [guessedLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      console.log(`Key pressed: ${key}`); // Debugging line
      if (key !== "Enter") return;


      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord() )
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding:"30px 0",
          fontSize: "2rem",
          color: "#b015a1",
          fontWeight:"bold",
          textAlign: "center",
        }}
      >
      {isWinner && "HEHEHE! -Not gunna take it easy on my haters..."}
      {isLoser && "HaHaHa! -Smh, You can try again sha Loser..."}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord 
      reveal = {isLoser}
      guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
        disabled = {isWinner || isLoser}
          activeLetters={correctLetters}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
