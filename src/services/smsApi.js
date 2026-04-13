/**
 * smsApi — School Management System API client.
 *
 * Every method attempts the real backend first.
 * On network errors or 404/5xx responses it falls back to the local
 * localStorage-backed stores so the entire app works without a server.
 */

import { ApiError, apiRequest } from "./apiClient";

// Local stores
import { getSavedTeachers, saveTeacher } from "../utils/teachersStore";
import { getParents, saveParent, updateParent as localUpdateParent, deleteParent as localDeleteParent } from "../utils/parentsStore";
import { getStudents, saveStudent } from "../utils/studentsStore";
import { getTeacherPayments, saveTeacherPayment } from "../utils/teacherPaymentsStore";
import { getEvents, saveEvent } from "../utils/eventsStore";
import { getMessageThreads } from "../utils/messagesStore";
import { getSavedAdminUsers, saveAdminUser, updateAdminUser as localUpdateAdminUser } from "../utils/adminUsersStore";
import { getNotices, saveNotice } from "../utils/noticesStore";
import { getInvoices, saveInvoice, updateInvoice as localUpdateInvoice } from "../utils/invoicesStore";
import { getSubjects, saveSubject, updateSubject as localUpdateSubject } from "../utils/subjectsStore";
import { getCmsPages, saveCmsPage, updateCmsPage as localUpdateCmsPage } from "../utils/cmsStore";
import { getSchoolProfile, saveSchoolProfile as localSaveSchoolProfile } from "../utils/schoolProfileStore";
import { localLogin, isLocalToken } from "../utils/localAuth";
import { getAuthToken, getAuthUser } from "../utils/authSession";
import { DB_COLLECTIONS, getCollection, setCollection, addLog } from "../db/localDb";

// Seed data
import { eventSeedData } from "../Events/eventsSeed";
import { parentSeedData } from "../Parents/parentsSeed";
import { studentSeedData } from "../Students/studentsSeed";
import { teacherPayments as teacherPaymentSeed } from "../Finance/data";

// ── Helpers ───────────────────────────────────────────────────────────────────

function shouldFallback(error) {
  if (error instanceof ApiError) {
    // Fallback on 404 (route not implemented) or server errors
    return error.status === 404 || error.status >= 500;
  }
  // Fallback on network failures (TypeError: Failed to fetch, etc.)
  return true;
}

/**
 * Try the API first; on qualifying failure, run the local function.
 */
async function tryApi(apiFn, localFn) {
  try {
    return await apiFn();
  } catch (error) {
    if (shouldFallback(error)) {
      return localFn(error);
    }
    throw error;
  }
}

// ── Message thread helpers (local) ────────────────────────────────────────────

function normalizeThread(thread = {}, index = 0) {
  return {
    id: thread.id || `thread-${index + 1}`,
    name: thread.name || "Unnamed Contact",
    img: thread.img || "",
    role: thread.role || "",
    messages: Array.isArray(thread.messages) ? thread.messages : [],
  };
}

function saveThread(thread) {
  const normalized = normalizeThread(thread);
  const current = getCollection(DB_COLLECTIONS.MESSAGE_THREADS);
  const existing = current.find((t) => String(t.id) === String(normalized.id));

  let next;
  if (existing) {
    next = current.map((t) => (String(t.id) === String(normalized.id) ? normalized : t));
  } else {
    normalized.id = normalized.id.startsWith("contact-")
      ? `thread-${Date.now()}`
      : normalized.id;
    next = [normalized, ...current];
  }

  setCollection(DB_COLLECTIONS.MESSAGE_THREADS, next);
  addLog({ action: "save", entity: "message_thread", summary: `Saved thread: ${normalized.name}` });
  return normalized;
}

// ── Main API object ───────────────────────────────────────────────────────────

