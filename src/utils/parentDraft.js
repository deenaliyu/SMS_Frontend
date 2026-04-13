const PARENT_DRAFT_KEY = "parent-onboarding-draft";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getParentDraft() {
  if (!isBrowser()) {
    return {};
  }

  const raw = window.localStorage.getItem(PARENT_DRAFT_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveParentDraft(updates) {
  if (!isBrowser()) {
    return updates;
  }

  const nextDraft = { ...getParentDraft(), ...updates };
  window.localStorage.setItem(PARENT_DRAFT_KEY, JSON.stringify(nextDraft));
  return nextDraft;
}

export function clearParentDraft() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PARENT_DRAFT_KEY);
}
