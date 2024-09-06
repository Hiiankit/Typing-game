"use client";

import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";

const paragraphs = {
  easy: "Typing can be moderately challenging if we add some complexity",
  medium:
    "The quick brown fox jumps over a lazy dog. This sentence contains every letter in the English alphabet. Typing it helps to practice keyboard layout and improve typing skills. ",
  hard: "As the sun slowly set over the horizon, painting the sky in shades of orange and pink, a gentle breeze whispered through the leaves of the old oak tree. In the distance, the melodious chirping of birds blended with the faint rustle of leaves, creating a symphony of nature’s sounds.",
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
    <div className="p-4 bg-black h-screen  ">
      {/* sellection */}
      <header className="  flex justify-end items-end right-0">
        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="mr-2 font-extrabold text-gray-500 font-serif text-xl"
          >
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="py-1  font-serif text-gray-500 bg-black border-gray-500 font-bold border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </header>

      {/* Display Paragraph */}
      <div className="flex flex-col justify-center items-center  h-full">
        <div className="mb-4 text-wrap flex-wrap w-1/2  p-5 text-gray-500 border-gray-600 border-2 rounded-xl flex">
          {words.map((word, index) => (
            <span
              key={index}
              className={`mr-2 font-serif text-2xl ${
                index < typedWords.length
                  ? typedWords[index] === "correct"
                    ? "text-green-500 font-serif text-2xl"
                    : "text-red-500 font-serif text-2xl"
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
          placeholder="Type..."
          value={currentWord}
          onChange={handleInputChange}
          className={`p-2 rounded-xl border-gray-600 w-1/2  border-2 ${
            currentWord && words[typedWords.length]?.startsWith(currentWord)
              ? "border-green-500"
              : currentWord
              ? "border-red-500"
              : ""
          }`}
          disabled={typedWords.length >= words.length}
          autoFocus
        />

        <div className="mt-4 font-serif text-2xl flex gap-5 text-gray-500">
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