export const smsApi = {
  // ── Auth ────────────────────────────────────────────────────────────────────

  async login(payload) {
    return tryApi(
      () => apiRequest("/auth/login", { method: "POST", body: payload }),
      () => localLogin(payload),
    );
  },

  async logout() {
    try {
      return await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      return { success: true };
    }
  },

  async me() {
    const token = getAuthToken();
    if (isLocalToken(token)) {
      const user = getAuthUser();
      return { user: user || {} };
    }
    return tryApi(
      () => apiRequest("/auth/me"),
      () => {
        const user = getAuthUser();
        if (user) return { user };
        throw new Error("Session expired. Please log in again.");
      },
    );
  },

  async updateProfile(payload) {
    return tryApi(
      () => apiRequest("/auth/me", { method: "PUT", body: payload }),
      () => ({ user: payload }),
    );
  },

  async updatePassword(payload) {
    return tryApi(
      () => apiRequest("/auth/password", { method: "PUT", body: payload }),
      () => ({ success: true }),
    );
  },

  // ── Admin Users ──────────────────────────────────────────────────────────────

  async listAdminUsers() {
    return tryApi(
      () => apiRequest("/admin-users"),
      () => getSavedAdminUsers(),
    );
  },

  async getAdminUser(id) {
    return tryApi(
      () => apiRequest(`/admin-users/${id}`),
      () => {
        const users = getSavedAdminUsers();
        return users.find((u) => String(u.id) === String(id)) || null;
      },
    );
  },

  async createAdminUser(payload) {
    return tryApi(
      () => apiRequest("/admin-users", { method: "POST", body: payload }),
      () => saveAdminUser(payload),
    );
  },

  async updateAdminUser(id, payload) {
    return tryApi(
      () => apiRequest(`/admin-users/${id}`, { method: "PUT", body: payload }),
      () => localUpdateAdminUser(id, payload) || { ...payload, id },
    );
  },

  // ── Teachers ─────────────────────────────────────────────────────────────────

  async listTeachers() {
    return tryApi(
      () => apiRequest("/teachers"),
      () => getSavedTeachers(),
    );
  },

  async createTeacher(payload) {
    return tryApi(
      () => apiRequest("/teachers", { method: "POST", body: payload }),
      () => saveTeacher(payload),
    );
  },

  async updateTeacher(id, payload) {
    return tryApi(
      () => apiRequest(`/teachers/${id}`, { method: "PUT", body: payload }),
      () => {
        const saved = saveTeacher({ ...payload, id });
        return saved;
      },
    );
  },

  async deleteTeacher(id) {
    return tryApi(
      () => apiRequest(`/teachers/${id}`, { method: "DELETE" }),
      () => ({ success: true }),
    );
  },

  // ── Parents ──────────────────────────────────────────────────────────────────

  async listParents() {
    return tryApi(
      () => apiRequest("/parents"),
      () => getParents(parentSeedData),
    );
  },

  async createParent(payload) {
    return tryApi(
      () => apiRequest("/parents", { method: "POST", body: payload }),
      () => saveParent(payload, parentSeedData),
    );
  },

  async updateParent(id, payload) {
    return tryApi(
      () => apiRequest(`/parents/${id}`, { method: "PUT", body: payload }),
      () => {
        const next = localUpdateParent(id, payload, parentSeedData);
        return next.find((p) => String(p.id) === String(id)) || payload;
      },
    );
  },

  async deleteParent(id) {
    return tryApi(
      () => apiRequest(`/parents/${id}`, { method: "DELETE" }),
      () => { localDeleteParent(id, parentSeedData); return { success: true }; },
    );
  },

  // ── Students ─────────────────────────────────────────────────────────────────

  async listStudents() {
    return tryApi(
      () => apiRequest("/students"),
      () => getStudents(studentSeedData),
    );
  },

  async createStudent(payload) {
    return tryApi(
      () => apiRequest("/students", { method: "POST", body: payload }),
      () => saveStudent(payload, studentSeedData),
    );
  },

  async updateStudent(id, payload) {
    return tryApi(
      () => apiRequest(`/students/${id}`, { method: "PUT", body: payload }),
      () => ({ ...payload, id }),
    );
  },

  async deleteStudent(id) {
    return tryApi(
      () => apiRequest(`/students/${id}`, { method: "DELETE" }),
      () => ({ success: true }),
    );
  },

  async getStudentSelf() {
    return tryApi(
      () => apiRequest("/students/self"),
      () => {
        const user = getAuthUser();
        const students = getStudents(studentSeedData);
        return (
          students.find(
            (s) =>
              s.email === user?.email ||
              s.username === user?.username,
          ) || null
        );
      },
    );
  },

  async submitStudentAdmission(payload) {
    return tryApi(
      () => apiRequest("/admissions", { method: "POST", body: payload }),
      () => saveStudent(payload, studentSeedData),
    );
  },

  async registerStudent(payload) {
    return tryApi(
      () => apiRequest("/students/register", { method: "POST", body: payload }),
      () => saveStudent(payload, studentSeedData),
    );
  },

  // ── Events ───────────────────────────────────────────────────────────────────

  async listEvents() {
    return tryApi(
      () => apiRequest("/events"),
      () => getEvents(eventSeedData),
    );
  },

  async createEvent(payload) {
    return tryApi(
      () => apiRequest("/events", { method: "POST", body: payload }),
      () => saveEvent(payload, eventSeedData),
    );
  },

  // ── Notices ──────────────────────────────────────────────────────────────────

  async listNotices() {
    return tryApi(
      () => apiRequest("/notices"),
      () => getNotices(),
    );
  },

  async createNotice(payload) {
    return tryApi(
      () => apiRequest("/notices", { method: "POST", body: payload }),
      () => saveNotice(payload),
    );
  },

  // ── Finance Payments ──────────────────────────────────────────────────────────

  async listFinancePayments() {
    return tryApi(
      () => apiRequest("/finance-payments"),
      () => getTeacherPayments(teacherPaymentSeed),
    );
  },

  async createFinancePayment(payload) {
    return tryApi(
      () => apiRequest("/finance-payments", { method: "POST", body: payload }),
      () => saveTeacherPayment(payload, teacherPaymentSeed),
    );
  },

  // ── Invoices ──────────────────────────────────────────────────────────────────

  async listInvoices() {
    return tryApi(
      () => apiRequest("/invoices"),
      () => getInvoices(),
    );
  },

  async createInvoice(payload) {
    return tryApi(
      () => apiRequest("/invoices", { method: "POST", body: payload }),
      () => saveInvoice(payload),
    );
  },

  async updateInvoice(id, payload) {
    return tryApi(
      () => apiRequest(`/invoices/${id}`, { method: "PUT", body: payload }),
      () => localUpdateInvoice(id, payload) || { ...payload, id },
    );
  },

  // ── Message Threads ───────────────────────────────────────────────────────────

  async listMessageThreads() {
    return tryApi(
      () => apiRequest("/message-threads"),
      () => getMessageThreads(),
    );
  },

  async createMessageThread(payload) {
    return tryApi(
      () => apiRequest("/message-threads", { method: "POST", body: payload }),
      () => saveThread(payload),
    );
  },

  async updateMessageThread(id, payload) {
    return tryApi(
      () => apiRequest(`/message-threads/${id}`, { method: "PUT", body: payload }),
      () => saveThread({ ...payload, id }),
    );
  },

  // ── Subjects ──────────────────────────────────────────────────────────────────

  async listSubjects() {
    return tryApi(
      () => apiRequest("/subjects"),
      () => getSubjects(),
    );
  },

  async createSubject(payload) {
    return tryApi(
      () => apiRequest("/subjects", { method: "POST", body: payload }),
      () => saveSubject(payload),
    );
  },

  async updateSubject(id, payload) {
    return tryApi(
      () => apiRequest(`/subjects/${id}`, { method: "PUT", body: payload }),
      () => localUpdateSubject(id, payload) || { ...payload, id },
    );
  },

  // ── School Profile ────────────────────────────────────────────────────────────

  async listSchoolProfile() {
    return tryApi(
      () => apiRequest("/school-profile"),
      () => [getSchoolProfile()],
    );
  },

  async saveSchoolProfile(payload) {
    return tryApi(
      () =>
        apiRequest(`/school-profile/${payload.id || "school-profile"}`, {
          method: "PUT",
          body: payload,
        }),
      () => localSaveSchoolProfile(payload),
    );
  },

  // ── CMS Pages ─────────────────────────────────────────────────────────────────

  async listCmsPages() {
    return tryApi(
      () => apiRequest("/cms-pages"),
      () => getCmsPages(),
    );
  },

  async createCmsPage(payload) {
    return tryApi(
      () => apiRequest("/cms-pages", { method: "POST", body: payload }),
      () => saveCmsPage(payload),
    );
  },

  async updateCmsPage(id, payload) {
    return tryApi(
      () => apiRequest(`/cms-pages/${id}`, { method: "PUT", body: payload }),
      () => localUpdateCmsPage(id, payload) || { ...payload, id },
    );
  },
};