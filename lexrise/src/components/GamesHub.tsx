"use client";

import { useMemo, useState } from "react";
import {
  confusablePairs,
  cvcWords,
  digraphWords,
  nonsenseSets,
  scrambleSample,
  type PhonicsWord,
} from "@/data/games";

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function scrambleWord(word: string): string {
  if (word.length <= 3) return word;
  const mid = word.slice(1, -1).split("");
  return word[0] + shuffle(mid).join("") + word[word.length - 1];
}

function scrambleText(text: string): string {
  return text
    .split(/(\s+)/)
    .map((part) => (/^[A-Za-z]+$/.test(part) ? scrambleWord(part) : part))
    .join("");
}

export function GamesHub() {
  const [tab, setTab] = useState<"unscramble" | "flip" | "nonsense" | "scramble">("unscramble");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Games">
        {(
          [
            ["unscramble", "Phonics unscramble"],
            ["flip", "Letter flip b/d/p/q"],
            ["nonsense", "Nonsense decode"],
            ["scramble", "Scramble challenge"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="btn btn-secondary min-h-11 px-4 text-sm"
            onClick={() => setTab(id)}
            style={tab === id ? { borderColor: "var(--teal)", background: "rgba(42,157,154,0.14)" } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "unscramble" ? <UnscrambleGame /> : null}
      {tab === "flip" ? <LetterFlipGame /> : null}
      {tab === "nonsense" ? <NonsenseGame /> : null}
      {tab === "scramble" ? <ScrambleChallenge /> : null}
    </div>
  );
}

function UnscrambleGame() {
  const pool = useMemo(() => [...cvcWords, ...digraphWords], []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const current = pool[index % pool.length];

  return (
    <UnscrambleRound
      key={`${index}-${current.word}`}
      current={current}
      score={score}
      onCorrect={() => {
        setScore((s) => s + 1);
        window.setTimeout(() => setIndex((i) => i + 1), 700);
      }}
      onSkip={() => setIndex((i) => i + 1)}
    />
  );
}

function UnscrambleRound({
  current,
  score,
  onCorrect,
  onSkip,
}: {
  current: PhonicsWord;
  score: number;
  onCorrect: () => void;
  onSkip: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [poolLetters, setPoolLetters] = useState(() => shuffle(current.word.split("")));
  const [message, setMessage] = useState(`Sounds: ${current.sounds}`);

  function takeLetter(letter: string, fromIndex: number) {
    setPoolLetters((letters) => letters.filter((_, i) => i !== fromIndex));
    setPicked((letters) => [...letters, letter]);
  }

  function undo() {
    const last = picked[picked.length - 1];
    if (!last) return;
    setPicked((letters) => letters.slice(0, -1));
    setPoolLetters((letters) => [...letters, last]);
  }

  function check() {
    const guess = picked.join("");
    if (guess === current.word) {
      setMessage("Yes! You mapped the sounds to letters.");
      onCorrect();
    } else {
      setMessage("Not yet—say the sounds slowly, then try again.");
    }
  }

  return (
    <div className="panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-[var(--bg-deep)]">Phonics unscramble</h2>
          <p className="text-[var(--ink-soft)]">Hint: {current.hint}</p>
        </div>
        <p className="font-semibold text-[var(--teal)]">Score {score}</p>
      </div>

      <p className="mt-4 text-lg">{message}</p>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Answer slots">
        {Array.from({ length: current.word.length }).map((_, i) => (
          <span key={i} className="slot">
            {picked[i] ?? ""}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Letter tiles">
        {poolLetters.map((letter, i) => (
          <button key={`${letter}-${i}`} type="button" className="tile" onClick={() => takeLetter(letter, i)}>
            {letter}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={undo}>
          Undo
        </button>
        <button type="button" className="btn btn-primary" onClick={check}>
          Check word
        </button>
        <button type="button" className="btn btn-secondary" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}

function LetterFlipGame() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const item = confusablePairs[index % confusablePairs.length];

  function choose(option: string) {
    if (picked) return;
    setPicked(option);
    if (option === item.answer) {
      setScore((s) => s + 1);
      setTimeout(() => {
        setIndex((i) => i + 1);
        setPicked(null);
      }, 650);
    } else {
      setTimeout(() => setPicked(null), 700);
    }
  }

  return (
    <div className="panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-[var(--bg-deep)]">Letter flip</h2>
        <p className="font-semibold text-[var(--teal)]">Score {score}</p>
      </div>
      <p className="mt-3 text-lg">{item.prompt}</p>
      <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
        {item.options.map((option) => {
          let dataState: "correct" | "wrong" | undefined;
          if (picked) {
            if (option === item.answer) dataState = "correct";
            else if (option === picked) dataState = "wrong";
          }
          return (
            <button
              key={option}
              type="button"
              className="choice reading-opendyslexic"
              data-state={dataState}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Say the sound out loud before you tap. Mouth shape helps lock the letter.
      </p>
    </div>
  );
}

function NonsenseGame() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Sound it out—these are not real words.");
  const item = nonsenseSets[index % nonsenseSets.length];

  function check() {
    if (guess.trim().toLowerCase() === item.word) {
      setScore((s) => s + 1);
      setFeedback("Decoded! That is pure phonics skill.");
      setGuess("");
      setIndex((i) => i + 1);
    } else {
      setFeedback(`Listen again: ${item.sounds}`);
    }
  }

  return (
    <div className="panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-[var(--bg-deep)]">Nonsense decode</h2>
        <p className="font-semibold text-[var(--teal)]">Score {score}</p>
      </div>
      <p className="mt-3 text-[var(--ink-soft)]">
        Inspired by apps like Nonsense!—made-up words force decoding instead of memory guessing.
      </p>
      <p className="mt-6 font-display text-4xl tracking-wide text-[var(--bg-deep)]">{item.word}</p>
      <p className="mt-2 text-lg">Sounds: {item.sounds}</p>
      <label className="mt-6 block max-w-md">
        <span className="mb-2 block font-semibold">Type what you hear/see</span>
        <input
          className="control w-full rounded-xl border-2 border-[var(--line)] bg-white px-3 py-3 text-xl"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={check}>
          Check
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setGuess("");
            setIndex((i) => i + 1);
            setFeedback("New nonsense word—decode it.");
          }}
        >
          Next word
        </button>
      </div>
      <p className="mt-4">{feedback}</p>
    </div>
  );
}

function ScrambleChallenge() {
  const scrambled = useMemo(() => scrambleText(scrambleSample), []);
  const [showPlain, setShowPlain] = useState(false);

  return (
    <div className="panel">
      <h2 className="font-display text-2xl text-[var(--bg-deep)]">Scramble challenge</h2>
      <p className="mt-3 rounded-xl bg-[rgba(224,154,62,0.16)] px-4 py-3 text-[var(--ink)]">
        Myth check: viral posts claim “only dyslexic people can read this.” That is false. Most readers can decode
        typoglycemia when first and last letters stay put. It is not a dyslexia test.
      </p>
      <p className="mt-6 text-xl leading-relaxed">{showPlain ? scrambleSample : scrambled}</p>
      <button type="button" className="btn btn-secondary mt-6" onClick={() => setShowPlain((v) => !v)}>
        {showPlain ? "Show scrambled again" : "Reveal clear text"}
      </button>
      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        For real reading growth, use Phonics unscramble and Nonsense decode—or explore Nessy, Starfall, and Nonsense!
        on the Research page.
      </p>
    </div>
  );
}
