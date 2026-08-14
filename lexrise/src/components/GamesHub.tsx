"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import {
  confusablePairs,
  cvcWords,
  digraphWords,
  nonsenseSets,
  scrambleSample,
  type PhonicsWord,
} from "@/data/games";
import {
  fluencyPassages,
  morphologyItems,
  phonemeItems,
  spellingItems,
  syllableItems,
} from "@/data/literacy";
import { recordAttempt } from "@/lib/hero/store";
import { speakPhonemeSequence, speakText } from "@/lib/hero/speech";
import { useHeroProfile } from "@/hooks/useHeroProfile";

type GameTab =
  | "phonemic"
  | "mapping"
  | "decoding"
  | "nonsense"
  | "morphology"
  | "syllables"
  | "spelling"
  | "fluency"
  | "scramble";

const TABS: { id: GameTab; label: string; skill: string }[] = [
  { id: "phonemic", label: "Sounds", skill: "phonemic" },
  { id: "mapping", label: "Letters", skill: "mapping" },
  { id: "decoding", label: "Words", skill: "decoding" },
  { id: "nonsense", label: "Nonsense", skill: "decoding" },
  { id: "morphology", label: "Word Parts", skill: "morphology" },
  { id: "syllables", label: "Syllables", skill: "syllables" },
  { id: "spelling", label: "Spelling", skill: "spelling" },
  { id: "fluency", label: "Fluency", skill: "fluency" },
  { id: "scramble", label: "Myth check", skill: "decoding" },
];

const SKILL_TO_TAB: Record<string, GameTab> = {
  phonemic: "phonemic",
  mapping: "mapping",
  decoding: "decoding",
  nonsense: "nonsense",
  morphology: "morphology",
  syllables: "syllables",
  spelling: "spelling",
  fluency: "fluency",
  scramble: "scramble",
};

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

