import { normalizeUserWithAccess } from "../config/accessControl";

const ADMIN_USERS_KEY = "sms_admin_users";

export function getSavedAdminUsers() {
  const raw = window.localStorage.getItem(ADMIN_USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((entry) => normalizeUserWithAccess(entry)) : [];
  } catch {
    return [];
  }
}

export function saveAdminUser(user) {
  const normalizedUser = normalizeUserWithAccess({
    id: user?.id || Date.now(),
    ...user,
  });

  const existingUsers = getSavedAdminUsers();

  const withoutSameEmail = existingUsers.filter(
    (entry) => entry.email?.toLowerCase() !== normalizedUser.email?.toLowerCase(),
  );

  const nextUsers = [normalizedUser, ...withoutSameEmail];
  window.localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(nextUsers));

  return nextUsers;
}

export function mergeAdminUsers(staticUsers = []) {
  const savedUsers = getSavedAdminUsers();
  const map = new Map();

  [...savedUsers, ...staticUsers].forEach((user) => {
    const normalized = normalizeUserWithAccess(user);
    const key = normalized.email?.toLowerCase() || String(normalized.id);

    if (!map.has(key)) {
      map.set(key, normalized);
    }
  });

  return Array.from(map.values());
}
