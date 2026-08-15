export type PhonicsWord = {
  word: string;
  hint: string;
  sounds: string;
};

export const cvcWords: PhonicsWord[] = [
  { word: "cat", hint: "A pet that meows", sounds: "/k/ /a/ /t/" },
  { word: "dog", hint: "A pet that barks", sounds: "/d/ /o/ /g/" },
  { word: "sun", hint: "Bright in the sky", sounds: "/s/ /u/ /n/" },
  { word: "map", hint: "Shows places", sounds: "/m/ /a/ /p/" },
  { word: "pen", hint: "Writes with ink", sounds: "/p/ /e/ /n/" },
  { word: "bug", hint: "A small insect", sounds: "/b/ /u/ /g/" },
  { word: "hat", hint: "Wear on your head", sounds: "/h/ /a/ /t/" },
  { word: "fin", hint: "Fish use this to swim", sounds: "/f/ /i/ /n/" },
  { word: "box", hint: "A cube container", sounds: "/b/ /o/ /ks/" },
  { word: "red", hint: "A color", sounds: "/r/ /e/ /d/" },
];

export const digraphWords: PhonicsWord[] = [
  { word: "ship", hint: "Sails on water", sounds: "/sh/ /i/ /p/" },
  { word: "chat", hint: "Friendly talk", sounds: "/ch/ /a/ /t/" },
  { word: "thin", hint: "Not thick", sounds: "/th/ /i/ /n/" },
  { word: "fish", hint: "Lives in water", sounds: "/f/ /i/ /sh/" },
  { word: "when", hint: "A time word", sounds: "/w/ /e/ /n/" },
  { word: "shop", hint: "A store", sounds: "/sh/ /o/ /p/" },
];

export const confusablePairs = [
  { prompt: "Which letter says /b/ as in bat?", options: ["b", "d"], answer: "b" },
  { prompt: "Which letter says /d/ as in dog?", options: ["b", "d"], answer: "d" },
  { prompt: "Which letter says /p/ as in pen?", options: ["p", "q"], answer: "p" },
  { prompt: "Which letter says /kw/ as in queen?", options: ["p", "q"], answer: "q" },
  { prompt: "Pick the letter for the start of bed", options: ["b", "d"], answer: "b" },
  { prompt: "Pick the letter for the start of dig", options: ["b", "d"], answer: "d" },
  { prompt: "Pick the letter for the start of pig", options: ["p", "q"], answer: "p" },
  { prompt: "Pick the letter for the start of quiz", options: ["p", "q"], answer: "q" },
];

export const nonsenseSets = [
  { word: "vap", sounds: "/v/ /a/ /p/" },
  { word: "mig", sounds: "/m/ /i/ /g/" },
  { word: "zod", sounds: "/z/ /o/ /d/" },
  { word: "teb", sounds: "/t/ /e/ /b/" },
  { word: "shup", sounds: "/sh/ /u/ /p/" },
  { word: "thig", sounds: "/th/ /i/ /g/" },
  { word: "blim", sounds: "/b/ /l/ /i/ /m/" },
  { word: "frep", sounds: "/f/ /r/ /e/ /p/" },
];

/** Sample paragraph for typoglycemia scramble (myth-bust demo). */
export const scrambleSample =
  "Dyslexia is a difference in how the brain processes written language. With the right practice, many people become strong readers and creative thinkers.";
