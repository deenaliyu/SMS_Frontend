export const SUPER_ADMIN_EMAIL = "sadeeq@test.com";

export const ACCESS_MODULES = [
  "Dashboard",
  "HR",
  "Teachers",
  "Parents",
  "Students",
  "Messaging",
  "Events",
  "Finance",
  "Notice Board",
  "School",
  "Subjects",
  "CMS",
  "Admin Users",
];

export function isSuperAdminEmail(email = "") {
  return String(email).trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function normalizeRole(role = "") {
  return String(role || "").trim().toLowerCase();
}

export function isStudentUser(user = {}) {
  return normalizeRole(user.role).includes("student");
}

export function isAdminUser(user = {}) {
  if (isSuperAdminEmail(user.email)) {
    return true;
  }

  const role = normalizeRole(user.role);
  const permissions = user.permissions && typeof user.permissions === "object" ? user.permissions : {};

  return role.includes("admin") || role.includes("staff") || Boolean(permissions["Admin Users"]);
}

export function getLoginRouteForUser(user = {}) {
  return isStudentUser(user) ? "/student-login" : "/admin-login";
}

export function getDefaultPrivateRoute(user = {}) {
  return isStudentUser(user) ? "/student-portal" : "/dashboard";
}

export function getFullAccessPermissions() {
  return ACCESS_MODULES.reduce((permissions, moduleName) => {
    permissions[moduleName] = true;
    return permissions;
  }, {});
}

export function normalizeUserWithAccess(user = {}, emailFallback = "") {
  const email = String(user.email || emailFallback || "").trim().toLowerCase();

  if (isSuperAdminEmail(email)) {
    return {
      ...user,
      id: user.id || "super-admin",
      username: user.username || "sadeeq",
      fullName: user.fullName || "Sadeeq",
      email: SUPER_ADMIN_EMAIL,
      role: "System Admin",
      status: "Active",
      permissions: getFullAccessPermissions(),
    };
  }

  const existingPermissions =
    user.permissions && typeof user.permissions === "object"
      ? user.permissions
      : isStudentUser(user)
        ? {}
        : getFullAccessPermissions();

  return {
    ...user,
    email,
    permissions: existingPermissions,
  };
}
