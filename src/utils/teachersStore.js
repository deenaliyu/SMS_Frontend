import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_TEACHERS_KEY = "sms_teachers";

function normalizeTeacher(teacher = {}) {
  const email = String(teacher.email || "").trim().toLowerCase();
  const mobile = String(teacher.mobile || teacher.mobileNumber || "").trim();
  const assignedClass = String(teacher.assignedClass || teacher.class || "").trim();
  const assignedSubject = String(teacher.assignedSubject || teacher.subject || "").trim();

  return {
    id: teacher.id || Date.now(),
    teacherId: teacher.teacherId || "",
    name: teacher.name || teacher.teacherName || "",
    teacherName: teacher.teacherName || teacher.name || "",
    gender: teacher.gender || "",
    mobile,
    mobileNumber: mobile,
    email,
    class: assignedClass,
    assignedClass,
    subject: assignedSubject,
    assignedSubject,
    address: teacher.address || "",
    state: teacher.state || "",
    lga: teacher.lga || "",
    qualification: teacher.qualification || "",
    yearsOfExperience: teacher.yearsOfExperience || "",
    dateOfBirth: teacher.dateOfBirth || "",
    dateOfEmployment: teacher.dateOfEmployment || "",
    username: teacher.username || "",
  };
}

function nextTeacherId(existingTeachers = []) {
  const max = existingTeachers.reduce((highest, teacher) => {
    const match = String(teacher.teacherId || "").match(/T(\d+)/i);
    const value = match ? Number(match[1]) : 0;
    return value > highest ? value : highest;
  }, 0);

  return `T${String(max + 1).padStart(3, "0")}`;
}

function migrateLegacyTeachers() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_TEACHERS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const legacy = parsed.map((entry) => normalizeTeacher(entry));
    const existing = getCollection(DB_COLLECTIONS.TEACHERS).map((entry) => normalizeTeacher(entry));

    const map = new Map();

    [...legacy, ...existing].forEach((entry) => {
      const key = entry.email || entry.teacherId || String(entry.id);

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.TEACHERS, Array.from(map.values()));
  } catch {
    // ignore bad legacy
  }
}

export function getSavedTeachers() {
  migrateLegacyTeachers();
  return getCollection(DB_COLLECTIONS.TEACHERS).map((teacher) => normalizeTeacher(teacher));
}

export function saveTeacher(teacher) {
  const normalized = normalizeTeacher(teacher);
  const existing = getSavedTeachers();

  if (!normalized.teacherId) {
    normalized.teacherId = nextTeacherId(existing);
  }

  const deduped = existing.filter((entry) => {
    if (normalized.email && entry.email) {
      return entry.email !== normalized.email;
    }

    return entry.teacherId !== normalized.teacherId;
  });

  const nextTeachers = [normalized, ...deduped];
  setCollection(DB_COLLECTIONS.TEACHERS, nextTeachers);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_TEACHERS_KEY, JSON.stringify(nextTeachers));
  }

  addLog({
    action: "save",
    entity: "teacher",
    summary: `Saved teacher ${normalized.name || normalized.teacherId}`,
    payload: { teacherId: normalized.teacherId, email: normalized.email },
  });

  return normalized;
}

export function mergeTeachers(staticTeachers = []) {
  migrateLegacyTeachers();

  const seeded = seedCollection(
    DB_COLLECTIONS.TEACHERS,
    (staticTeachers || []).map((entry) => normalizeTeacher(entry)),
    (entry) => entry.email || entry.teacherId || entry.id,
  );

  const map = new Map();

  seeded.forEach((teacher) => {
    const normalized = normalizeTeacher(teacher);
    const key = normalized.email || normalized.teacherId || String(normalized.id);

    if (!map.has(key)) {
      map.set(key, normalized);
    }
  });

  return Array.from(map.values());
}