export function GamesHub({ initialTab = "decoding" }: { initialTab?: GameTab }) {
  const params = useSearchParams();
  const skill = params.get("skill");
  const fromSkill = skill ? SKILL_TO_TAB[skill] : undefined;
  const [tab, setTab] = useState<GameTab>(fromSkill ?? initialTab);
  const [skillKey, setSkillKey] = useState(skill ?? "");
  if ((skill ?? "") !== skillKey) {
    setSkillKey(skill ?? "");
    if (fromSkill) setTab(fromSkill);
  }

  return (
    <div>
      <p className="science-practice-note">
        Structured Literacy practice — explicit instruction, not discovery-only guessing.
      </p>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Literacy practice">
        {TABS.map(({ id, label }) => (
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

      {tab === "phonemic" ? <PhonemeGame /> : null}
      {tab === "mapping" ? <LetterFlipGame /> : null}
      {tab === "decoding" ? <UnscrambleGame /> : null}
      {tab === "nonsense" ? <NonsenseGame /> : null}
      {tab === "morphology" ? <MorphologyGame /> : null}
      {tab === "syllables" ? <SyllableGame /> : null}
      {tab === "spelling" ? <SpellingGame /> : null}
      {tab === "fluency" ? <FluencyPractice /> : null}
      {tab === "scramble" ? <ScrambleChallenge /> : null}
    </div>
  );
}

function ScoreHeader({ title, score, tier }: { title: string; score: number; tier: "evidence-based" | "evidence-informed" }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <ScienceBadge tier={tier} compact />
      </div>
      <p className="font-semibold text-[var(--accent)]">Score {score}</p>
    </div>
  );
}

function PhonemeGame() {
  const profile = useHeroProfile();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const item = phonemeItems[index % phonemeItems.length];
  const answer = item.answer;

  function hear() {
    speakPhonemeSequence(item.phonemes, {
      rate: profile.tts.rate * 0.85,
      soundOff: profile.experience.soundOff,
    });
  }

  function choose(option: string) {
    if (picked) return;
    setPicked(option);
    const correct = option === answer;
    if (correct) {
      setScore((s) => s + 1);
      recordAttempt({
        exerciseId: "phoneme",
        skill: "phonemic",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
      window.setTimeout(() => {
        setIndex((i) => i + 1);
        setPicked(null);
      }, 700);
    } else {
      window.setTimeout(() => setPicked(null), 700);
    }
  }

  return (
    <div className="panel">
      <ScoreHeader title="Sound Quest" score={score} tier="evidence-based" />
      <p className="mt-3 text-[var(--ink-muted)]">Hear the sounds in words—phonological awareness.</p>
      <p className="mt-4 text-lg font-semibold">{item.prompt}</p>
      <p className="mt-2 text-[var(--ink-soft)]">Word: {item.word}</p>
      <button type="button" className="btn btn-ghost mt-3" onClick={hear}>
        Hear the sounds
      </button>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {item.options.map((option) => {
          let dataState: "correct" | "wrong" | undefined;
          if (picked) {
            if (option === answer) dataState = "correct";
            else if (option === picked) dataState = "wrong";
          }
          return (
            <button key={option} type="button" className="choice" data-state={dataState} onClick={() => choose(option)}>
              {option}
            </button>
          );
        })}
      </div>
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
  const profile = useHeroProfile();
  const [picked, setPicked] = useState<string[]>([]);
  const [poolLetters, setPoolLetters] = useState(() => shuffle(current.word.split("")));
  const [message, setMessage] = useState(`Sounds: ${current.sounds}`);

  function hear() {
    speakText(current.sounds.replace(/\//g, " "), {
      rate: profile.tts.rate * 0.8,
      soundOff: profile.experience.soundOff,
    });
  }

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
      <ScoreHeader title="Word Builder" score={score} tier="evidence-based" />
      <p className="text-[var(--ink-muted)]">Hint: {current.hint}</p>
      <p className="mt-4">{message}</p>
      <button type="button" className="btn btn-ghost" onClick={hear}>
        Hear sounds
      </button>
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
      <ScoreHeader title="Letter Match" score={score} tier="evidence-based" />
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
      <ScoreHeader title="Nonsense Decode" score={score} tier="evidence-based" />
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

function MorphologyGame() {
  const profile = useHeroProfile();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const item = morphologyItems[index % morphologyItems.length];
  const [picked, setPicked] = useState<string[]>([]);
  const [pool, setPool] = useState(() => shuffle(item.parts));
  const [message, setMessage] = useState(item.meaning);

  const wordKey = item.word;
  const [prevWord, setPrevWord] = useState(wordKey);
  if (prevWord !== wordKey) {
    setPrevWord(wordKey);
    setPicked([]);
    setPool(shuffle(item.parts));
    setMessage(item.meaning);
  }

  function hear() {
    speakText(item.word, { rate: profile.tts.rate, soundOff: profile.experience.soundOff });
  }

  function take(part: string, fromIndex: number) {
    setPool((parts) => parts.filter((_, i) => i !== fromIndex));
    setPicked((parts) => [...parts, part]);
  }

  function undo() {
    const last = picked[picked.length - 1];
    if (!last) return;
    setPicked((parts) => parts.slice(0, -1));
    setPool((parts) => [...parts, last]);
  }

  function check() {
    if (picked.join("") === item.answer.join("")) {
      setMessage(`Yes — ${item.word} = ${item.answer.join(" + ")}`);
      setScore((s) => s + 1);
      recordAttempt({
        exerciseId: "morphology",
        skill: "morphology",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
      window.setTimeout(() => setIndex((i) => i + 1), 800);
    } else {
      setMessage("Try again — think about prefix, root, and suffix.");
    }
  }

  return (
    <div className="panel">
      <ScoreHeader title="Word Parts" score={score} tier="evidence-based" />
      <p className="mt-3 text-[var(--ink-muted)]">Morphology: meaningful pieces of words (un + help + ful).</p>
      <p className="mt-4 text-2xl font-bold tracking-wide">{item.word}</p>
      <p className="mt-2">{message}</p>
      <button type="button" className="btn btn-ghost mt-2" onClick={hear}>
        Hear word
      </button>
      <div className="mt-5 flex flex-wrap gap-2">
        {picked.map((part, i) => (
          <span key={`${part}-${i}`} className="slot morph-slot">
            {part}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((part, i) => (
          <button key={`${part}-${i}`} type="button" className="tile" onClick={() => take(part, i)}>
            {part}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" onClick={undo}>
          Undo
        </button>
        <button type="button" className="btn btn-accent" onClick={check}>
          Check parts
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setIndex((i) => i + 1)}>
          Skip
        </button>
      </div>
    </div>
  );
}

function SyllableGame() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const item = syllableItems[index % syllableItems.length];
  const [picked, setPicked] = useState<string[]>([]);
  const [pool, setPool] = useState(() => shuffle(item.syllables));
  const wordKey = item.word;
  const [prevWord, setPrevWord] = useState(wordKey);
  if (prevWord !== wordKey) {
    setPrevWord(wordKey);
    setPicked([]);
    setPool(shuffle(item.syllables));
  }

  function take(part: string, fromIndex: number) {
    setPool((parts) => parts.filter((_, i) => i !== fromIndex));
    setPicked((parts) => [...parts, part]);
  }

  function check() {
    if (picked.join("-") === item.syllables.join("-")) {
      setScore((s) => s + 1);
      recordAttempt({
        exerciseId: "syllables",
        skill: "syllables",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
      window.setTimeout(() => setIndex((i) => i + 1), 700);
    }
  }

  return (
    <div className="panel">
      <ScoreHeader title="Syllable Split" score={score} tier="evidence-based" />
      <p className="mt-3 text-[var(--ink-muted)]">Pattern: {item.pattern}</p>
      <p className="mt-4 text-3xl font-bold">{item.word}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {picked.map((part, i) => (
          <span key={`${part}-${i}`} className="slot morph-slot">
            {part}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((part, i) => (
          <button key={`${part}-${i}`} type="button" className="tile" onClick={() => take(part, i)}>
            {part}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            const last = picked[picked.length - 1];
            if (!last) return;
            setPicked((p) => p.slice(0, -1));
            setPool((p) => [...p, last]);
          }}
        >
          Undo
        </button>
        <button type="button" className="btn btn-accent" onClick={check}>
          Check syllables
        </button>
      </div>
    </div>
  );
}

function SpellingGame() {
  const profile = useHeroProfile();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("Listen to the sounds, then spell.");
  const item = spellingItems[index % spellingItems.length];

  function hear() {
    speakText(item.sounds.replace(/\//g, " "), {
      rate: profile.tts.rate * 0.8,
      soundOff: profile.experience.soundOff,
    });
  }

  function check() {
    if (guess.trim().toLowerCase() === item.answer) {
      setScore((s) => s + 1);
      recordAttempt({
        exerciseId: "spelling",
        skill: "spelling",
        correct: true,
        responseMs: 0,
        hintsUsed: 0,
      });
      setFeedback(`Correct — ${item.pattern} pattern.`);
      setGuess("");
      setIndex((i) => i + 1);
    } else {
      setFeedback(`Try again. Sounds: ${item.sounds}`);
    }
  }

  return (
    <div className="panel">
      <ScoreHeader title="Spelling Lab" score={score} tier="evidence-based" />
      <p className="mt-3">{item.prompt}</p>
      <p className="mt-2 text-[var(--ink-muted)]">Sounds: {item.sounds}</p>
      <button type="button" className="btn btn-ghost mt-2" onClick={hear}>
        Hear sounds
      </button>
      <label className="mt-6 block">
        <span className="mb-2 block font-semibold">Type the spelling</span>
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
          Check spelling
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setIndex((i) => i + 1)}>
          Skip
        </button>
      </div>
      <p className="mt-4 text-[var(--ink-soft)]">{feedback}</p>
    </div>
  );
}

function FluencyPractice() {
  const [index, setIndex] = useState(0);
  const [reps, setReps] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showComp, setShowComp] = useState(false);
  const [compPicked, setCompPicked] = useState<string | null>(null);
  const started = useRef<number | null>(null);
  const passage = fluencyPassages[index % fluencyPassages.length];

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (started.current) setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    started.current = Date.now();
    setElapsed(0);
    setRunning(true);
    setShowComp(false);
    setCompPicked(null);
  }

  function finish() {
    setRunning(false);
    setReps((r) => r + 1);
    setShowComp(true);
    recordAttempt({
      exerciseId: "fluency",
      skill: "fluency",
      correct: true,
      responseMs: elapsed * 1000,
      hintsUsed: 0,
    });
  }

  function answerComp(option: string) {
    if (compPicked) return;
    setCompPicked(option);
    const correct = option === passage.comprehension.answer;
    recordAttempt({
      exerciseId: "fluency-comp",
      skill: "comprehension",
      correct,
      responseMs: 0,
      hintsUsed: 0,
    });
  }

  return (
    <div className="panel">
      <ScoreHeader title="Reader Flow" score={reps} tier="evidence-informed" />
      <p className="mt-3 text-[var(--ink-muted)]">
        Read the passage again for accuracy and ease. Time is optional—never a punishment.
      </p>
      <h3 className="mt-4 text-lg font-bold">{passage.title}</h3>
      <p className="mt-3 text-lg leading-relaxed">{passage.text}</p>
      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        {passage.wordCount} words · gentle pace ~{passage.gentlePaceSec}s (optional)
      </p>
      {running ? <p className="mt-2 font-semibold">{elapsed}s</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {!running ? (
          <button type="button" className="btn btn-accent" onClick={start}>
            Start reading
          </button>
        ) : (
          <button type="button" className="btn btn-white" onClick={finish}>
            I finished this pass
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setRunning(false);
            setElapsed(0);
            setShowComp(false);
            setCompPicked(null);
            setIndex((i) => i + 1);
          }}
        >
          Next passage
        </button>
      </div>
      {showComp ? (
        <div className="mt-6">
          <p className="font-semibold">{passage.comprehension.prompt}</p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {passage.comprehension.options.map((option) => {
              let dataState: "correct" | "wrong" | undefined;
              if (compPicked) {
                if (option === passage.comprehension.answer) dataState = "correct";
                else if (option === compPicked) dataState = "wrong";
              }
              return (
                <button key={option} type="button" className="choice" data-state={dataState} onClick={() => answerComp(option)}>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <p className="mt-4 text-[var(--ink-soft)]">Completed passes: {reps}</p>
    </div>
  );
}

function ScrambleChallenge() {
  const scrambled = useMemo(() => scrambleText(scrambleSample), []);
  const [showPlain, setShowPlain] = useState(false);

  return (
    <div className="panel">
      <h2 className="text-xl font-bold">Scramble challenge</h2>
      <ScienceBadge tier="evidence-informed" compact />
      <p className="mt-3 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm">
        Myth check: “Only dyslexic people can read this” is false. Most readers can decode scrambled words when
        first and last letters stay put. Real progress comes from Structured Literacy—not viral quizzes.
      </p>
      <p className="mt-6 text-lg leading-relaxed">{showPlain ? scrambleSample : scrambled}</p>
      <button type="button" className="btn btn-ghost mt-6" onClick={() => setShowPlain((v) => !v)}>
        {showPlain ? "Show scrambled again" : "Reveal clear text"}
      </button>
    </div>
  );
}
