"use client";

import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";

const paragraphs = {
  easy: "This is an easy typing test",
  medium: "Typing can be moderately challenging if we add some complexity",
  hard: "Typing games can include complex punctuation, grammar, and less common vocabulary.",
};

const Game = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    setWords(paragraphs[difficulty].split(" "));
    setTypedWords([]);
    setCurrentWord("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
  }, [difficulty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.endsWith(" ")) {
      const word = input.trim();
      const isCorrect = word === words[typedWords.length];

      setTypedWords([...typedWords, isCorrect ? "correct" : "incorrect"]);

      setAccuracy(
        (prev) =>
          (prev * typedWords.length + (isCorrect ? 100 : 0)) /
          (typedWords.length + 1)
      );

      setCurrentWord("");
    } else {
      setCurrentWord(input);
    }

    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Calculate WPM
    const speed = (Date.now() - (startTime || 0)) / 60000; // Time in minutes
    setWpm(Math.floor((typedWords.length + 1) / speed));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* sellection */}
      <div className="mb-4">
        <label
          htmlFor="difficulty"
          className="mr-2  font-extrabold font-serif text-3xl"
        >
          Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="p-2 border rounded "
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Display Paragraph */}
      <div className="mb-4 md: ">
        {words.map((word, index) => (
          <span
            key={index}
            className={`mr-2 ${
              index < typedWords.length
                ? typedWords[index] === "correct"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Typing Input */}
      <input
        type="text"
        value={currentWord}
        onChange={handleInputChange}
        className={`p-2 border rounded w-full ${
          currentWord && words[typedWords.length]?.startsWith(currentWord)
            ? "border-green-500"
            : currentWord
            ? "border-red-500"
            : ""
        }`}
        disabled={typedWords.length >= words.length}
        autoFocus
      />

      <div className="mt-4">
        <p>WPM: {wpm}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default Game;
