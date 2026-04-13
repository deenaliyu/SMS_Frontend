import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_THREADS_KEY = "sms_message_threads";

function formatDay(createdAt) {
  const date = new Date(createdAt);
  const now = new Date();

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.floor((nowOnly - dateOnly) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
}

function formatTime(createdAt) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeAttachment(attachment = {}) {
  const name = String(attachment.name || attachment.fileName || "Attachment").trim();
  const mimeType = String(attachment.mimeType || attachment.type || "").trim();
  const url = String(attachment.url || attachment.dataUrl || "").trim();
  const isImage = mimeType.startsWith("image/") || url.startsWith("data:image");

  return {
    id: attachment.id || `att-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    mimeType,
    url,
    kind: isImage ? "image" : "file",
    size: Number(attachment.size || 0),
  };
}

function normalizeMessage(message = {}) {
  const createdAt = message.createdAt || new Date().toISOString();
  const attachments = Array.isArray(message.attachments)
    ? message.attachments.map((item) => normalizeAttachment(item)).filter((item) => item.url)
    : [];

  return {
    id: message.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: String(message.text || "").trim(),
    sender: message.sender === "user" ? "user" : "me",
    createdAt,
    date: message.date || formatDay(createdAt),
    time: message.time || formatTime(createdAt),
    attachments,
  };
}

function normalizeThread(thread = {}) {
  return {
    id: thread.id || Date.now(),
    name: String(thread.name || "").trim() || "User",
    img: thread.img || "",
    messages: Array.isArray(thread.messages) ? thread.messages.map((msg) => normalizeMessage(msg)) : [],
  };
}

function migrateLegacyThreads() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_THREADS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const legacy = parsed.map((entry) => normalizeThread(entry));
    const existing = getCollection(DB_COLLECTIONS.MESSAGE_THREADS).map((entry) => normalizeThread(entry));

    const map = new Map();

    [...legacy, ...existing].forEach((entry) => {
      const key = String(entry.id || entry.name);

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.MESSAGE_THREADS, Array.from(map.values()));
  } catch {
    // ignore bad legacy
  }
}

function persistThreads(threads) {
  setCollection(DB_COLLECTIONS.MESSAGE_THREADS, threads);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_THREADS_KEY, JSON.stringify(threads));
  }

  return threads;
}

export function getMessageThreads(seedThreads = []) {
  migrateLegacyThreads();

  const seeded = seedCollection(
    DB_COLLECTIONS.MESSAGE_THREADS,
    (seedThreads || []).map((entry) => normalizeThread(entry)),
    (entry) => entry.id || entry.name,
  );

  return seeded.map((entry) => normalizeThread(entry));
}

export function ensureThreadByName(name, seedThreads = []) {
  const cleanName = String(name || "").trim();
  const current = getMessageThreads(seedThreads);

  if (!cleanName) {
    return current;
  }

  const existing = current.find((thread) => thread.name.toLowerCase() === cleanName.toLowerCase());

  if (existing) {
    return current;
  }

  const next = [
    {
      id: Date.now(),
      name: cleanName,
      img: "",
      messages: [],
    },
    ...current,
  ];

  return persistThreads(next);
}

export function syncThreadsFromContacts(contacts = [], seedThreads = []) {
  const current = getMessageThreads(seedThreads);
  const map = new Map();

  current.forEach((thread) => {
    map.set(String(thread.name).toLowerCase(), thread);
  });

  contacts.forEach((contact) => {
    const name = String(contact?.name || "").trim();

    if (!name) {
      return;
    }

    const key = name.toLowerCase();

    if (!map.has(key)) {
      map.set(key, {
        id: Date.now() + map.size,
        name,
        img: contact?.img || "",
        messages: [],
      });
    }
  });

  const next = Array.from(map.values());
  return persistThreads(next);
}

export function sendMessageToThread(threadId, payloadOrText, sender = "me", seedThreads = []) {
  const current = getMessageThreads(seedThreads);

  const payload = typeof payloadOrText === "object" && payloadOrText !== null
    ? payloadOrText
    : { text: payloadOrText };

  const cleanText = String(payload.text || "").trim();
  const attachments = Array.isArray(payload.attachments)
    ? payload.attachments.map((item) => normalizeAttachment(item)).filter((item) => item.url)
    : [];

  if (!cleanText && attachments.length === 0) {
    return current;
  }

  const next = current.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    const message = normalizeMessage({
      text: cleanText,
      sender,
      attachments,
    });

    addLog({
      action: "save",
      entity: "message",
      summary: `Sent message to ${thread.name}`,
      payload: {
        threadId,
        textLength: cleanText.length,
        attachments: attachments.length,
      },
    });

    return {
      ...thread,
      messages: [...thread.messages, message],
    };
  });

  return persistThreads(next);
}
