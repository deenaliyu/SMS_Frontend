import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const CMS_SEED = [
  { id: "page-about", title: "About Us", slug: "about", status: "Published", content: "About WiSchool — a leading learning institution.", updatedAt: "2025-01-01T00:00:00.000Z" },
  { id: "page-admission", title: "Admission Policy", slug: "admission-policy", status: "Published", content: "Our admission process and requirements.", updatedAt: "2025-01-01T00:00:00.000Z" },
  { id: "page-contact", title: "Contact", slug: "contact", status: "Published", content: "Get in touch with us.", updatedAt: "2025-01-01T00:00:00.000Z" },
  { id: "page-privacy", title: "Privacy Policy", slug: "privacy-policy", status: "Draft", content: "Privacy policy document.", updatedAt: "2025-01-15T00:00:00.000Z" },
];

function normalizePage(page = {}) {
  return {
    id: page.id || `page-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: String(page.title || page.name || "").trim(),
    name: String(page.name || page.title || "").trim(),
    slug: String(page.slug || "").trim().toLowerCase().replace(/\s+/g, "-"),
    status: String(page.status || "Draft").trim(),
    content: String(page.content || "").trim(),
    updatedAt: page.updatedAt || new Date().toISOString(),
  };
}

export function getCmsPages() {
  const seeded = seedCollection(
    DB_COLLECTIONS.CMS_PAGES,
    CMS_SEED.map(normalizePage),
    (e) => e.slug || e.id,
  );
  return seeded.map(normalizePage);
}

export function saveCmsPage(page) {
  const normalized = normalizePage(page);
  const current = getCmsPages();
  const next = [normalized, ...current];
  setCollection(DB_COLLECTIONS.CMS_PAGES, next);
  addLog({ action: "create", entity: "cms_page", summary: `Created page: ${normalized.title}` });
  return normalized;
}

export function updateCmsPage(id, updates) {
  const current = getCmsPages();
  let updated = null;

  const next = current.map((page) => {
    if (String(page.id) !== String(id)) return page;
    updated = normalizePage({ ...page, ...updates, id: page.id, updatedAt: new Date().toISOString() });
    return updated;
  });

  setCollection(DB_COLLECTIONS.CMS_PAGES, next);
  return updated;
}

export function deleteCmsPage(id) {
  const current = getCmsPages();
  const next = current.filter((p) => String(p.id) !== String(id));
  setCollection(DB_COLLECTIONS.CMS_PAGES, next);
  return { success: true };
}