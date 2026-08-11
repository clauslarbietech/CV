import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDeviceId } from "./deviceId";

const MESSAGES_KEY = "journey:chapter-messages:v1";

export type ChapterMessageKind = "text" | "voice";

export type ChapterMessage = {
  id: string;
  groupId: string;
  bookId: string;
  chapterNumber: number;
  kind: ChapterMessageKind;
  body?: string;
  voiceUri?: string;
  voiceDurationSeconds?: number;
  authorDeviceId: string;
  authorLabel: string;
  createdAt: string;
  read: boolean;
};

type MessageStore = Record<string, ChapterMessage[]>;

function threadKey(groupId: string, bookId: string, chapterNumber: number): string {
  return `${groupId}:${bookId}:${chapterNumber}`;
}

async function readStore(): Promise<MessageStore> {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as MessageStore;
  } catch {
    return {};
  }
}

async function writeStore(store: MessageStore): Promise<void> {
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(store));
}

function newId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listChapterMessages(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
}): Promise<ChapterMessage[]> {
  const store = await readStore();
  const key = threadKey(input.groupId, input.bookId, input.chapterNumber);
  return (store[key] ?? []).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addTextMessage(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
  body: string;
  authorLabel?: string;
}): Promise<ChapterMessage> {
  const trimmed = input.body.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }

  const deviceId = await getDeviceId();
  const message: ChapterMessage = {
    id: newId(),
    groupId: input.groupId,
    bookId: input.bookId,
    chapterNumber: input.chapterNumber,
    kind: "text",
    body: trimmed,
    authorDeviceId: deviceId,
    authorLabel: input.authorLabel ?? "You",
    createdAt: new Date().toISOString(),
    read: true,
  };

  const store = await readStore();
  const key = threadKey(input.groupId, input.bookId, input.chapterNumber);
  store[key] = [...(store[key] ?? []), message];
  await writeStore(store);
  return message;
}

export async function addVoiceMessage(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
  voiceUri: string;
  voiceDurationSeconds: number;
  authorLabel?: string;
}): Promise<ChapterMessage> {
  const deviceId = await getDeviceId();
  const message: ChapterMessage = {
    id: newId(),
    groupId: input.groupId,
    bookId: input.bookId,
    chapterNumber: input.chapterNumber,
    kind: "voice",
    voiceUri: input.voiceUri,
    voiceDurationSeconds: input.voiceDurationSeconds,
    authorDeviceId: deviceId,
    authorLabel: input.authorLabel ?? "You",
    createdAt: new Date().toISOString(),
    read: true,
  };

  const store = await readStore();
  const key = threadKey(input.groupId, input.bookId, input.chapterNumber);
  store[key] = [...(store[key] ?? []), message];
  await writeStore(store);
  return message;
}

export async function markChapterMessagesRead(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
}): Promise<void> {
  const store = await readStore();
  const key = threadKey(input.groupId, input.bookId, input.chapterNumber);
  const thread = store[key];
  if (!thread?.length) {
    return;
  }
  store[key] = thread.map((message) => ({ ...message, read: true }));
  await writeStore(store);
}

export async function countChapterMessages(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
}): Promise<number> {
  const messages = await listChapterMessages(input);
  return messages.length;
}

export async function countUnreadChapterMessages(input: {
  groupId: string;
  bookId: string;
  chapterNumber: number;
}): Promise<number> {
  const messages = await listChapterMessages(input);
  return messages.filter((message) => !message.read).length;
}
