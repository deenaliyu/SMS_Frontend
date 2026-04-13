import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_STUDENTS_KEY = "sms_students";

function normalizeStudent(student = {}) {
  const firstName = String(student.firstName || "").trim();
  const middleName = String(student.middleName || "").trim();
  const lastName = String(student.lastName || "").trim();

  const name =
    String(student.name || "").trim() || [firstName, middleName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: student.id || Date.now(),
    studentId: String(student.studentId || "").trim(),
    admissionNumber: String(student.admissionNumber || "").trim(),
    firstName,
    middleName,
    lastName,
    name,
    className: String(student.className || student.class || "").trim(),
    class: String(student.class || student.className || "").trim(),
    gender: String(student.gender || "").trim(),
    dateOfBirth: String(student.dateOfBirth || "").trim(),
    email: String(student.email || "").trim().toLowerCase(),
    phone: String(student.phone || "").trim(),
    address: String(student.address || "").trim(),
    state: String(student.state || "").trim(),
    lga: String(student.lga || "").trim(),
    parentFullName: String(student.parentFullName || "").trim(),
    parentEmail: String(student.parentEmail || "").trim().toLowerCase(),
    parentPhone: String(student.parentPhone || "").trim(),
    parentAddress: String(student.parentAddress || "").trim(),
    username: String(student.username || "").trim(),
  };
}

function nextStudentId(records = []) {
  const max = records.reduce((highest, entry) => {
    const match = String(entry.studentId || "").match(/STU(\d+)/i);
    const current = match ? Number(match[1]) : 0;
    return current > highest ? current : highest;
  }, 0);

  return `STU${String(max + 1).padStart(3, "0")}`;
}

function migrateLegacyStudents() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_STUDENTS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const normalized = parsed.map((entry) => normalizeStudent(entry));
    const existing = getCollection(DB_COLLECTIONS.STUDENTS).map((entry) => normalizeStudent(entry));

    const map = new Map();

    [...normalized, ...existing].forEach((entry) => {
      const key = entry.email || entry.admissionNumber || entry.studentId || String(entry.id);

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.STUDENTS, Array.from(map.values()));
  } catch {
    // ignore bad legacy data
  }
}

export function getStudents(seedStudents = []) {
  migrateLegacyStudents();

  const seeded = seedCollection(
    DB_COLLECTIONS.STUDENTS,
    (seedStudents || []).map((entry) => normalizeStudent(entry)),
    (entry) => entry.email || entry.admissionNumber || entry.studentId || entry.id,
  );

  return seeded.map((entry) => normalizeStudent(entry));
}

export function saveStudent(student, seedStudents = []) {
  const current = getStudents(seedStudents);
  const normalized = normalizeStudent(student);

  if (!normalized.studentId) {
    normalized.studentId = nextStudentId(current);
  }

  const next = [
    normalized,
    ...current.filter((entry) => {
      if (normalized.email && entry.email) {
        return entry.email !== normalized.email;
      }

      if (normalized.admissionNumber && entry.admissionNumber) {
        return entry.admissionNumber !== normalized.admissionNumber;
      }

      if (normalized.studentId && entry.studentId) {
        return entry.studentId !== normalized.studentId;
      }

      return entry.id !== normalized.id;
    }),
  ];

  setCollection(DB_COLLECTIONS.STUDENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_STUDENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "save",
    entity: "student",
    summary: `Saved student ${normalized.name || normalized.studentId}`,
    payload: { studentId: normalized.studentId, email: normalized.email },
  });

  return normalized;
}

export function mergeStudents(staticStudents = []) {
  const current = getStudents(staticStudents);
  const map = new Map();

  current.forEach((entry) => {
    const normalized = normalizeStudent(entry);
    const key = normalized.email || normalized.admissionNumber || normalized.studentId || String(normalized.id);

    if (!map.has(key)) {
      map.set(key, normalized);
    }
  });

  return Array.from(map.values());
}
