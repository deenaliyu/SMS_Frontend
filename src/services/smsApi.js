import { ApiError, apiRequest } from "./apiClient";

function shouldFallbackToOffline(error) {
  if (error instanceof ApiError) {
    if (error.status === 404 || error.status >= 500) {
      return true;
    }

    return false;
  }

  return true;
}

async function postWithEndpointFallback(paths, payload, type) {
  const errors = [];

  for (const path of paths) {
    try {
      return await apiRequest(path, { method: "POST", body: payload });
    } catch (error) {
      errors.push(error);

      if (error instanceof ApiError && error.status === 404) {
        continue;
      }

      if (!shouldFallbackToOffline(error)) {
        throw error;
      }
    }
  }

  const lastError = errors[errors.length - 1];

  if (!shouldFallbackToOffline(lastError)) {
    throw lastError;
  }
  throw lastError || new Error(`Unable to complete ${type} request.`);
}

export const smsApi = {
  login(payload) {
    return apiRequest("/auth/login", { method: "POST", body: payload });
  },

  logout() {
    return apiRequest("/auth/logout", { method: "POST" });
  },

  me() {
    return apiRequest("/auth/me");
  },

  updateProfile(payload) {
    return apiRequest("/auth/me", { method: "PUT", body: payload });
  },

  updatePassword(payload) {
    return apiRequest("/auth/password", { method: "PUT", body: payload });
  },

  listAdminUsers() {
    return apiRequest("/admin-users");
  },

  getAdminUser(id) {
    return apiRequest(`/admin-users/${id}`);
  },

  updateAdminUser(id, payload) {
    return apiRequest(`/admin-users/${id}`, { method: "PUT", body: payload });
  },

  listTeachers() {
    return apiRequest("/teachers");
  },

  updateTeacher(id, payload) {
    return apiRequest(`/teachers/${id}`, { method: "PUT", body: payload });
  },

  deleteTeacher(id) {
    return apiRequest(`/teachers/${id}`, { method: "DELETE" });
  },

  listParents() {
    return apiRequest("/parents");
  },

  updateParent(id, payload) {
    return apiRequest(`/parents/${id}`, { method: "PUT", body: payload });
  },

  deleteParent(id) {
    return apiRequest(`/parents/${id}`, { method: "DELETE" });
  },

  listStudents() {
    return apiRequest("/students");
  },

  getStudentSelf() {
    return apiRequest("/students/self");
  },

  updateStudent(id, payload) {
    return apiRequest(`/students/${id}`, { method: "PUT", body: payload });
  },

  deleteStudent(id) {
    return apiRequest(`/students/${id}`, { method: "DELETE" });
  },

  listEvents() {
    return apiRequest("/events");
  },

  listNotices() {
    return apiRequest("/notices");
  },

  listFinancePayments() {
    return apiRequest("/finance-payments");
  },

  createFinancePayment(payload) {
    return apiRequest("/finance-payments", { method: "POST", body: payload });
  },

  listInvoices() {
    return apiRequest("/invoices");
  },

  createInvoice(payload) {
    return apiRequest("/invoices", { method: "POST", body: payload });
  },

  updateInvoice(id, payload) {
    return apiRequest(`/invoices/${id}`, { method: "PUT", body: payload });
  },

  listMessageThreads() {
    return apiRequest("/message-threads");
  },

  createMessageThread(payload) {
    return apiRequest("/message-threads", { method: "POST", body: payload });
  },

  updateMessageThread(id, payload) {
    return apiRequest(`/message-threads/${id}`, { method: "PUT", body: payload });
  },

  submitStudentAdmission(payload) {
    return postWithEndpointFallback(["/admissions", "/admission"], payload, "student_admission");
  },

  registerStudent(payload) {
    return postWithEndpointFallback(["/students/register", "/students"], payload, "student_registration");
  },

  createTeacher(payload) {
    return postWithEndpointFallback(["/teachers", "/teacher"], payload, "teacher_create");
  },

  createParent(payload) {
    return postWithEndpointFallback(["/parents", "/parent"], payload, "parent_create");
  },

  createEvent(payload) {
    return postWithEndpointFallback(["/events", "/event"], payload, "event_create");
  },

  createNotice(payload) {
    return postWithEndpointFallback(["/notices", "/notice", "/notice-board"], payload, "notice_create");
  },

  createAdminUser(payload) {
    return postWithEndpointFallback(["/admin-users", "/admins", "/admin-user"], payload, "admin_user_create");
  },

  createStudent(payload) {
    return postWithEndpointFallback(["/students", "/students/register"], payload, "student_create");
  },

  listSubjects() {
    return apiRequest("/subjects");
  },

  createSubject(payload) {
    return apiRequest("/subjects", { method: "POST", body: payload });
  },

  updateSubject(id, payload) {
    return apiRequest(`/subjects/${id}`, { method: "PUT", body: payload });
  },

  listSchoolProfile() {
    return apiRequest("/school-profile");
  },

  saveSchoolProfile(payload) {
    const profileId = payload.id || "school-profile";
    return apiRequest(`/school-profile/${profileId}`, { method: "PUT", body: payload });
  },

  listCmsPages() {
    return apiRequest("/cms-pages");
  },

  createCmsPage(payload) {
    return apiRequest("/cms-pages", { method: "POST", body: payload });
  },

  updateCmsPage(id, payload) {
    return apiRequest(`/cms-pages/${id}`, { method: "PUT", body: payload });
  },
};
