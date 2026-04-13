import { normalizeUserWithAccess } from "../config/accessControl";

const USER_STORAGE_KEY = "sms_user";
const TOKEN_STORAGE_KEY = "sms_token";
const PORTAL_STORAGE_KEY = "sms_portal";

export function setAuthSession({ token, user, emailFallback = "", portal = "" }) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  const normalizedUser = normalizeUserWithAccess(user || {}, emailFallback);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));

  if (portal) {
    window.localStorage.setItem(PORTAL_STORAGE_KEY, portal);
  }

  return normalizedUser;
}

export function getAuthUser() {
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeUserWithAccess(parsed);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getAuthPortal() {
  return window.localStorage.getItem(PORTAL_STORAGE_KEY) || "";
}

export function clearAuthSession() {
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(PORTAL_STORAGE_KEY);
}
