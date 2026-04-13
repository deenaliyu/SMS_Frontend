import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const SUBJECTS_SEED = [
  { id: 1, code: "MTH101", name: "Mathematics", department: "Science", classes: "JSS1 - SSS3", teachers: 8 },
  { id: 2, code: "ENG101", name: "English Language", department: "Arts", classes: "JSS1 - SSS3", teachers: 10 },
  { id: 3, code: "PHY201", name: "Physics", department: "Science", classes: "SSS1 - SSS3", teachers: 5 },
  { id: 4, code: "CHM201", name: "Chemistry", department: "Science", classes: "SSS1 - SSS3", teachers: 4 },
  { id: 5, code: "BIO201", name: "Biology", department: "Science", classes: "SSS1 - SSS3", teachers: 5 },
  { id: 6, code: "GOV201", name: "Government", department: "Social Science", classes: "SSS1 - SSS3", teachers: 3 },
  { id: 7, code: "ECO201", name: "Economics", department: "Social Science", classes: "SSS1 - SSS3", teachers: 3 },
  { id: 8, code: "BST101", name: "Basic Science & Technology", department: "Science", classes: "JSS1 - JSS3", teachers: 6 },
  { id: 9, code: "CRK101", name: "Christian Religious Knowledge", department: "Arts", classes: "JSS1 - SSS3", teachers: 4 },
  { id: 10, code: "ICT101", name: "Information Technology", department: "Technology", classes: "JSS1 - SSS3", teachers: 4 },
];

function normalizeSubject(subject = {}) {
  return {
    id: subject.id || `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    code: String(subject.code || "").trim().toUpperCase(),
    name: String(subject.name || "").trim(),
    department: String(subject.department || "").trim(),
    classes: String(subject.classes || "").trim(),
    teachers: Number(subject.teachers || 0),
  };
}

export function getSubjects() {
  const seeded = seedCollection(
    DB_COLLECTIONS.SUBJECTS,
    SUBJECTS_SEED.map(normalizeSubject),
    (e) => e.code || e.id,
  );
  return seeded.map(normalizeSubject);
}

export function saveSubject(subject) {
  const normalized = normalizeSubject(subject);
  const current = getSubjects();

  // Prevent duplicate codes
  const exists = current.find((s) => s.code === normalized.code && String(s.id) !== String(normalized.id));
  if (exists) {
    throw new Error(`Subject code ${normalized.code} already exists.`);
  }

  const next = [normalized, ...current];
  setCollection(DB_COLLECTIONS.SUBJECTS, next);
  addLog({ action: "create", entity: "subject", summary: `Created subject: ${normalized.name}` });
  return normalized;
}

export function updateSubject(id, updates) {
  const current = getSubjects();
  let updated = null;

  const next = current.map((sub) => {
    if (String(sub.id) !== String(id)) return sub;
    updated = normalizeSubject({ ...sub, ...updates, id: sub.id });
    return updated;
  });

  setCollection(DB_COLLECTIONS.SUBJECTS, next);
  if (updated) {
    addLog({ action: "update", entity: "subject", summary: `Updated subject: ${updated.name}` });
  }
  return updated;
}

export function deleteSubject(id) {
  const current = getSubjects();
  const next = current.filter((s) => String(s.id) !== String(id));
  setCollection(DB_COLLECTIONS.SUBJECTS, next);
  return { success: true };
}