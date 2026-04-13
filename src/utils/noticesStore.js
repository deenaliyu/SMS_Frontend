import { DB_COLLECTIONS, addLog, getCollection, setCollection } from "../db/localDb";

function normalizeNotice(notice = {}) {
  return {
    id: notice.id || `notice-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: String(notice.title || "").trim(),
    category: String(notice.category || "General").trim(),
    noticeBy: String(notice.noticeBy || notice.author || "School Admin").trim(),
    author: String(notice.author || notice.noticeBy || "School Admin").trim(),
    moreAbout: String(notice.moreAbout || notice.summary || notice.content || "").trim(),
    summary: String(notice.summary || notice.moreAbout || "").trim(),
    parentName: String(notice.parentName || "").trim(),
    date: notice.date || new Date().toISOString().slice(0, 10),
    createdAt: notice.createdAt || new Date().toISOString(),
    views: Number(notice.views || 0),
    likes: Number(notice.likes || 0),
  };
}

export function getNotices() {
  return getCollection(DB_COLLECTIONS.NOTICES).map(normalizeNotice);
}

export function saveNotice(notice) {
  const normalized = normalizeNotice(notice);
  const current = getNotices();
  const next = [normalized, ...current];
  setCollection(DB_COLLECTIONS.NOTICES, next);
  addLog({
    action: "create",
    entity: "notice",
    summary: `Created notice: ${normalized.title}`,
    payload: { id: normalized.id, title: normalized.title },
  });
  return normalized;
}

export function updateNotice(id, updates) {
  const current = getNotices();
  let updated = null;

  const next = current.map((notice) => {
    if (String(notice.id) !== String(id)) return notice;
    updated = normalizeNotice({ ...notice, ...updates, id: notice.id });
    return updated;
  });

  setCollection(DB_COLLECTIONS.NOTICES, next);
  return updated;
}

export function deleteNotice(id) {
  const current = getNotices();
  const next = current.filter((n) => String(n.id) !== String(id));
  setCollection(DB_COLLECTIONS.NOTICES, next);
  return { success: true };
}