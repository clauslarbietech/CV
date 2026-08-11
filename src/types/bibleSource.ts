export type BibleSource =
  | { kind: "youversion"; versionId: number; abbreviation: string }
  | { kind: "esv"; abbreviation: "ESV" };
