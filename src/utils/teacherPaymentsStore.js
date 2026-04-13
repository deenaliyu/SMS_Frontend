import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const LEGACY_PAYMENTS_KEY = "sms_teacher_payments";

function normalizeAmount(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizePayment(payment = {}) {
  const grossAmount = normalizeAmount(payment.grossAmount);
  const deductions = normalizeAmount(payment.deductions);
  const netSalary = payment.netSalary !== undefined ? normalizeAmount(payment.netSalary) : grossAmount - deductions;

  return {
    id: payment.id || Date.now(),
    teacherId: String(payment.teacherId || "").trim(),
    name: String(payment.name || "").trim(),
    paymentDate: String(payment.paymentDate || "").trim(),
    grossAmount,
    deductions,
    netSalary,
    status: String(payment.status || "Paid").trim() || "Paid",
  };
}

function migrateLegacyPayments() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LEGACY_PAYMENTS_KEY);

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const legacy = parsed.map((entry) => normalizePayment(entry));
    const existing = getCollection(DB_COLLECTIONS.FINANCE_PAYMENTS).map((entry) => normalizePayment(entry));

    const map = new Map();

    [...legacy, ...existing].forEach((entry) => {
      const key = `${entry.teacherId}-${entry.paymentDate}-${entry.id}`;

      if (!map.has(key)) {
        map.set(key, entry);
      }
    });

    setCollection(DB_COLLECTIONS.FINANCE_PAYMENTS, Array.from(map.values()));
  } catch {
    // ignore bad legacy
  }
}

export function getTeacherPayments(seedPayments = []) {
  migrateLegacyPayments();

  const seeded = seedCollection(
    DB_COLLECTIONS.FINANCE_PAYMENTS,
    (seedPayments || []).map((entry) => normalizePayment(entry)),
    (entry) => `${entry.teacherId}-${entry.paymentDate}-${entry.id}`,
  );

  return seeded.map((entry) => normalizePayment(entry));
}

export function saveTeacherPayment(payment, seedPayments = []) {
  const current = getTeacherPayments(seedPayments);
  const normalized = normalizePayment(payment);

  const next = [normalized, ...current];
  setCollection(DB_COLLECTIONS.FINANCE_PAYMENTS, next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_PAYMENTS_KEY, JSON.stringify(next));
  }

  addLog({
    action: "save",
    entity: "finance_payment",
    summary: `Saved payment for ${normalized.name || normalized.teacherId}`,
    payload: {
      teacherId: normalized.teacherId,
      amount: normalized.netSalary,
      paymentDate: normalized.paymentDate,
    },
  });

  return normalized;
}
