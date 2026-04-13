import { normalizeUserWithAccess } from "../config/accessControl";
import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

// Static seed admin users (from AdminData)
const ADMIN_SEED = [
  { id: 0, username: "sadeeq", fullName: "Sadeeq", email: "sadeeq@test.com", role: "System Admin", status: "Active" },
  { id: 1, username: "jdoe", fullName: "John Doe", email: "jdoe@example.com", role: "HR Admin", status: "Active" },
  { id: 2, username: "asmith", fullName: "Alice Smith", email: "asmith@example.com", role: "Finance Admin", status: "Inactive" },
  { id: 3, username: "bwayne", fullName: "Bruce Wayne", email: "bwayne@example.com", role: "Teachers Admin", status: "Active" },
  { id: 4, username: "ckent", fullName: "Clark Kent", email: "ckent@example.com", role: "Parents Admin", status: "Inactive" },
  { id: 5, username: "dprince", fullName: "Diana Prince", email: "dprince@example.com", role: "Students Admin", status: "Active" },
  { id: 6, username: "pparker", fullName: "Peter Parker", email: "pparker@example.com", role: "Messaging Admin", status: "Active" },
  { id: 7, username: "tstark", fullName: "Tony Stark", email: "tstark@example.com", role: "Events Admin", status: "Inactive" },
  { id: 8, username: "sscott", fullName: "Scott Scott", email: "sscott@example.com", role: "Notice Board Admin", status: "Active" },
  { id: 9, username: "bwilliams", fullName: "Barry Williams", email: "bwilliams@example.com", role: "School Admin", status: "Inactive" },
  { id: 10, username: "sjobs", fullName: "Steve Jobs", email: "sjobs@example.com", role: "Subjects Admin", status: "Active" },
  { id: 11, username: "bgates", fullName: "Bill Gates", email: "bgates@example.com", role: "CMS Admin", status: "Active" },
  { id: 12, username: "eclark", fullName: "Emma Clark", email: "eclark@example.com", role: "Admin Users Admin", status: "Inactive" },
  { id: 13, username: "mjackson", fullName: "Michael Jackson", email: "mjackson@example.com", role: "Dashboard Admin", status: "Active" },
  { id: 14, username: "tkim", fullName: "Thomas Kim", email: "tkim@example.com", role: "HR Admin", status: "Active" },
  { id: 15, username: "rpatel", fullName: "Ravi Patel", email: "rpatel@example.com", role: "Finance Admin", status: "Inactive" },
  { id: 16, username: "lkhan", fullName: "Lara Khan", email: "lkhan@example.com", role: "Teachers Admin", status: "Active" },
  { id: 17, username: "slee", fullName: "Sophia Lee", email: "slee@example.com", role: "Parents Admin", status: "Active" },
  { id: 18, username: "ahassan", fullName: "Ali Hassan", email: "ahassan@example.com", role: "Students Admin", status: "Inactive" },
  { id: 19, username: "jwilson", fullName: "Jack Wilson", email: "jwilson@example.com", role: "Messaging Admin", status: "Active" },
  { id: 20, username: "cgarcia", fullName: "Carlos Garcia", email: "cgarcia@example.com", role: "Events Admin", status: "Inactive" },
];

function normalizeAdminUser(user = {}) {
  const normalized = normalizeUserWithAccess(user, user.email || "");
  return {
    ...normalized,
    username: String(user.username || user.userName || "").trim(),
    fullName: String(user.fullName || user.name || "").trim(),
    status: String(user.status || user.activity || "Active").trim(),
  };
}

export function getSavedAdminUsers() {
  const seeded = seedCollection(
    DB_COLLECTIONS.ADMIN_USERS,
    ADMIN_SEED.map(normalizeAdminUser),
    (e) => String(e.email || "").toLowerCase() || String(e.id),
  );
  return seeded.map(normalizeAdminUser);
}

export function saveAdminUser(user) {
  const normalized = normalizeAdminUser({
    id: user?.id || Date.now(),
    ...user,
  });

  const existingUsers = getSavedAdminUsers();
  const emailKey = String(normalized.email || "").toLowerCase();

  const withoutSameEmail = existingUsers.filter(
    (e) => String(e.email || "").toLowerCase() !== emailKey,
  );

  const nextUsers = [normalized, ...withoutSameEmail];
  setCollection(DB_COLLECTIONS.ADMIN_USERS, nextUsers);

  addLog({
    action: "save",
    entity: "admin_user",
    summary: `Saved admin user: ${normalized.fullName || normalized.email}`,
  });

  return normalized;
}

export function updateAdminUser(id, updates) {
  const current = getSavedAdminUsers();
  let updated = null;

  const next = current.map((user) => {
    if (String(user.id) !== String(id)) return user;
    updated = normalizeAdminUser({ ...user, ...updates, id: user.id });
    return updated;
  });

  setCollection(DB_COLLECTIONS.ADMIN_USERS, next);
  if (updated) {
    addLog({
      action: "update",
      entity: "admin_user",
      summary: `Updated admin user: ${updated.fullName}`,
    });
  }
  return updated;
}

export function mergeAdminUsers(staticUsers = []) {
  return getSavedAdminUsers();
}