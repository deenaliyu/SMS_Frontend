import { normalizeUserWithAccess, isSuperAdminEmail } from "../config/accessControl";
import { getCollection } from "../db/localDb";

const LOCAL_TOKEN_PREFIX = "local_";

// Static admin credentials for demo (password: "admin123" or any non-empty string)
const DEMO_PASSWORD = "admin123";

function getAllLocalUsers() {
  // Static seed users
  const staticUsers = [
    {
      id: 0,
      username: "sadeeq",
      fullName: "Sadeeq",
      email: "sadeeq@test.com",
      role: "System Admin",
      status: "Active",
    },
  ];

  // Dynamically saved admin users from localStorage
  const savedUsers = getCollection("adminUsers");

  const map = new Map();

  [...staticUsers, ...savedUsers].forEach((user) => {
    const key = String(user.email || "").trim().toLowerCase();
    if (key && !map.has(key)) {
      map.set(key, normalizeUserWithAccess(user));
    }
  });

  return Array.from(map.values());
}

function generateLocalToken() {
  return `${LOCAL_TOKEN_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function localLogin({ email, password }) {
  const emailKey = String(email || "").trim().toLowerCase();

  if (!emailKey) {
    throw new Error("Email is required.");
  }

  if (!password || !String(password).trim()) {
    throw new Error("Password is required.");
  }

  // Super admin - accept known demo password or any non-empty password in dev
  if (isSuperAdminEmail(emailKey)) {
    const superAdmin = normalizeUserWithAccess({
      id: 0,
      username: "sadeeq",
      fullName: "Sadeeq",
      email: "sadeeq@test.com",
      role: "System Admin",
      status: "Active",
    });

    return {
      token: generateLocalToken(),
      user: superAdmin,
    };
  }

  const allUsers = getAllLocalUsers();
  const match = allUsers.find(
    (u) => String(u.email || "").trim().toLowerCase() === emailKey,
  );

  if (!match) {
    throw new Error("No account found with this email.");
  }

  if (String(match.status || "").toLowerCase() === "inactive") {
    throw new Error("This account is inactive. Please contact an administrator.");
  }

  // In dev/offline mode accept any non-empty password
  return {
    token: generateLocalToken(),
    user: match,
  };
}

export function isLocalToken(token) {
  return String(token || "").startsWith(LOCAL_TOKEN_PREFIX);
}