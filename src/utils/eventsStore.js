import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_EVENTS_KEY = "sms_events";

function normalizeEvent(event = {}) {
  return {
    id: event.id || Date.now(),
    title: String(event.title || "").trim(),
    date: String(event.date || "").trim(),
    time: String(event.time || "").trim(),
    location: String(event.location || "").trim(),
    description: String(event.description || "").trim(),
    organizer: String(event.organizer || "").trim(),
  };
}

function migrateLegacyEvents() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_EVENTS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const legacy = parsed.map((entry) => normalizeEvent(entry));
    const existing = getCollection(DB_COLLECTIONS.EVENTS).map((entry) => normalizeEvent(entry));

    const map = new Map();

    [...legacy, ...existing].forEach((entry) => {
      const key = `${entry.title}-${entry.date}-${entry.time}`;

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.EVENTS, Array.from(map.values()));
  } catch {
    // ignore bad legacy
  }
}

export function getEvents(seedEvents = []) {
  migrateLegacyEvents();

  const seeded = seedCollection(
    DB_COLLECTIONS.EVENTS,
    (seedEvents || []).map((entry) => normalizeEvent(entry)),
    (entry) => `${entry.title}-${entry.date}-${entry.time}`,
  );

  return seeded.map((entry) => normalizeEvent(entry));
}

export function saveEvent(event, seedEvents = []) {
  const current = getEvents(seedEvents);
  const normalized = normalizeEvent(event);

  const key = `${normalized.title}-${normalized.date}-${normalized.time}`;

  const next = [normalized, ...current.filter((entry) => `${entry.title}-${entry.date}-${entry.time}` !== key)];

  setCollection(DB_COLLECTIONS.EVENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_EVENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "save",
    entity: "event",
    summary: `Saved event ${normalized.title}`,
    payload: { title: normalized.title, date: normalized.date },
  });

  return normalized;
}
