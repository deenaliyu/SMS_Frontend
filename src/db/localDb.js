const DB_KEY = "sms_local_db_v1";

const DEFAULT_DB = {
  students: [],
  parents: [],
  teachers: [],
  financePayments: [],
  events: [],
  messageThreads: [],
  logs: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function cloneDefaultDb() {
  return {
    students: [],
    parents: [],
    teachers: [],
    financePayments: [],
    events: [],
    messageThreads: [],
    logs: [],
  };
}

export function readDb() {
  if (!isBrowser()) {
    return cloneDefaultDb();
  }

  const raw = window.localStorage.getItem(DB_KEY);

  if (!raw) {
    return cloneDefaultDb();
  }

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return cloneDefaultDb();
    }

    return {
      ...cloneDefaultDb(),
      ...parsed,
    };
  } catch {
    return cloneDefaultDb();
  }
}

export function writeDb(nextDb) {
  if (!isBrowser()) {
    return nextDb;
  }

  const safe = {
    ...cloneDefaultDb(),
    ...(nextDb || {}),
  };

  window.localStorage.setItem(DB_KEY, JSON.stringify(safe));
  return safe;
}

export function getCollection(collectionName) {
  const db = readDb();
  const collection = db[collectionName];
  return Array.isArray(collection) ? collection : [];
}

export function setCollection(collectionName, records) {
  const db = readDb();
  const safeRecords = Array.isArray(records) ? records : [];

  const nextDb = {
    ...db,
    [collectionName]: safeRecords,
  };

  writeDb(nextDb);
  return safeRecords;
}

export function addLog({ action, entity, summary = "", payload = null }) {
  const db = readDb();
  const logs = Array.isArray(db.logs) ? db.logs : [];

  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action: String(action || "unknown"),
    entity: String(entity || "unknown"),
    summary: String(summary || "").trim(),
    payload,
    createdAt: new Date().toISOString(),
  };

  const nextLogs = [entry, ...logs].slice(0, 1000);

  writeDb({
    ...db,
    logs: nextLogs,
  });

  return entry;
}

export function seedCollection(collectionName, seedRecords = [], getKey) {
  const existing = getCollection(collectionName);

  if (existing.length > 0 && (!seedRecords || seedRecords.length === 0)) {
    return existing;
  }

  const keyGetter = typeof getKey === "function" ? getKey : (entry) => entry?.id;
  const map = new Map();

  [...(seedRecords || []), ...existing].forEach((record) => {
    const key = keyGetter(record);

    if (key === undefined || key === null || key === "") {
      map.set(`fallback-${map.size}`, record);
      return;
    }

    if (!map.has(key)) {
      map.set(key, record);
    }
  });

  const merged = Array.from(map.values());
  setCollection(collectionName, merged);
  return merged;
}

export function appendRecord(collectionName, record) {
  const current = getCollection(collectionName);
  const next = [record, ...current];
  setCollection(collectionName, next);
  return record;
}

export function replaceRecords(collectionName, updater) {
  const current = getCollection(collectionName);
  const next = typeof updater === "function" ? updater(current) : current;
  setCollection(collectionName, next);
  return next;
}

export function getDbSnapshot() {
  return readDb();
}

export const DB_COLLECTIONS = Object.freeze({
  STUDENTS: "students",
  PARENTS: "parents",
  TEACHERS: "teachers",
  FINANCE_PAYMENTS: "financePayments",
  EVENTS: "events",
  MESSAGE_THREADS: "messageThreads",
  LOGS: "logs",
});

export { DEFAULT_DB };
