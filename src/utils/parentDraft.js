const KEY = "parent-add-draft-v1";
export function getParentDraft() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null") || {}; } catch { return {}; }
}
export function saveParentDraft(data) {
  try {
    const existing = getParentDraft();
    localStorage.setItem(KEY, JSON.stringify({ ...existing, ...data }));
  } catch { /* noop */ }
}
export function clearParentDraft() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}