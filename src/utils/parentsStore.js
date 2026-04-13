import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_PARENTS_KEY = "sms_parents";

function buildName(parent = {}) {
  if (parent.name && String(parent.name).trim()) {
    return String(parent.name).trim();
  }

  const parts = [parent.title, parent.firstName, parent.middleName, parent.lastName]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return parts.join(" ").trim();
}

function parseStudentsCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = String(value || "");
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function normalizeParent(parent = {}) {
  const email = String(parent.email || "").trim().toLowerCase();
  const mobile = String(parent.mobile || parent.mobileNumber || "").trim();
  const parentId = String(parent.parentId || "").trim();
  const students = parseStudentsCount(parent.students || parent.numberOfStudents);

  return {
    id: parent.id || Date.now(),
    parentId,
    title: String(parent.title || "").trim(),
    firstName: String(parent.firstName || "").trim(),
    middleName: String(parent.middleName || "").trim(),
    lastName: String(parent.lastName || "").trim(),
    name: buildName(parent),
    gender: String(parent.gender || "").trim(),
    mobile,
    mobileNumber: mobile,
    email,
    educationalQualification: String(parent.educationalQualification || "").trim(),
    occupation: String(parent.occupation || "").trim(),
    annualIncome: String(parent.annualIncome || "").trim(),
    state: String(parent.state || "").trim(),
    lga: String(parent.lga || "").trim(),
    address: String(parent.address || "").trim(),
    username: String(parent.username || "").trim(),
    dateOfBirth: String(parent.dateOfBirth || "").trim(),
    students,
    numberOfStudents: parent.numberOfStudents || (students ? `${students} Student${students > 1 ? "s" : ""}` : ""),
    linkedStudentIds: Array.isArray(parent.linkedStudentIds) ? parent.linkedStudentIds : [],
    image: parent.image || "/api/placeholder/80/80",
    bio: String(parent.bio || "").trim(),
  };
}

function nextParentId(parents = []) {
  const maxNumber = parents.reduce((max, entry) => {
    const value = String(entry.parentId || "");
    const match = value.match(/(\d+)/);
    const current = match ? Number(match[1]) : 0;
    return current > max ? current : max;
  }, 0);

  return `WISCH${maxNumber + 1}`;
}

function migrateLegacyParents() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_PARENTS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const legacy = parsed.map((entry) => normalizeParent(entry));
    const existing = getCollection(DB_COLLECTIONS.PARENTS).map((entry) => normalizeParent(entry));

    const map = new Map();

    [...legacy, ...existing].forEach((entry) => {
      const key = entry.email || entry.parentId || String(entry.id);

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.PARENTS, Array.from(map.values()));
  } catch {
    // ignore bad legacy
  }
}

export function getParents(seedParents = []) {
  migrateLegacyParents();

  const seeded = seedCollection(
    DB_COLLECTIONS.PARENTS,
    (seedParents || []).map((entry) => normalizeParent(entry)),
    (entry) => entry.email || entry.parentId || entry.id,
  );

  return seeded.map((entry) => normalizeParent(entry));
}

export function saveParent(parent, seedParents = []) {
  const current = getParents(seedParents);
  const normalized = normalizeParent(parent);

  if (!normalized.parentId) {
    normalized.parentId = nextParentId(current);
  }

  const next = [
    normalized,
    ...current.filter((entry) => {
      if (normalized.email && entry.email) {
        return entry.email !== normalized.email;
      }

      if (normalized.parentId && entry.parentId) {
        return entry.parentId !== normalized.parentId;
      }

      return entry.id !== normalized.id;
    }),
  ];

  setCollection(DB_COLLECTIONS.PARENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_PARENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "save",
    entity: "parent",
    summary: `Saved parent ${normalized.name || normalized.parentId}`,
    payload: { parentId: normalized.parentId, email: normalized.email },
  });

  return normalized;
}

export function updateParent(parentIdentifier, updates = {}, seedParents = []) {
  const current = getParents(seedParents);

  const next = current.map((entry) => {
    const matches = entry.id === parentIdentifier || entry.parentId === parentIdentifier;

    if (!matches) {
      return entry;
    }

    return normalizeParent({ ...entry, ...updates, id: entry.id, parentId: entry.parentId });
  });

  setCollection(DB_COLLECTIONS.PARENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_PARENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "update",
    entity: "parent",
    summary: `Updated parent ${parentIdentifier}`,
    payload: { parentIdentifier },
  });

  return next;
}

export function deleteParent(parentIdentifier, seedParents = []) {
  const current = getParents(seedParents);
  const next = current.filter((entry) => entry.id !== parentIdentifier && entry.parentId !== parentIdentifier);

  setCollection(DB_COLLECTIONS.PARENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_PARENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "delete",
    entity: "parent",
    summary: `Deleted parent ${parentIdentifier}`,
    payload: { parentIdentifier },
  });

  return next;
}

export function getParentByIdentifier(parentIdentifier, seedParents = []) {
  const current = getParents(seedParents);
  return current.find((entry) => entry.id === parentIdentifier || entry.parentId === parentIdentifier) || null;
}
