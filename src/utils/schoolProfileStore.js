import { addLog, getSingleRecord, setSingleRecord } from "../db/localDb";

const SCHOOL_PROFILE_KEY = "schoolProfile";

const DEFAULT_PROFILE = {
  id: "school-profile",
  schoolName: "WiSchool Academy",
  name: "WiSchool Academy",
  schoolType: "Private K-12",
  phone: "+234 801 234 5678",
  email: "admin@wischool.edu.ng",
  address: "15 Education Crescent, Kano, Nigeria",
  campuses: [
    { id: "main-campus", name: "Main Campus", location: "Kano Municipal", students: 1240, staff: 96 },
    { id: "junior-wing", name: "Junior Wing", location: "Nassarawa", students: 680, staff: 54 },
    { id: "senior-wing", name: "Senior Wing", location: "Tarauni", students: 520, staff: 41 },
  ],
};

function normalizeProfile(profile = {}) {
  return {
    id: profile.id || "school-profile",
    schoolName: String(profile.schoolName || profile.name || DEFAULT_PROFILE.schoolName),
    name: String(profile.name || profile.schoolName || DEFAULT_PROFILE.name),
    schoolType: String(profile.schoolType || profile.title || DEFAULT_PROFILE.schoolType),
    phone: String(profile.phone || DEFAULT_PROFILE.phone),
    email: String(profile.email || DEFAULT_PROFILE.email),
    address: String(profile.address || DEFAULT_PROFILE.address),
    campuses: Array.isArray(profile.campuses)
      ? profile.campuses.map((c, i) => ({
          id: c.id || `campus-${i + 1}`,
          name: String(c.name || ""),
          location: String(c.location || ""),
          students: Number(c.students || 0),
          staff: Number(c.staff || 0),
        }))
      : DEFAULT_PROFILE.campuses,
    updatedAt: profile.updatedAt || new Date().toISOString(),
  };
}

export function getSchoolProfile() {
  const stored = getSingleRecord(SCHOOL_PROFILE_KEY);
  return normalizeProfile(stored || DEFAULT_PROFILE);
}

export function saveSchoolProfile(profile) {
  const normalized = normalizeProfile({ ...profile, updatedAt: new Date().toISOString() });
  setSingleRecord(SCHOOL_PROFILE_KEY, normalized);
  addLog({
    action: "update",
    entity: "school_profile",
    summary: `Updated school profile: ${normalized.schoolName}`,
  });
  return normalized;
}