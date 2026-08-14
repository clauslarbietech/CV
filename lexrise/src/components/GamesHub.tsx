"use client";

import { useMemo, useState } from "react";
import { recordAttempt } from "@/lib/hero/store";
import {
  confusablePairs,
  cvcWords,
  digraphWords,
  nonsenseSets,
  scrambleSample,
  type PhonicsWord,
} from "@/data/games";

type GameTab = "unscramble" | "flip" | "nonsense" | "scramble";

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

export function GamesHub({ initialTab = "unscramble" }: { initialTab?: GameTab }) {
  const [tab, setTab] = useState<GameTab>(initialTab);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Games">
        {(
          [
            ["unscramble", "Unscramble"],
            ["flip", "Letter flip"],
            ["nonsense", "Nonsense"],
            ["scramble", "Scramble"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="btn btn-ghost min-h-10 px-4 text-sm"
            onClick={() => setTab(id)}
            style={
              tab === id
                ? { background: "rgba(255,122,61,0.18)", borderColor: "rgba(255,122,61,0.45)" }
                : undefined
            }
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
      recordAttempt({
        exerciseId: "unscramble",
        skill: "decoding",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
      onCorrect();
    } else {
      setMessage("Not yet—say the sounds slowly, then try again.");
    }
  }

  return (
    <div className="panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Phonics unscramble</h2>
          <p className="text-[var(--ink-muted)]">Hint: {current.hint}</p>
        </div>
        <p className="font-semibold text-[var(--accent)]">Score {score}</p>
      </div>

      <p className="mt-4">{message}</p>

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
        <button type="button" className="btn btn-ghost" onClick={undo}>
          Undo
        </button>
        <button type="button" className="btn btn-accent" onClick={check}>
          Check word
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSkip}>
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
      recordAttempt({
        exerciseId: "letter-flip",
        skill: "mapping",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
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
        <h2 className="text-xl font-bold">Letter flip</h2>
        <p className="font-semibold text-[var(--accent)]">Score {score}</p>
      </div>
      <p className="mt-3">{item.prompt}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
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
      recordAttempt({
        exerciseId: "nonsense",
        skill: "decoding",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
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
        <h2 className="text-xl font-bold">Nonsense decode</h2>
        <p className="font-semibold text-[var(--accent)]">Score {score}</p>
      </div>
      <p className="mt-3 text-[var(--ink-muted)]">Made-up words force decoding instead of guessing.</p>
      <p className="mt-6 text-4xl font-bold tracking-wide">{item.word}</p>
      <p className="mt-2">Sounds: {item.sounds}</p>
      <label className="mt-6 block">
        <span className="mb-2 block font-semibold">Type what you see</span>
        <input
          className="control"
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
        <button type="button" className="btn btn-accent" onClick={check}>
          Check
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setGuess("");
            setIndex((i) => i + 1);
            setFeedback("New nonsense word—decode it.");
          }}
        >
          Next word
        </button>
      </div>
      <p className="mt-4 text-[var(--ink-soft)]">{feedback}</p>
    </div>
  );
}

function ScrambleChallenge() {
  const scrambled = useMemo(() => scrambleText(scrambleSample), []);
  const [showPlain, setShowPlain] = useState(false);

  return (
    <div className="panel">
      <h2 className="text-xl font-bold">Scramble challenge</h2>
      <p className="mt-3 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm">
        Myth check: “Only dyslexic people can read this” is false. Most readers can decode scrambled words when
        first and last letters stay put.
      </p>
      <p className="mt-6 text-lg leading-relaxed">{showPlain ? scrambleSample : scrambled}</p>
      <button type="button" className="btn btn-ghost mt-6" onClick={() => setShowPlain((v) => !v)}>
        {showPlain ? "Show scrambled again" : "Reveal clear text"}
      </button>
    </div>
  );
}
