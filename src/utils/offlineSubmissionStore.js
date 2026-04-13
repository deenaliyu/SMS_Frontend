const OFFLINE_SUBMISSIONS_KEY = "sms_offline_submissions";

function readOfflineEntries() {
  const raw = window.localStorage.getItem(OFFLINE_SUBMISSIONS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOfflineSubmission(type, payload, reason = "") {
  const entries = readOfflineEntries();

  const entry = {
    id: `${type}-${Date.now()}`,
    type,
    payload,
    reason,
    createdAt: new Date().toISOString(),
    synced: false,
  };

  const nextEntries = [entry, ...entries];
  window.localStorage.setItem(OFFLINE_SUBMISSIONS_KEY, JSON.stringify(nextEntries));

  return entry;
}

export function getOfflineSubmissions(type = "") {
  const entries = readOfflineEntries();

  if (!type) {
    return entries;
  }

  return entries.filter((entry) => entry.type === type);
}
