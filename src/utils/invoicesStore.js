import { DB_COLLECTIONS, addLog, getCollection, seedCollection, setCollection } from "../db/localDb";

const INVOICE_SEED = [
  { id: 1, invoiceId: "INV-001", parentName: "John Doe", studentName: "James Doe", studentId: "STU001", paymentFor: "Tuition Fee", session: "2025/2026", term: "1st Term", amount: "15000", dueDate: "2025-09-30", status: "Paid", createdOn: "2025-08-01T00:00:00.000Z" },
  { id: 2, invoiceId: "INV-002", parentName: "Jane Smith", studentName: "Amy Smith", studentId: "STU002", paymentFor: "Tuition Fee", session: "2025/2026", term: "1st Term", amount: "15000", dueDate: "2025-09-30", status: "Unpaid", createdOn: "2025-08-05T00:00:00.000Z" },
  { id: 3, invoiceId: "INV-003", parentName: "Michael Brown", studentName: "Mike Jr. Brown", studentId: "STU003", paymentFor: "Tuition Fee", session: "2025/2026", term: "1st Term", amount: "15000", dueDate: "2025-08-31", status: "Overdue", createdOn: "2025-07-28T00:00:00.000Z" },
  { id: 4, invoiceId: "INV-004", parentName: "Sarah Johnson", studentName: "Sara Johnson", studentId: "STU004", paymentFor: "Lab Fee", session: "2025/2026", term: "1st Term", amount: "5000", dueDate: "2025-10-15", status: "Paid", createdOn: "2025-08-10T00:00:00.000Z" },
];

function normalizeInvoice(invoice = {}) {
  return {
    id: invoice.id || `inv-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    invoiceId: String(invoice.invoiceId || "").trim(),
    parentName: String(invoice.parentName || invoice.name || "").trim(),
    studentName: String(invoice.studentName || "").trim(),
    studentId: String(invoice.studentId || "").trim(),
    paymentFor: String(invoice.paymentFor || invoice.title || "").trim(),
    session: String(invoice.session || "").trim(),
    term: String(invoice.term || "").trim(),
    amount: String(invoice.amount || "0"),
    dueDate: String(invoice.dueDate || "").trim(),
    status: String(invoice.status || "Unpaid").trim(),
    createdOn: invoice.createdOn || new Date().toISOString(),
    name: String(invoice.parentName || invoice.name || "").trim(),
    title: String(invoice.paymentFor || invoice.title || "").trim(),
  };
}

export function getInvoices() {
  const seeded = seedCollection(
    DB_COLLECTIONS.INVOICES,
    INVOICE_SEED.map(normalizeInvoice),
    (e) => e.invoiceId || e.id,
  );
  return seeded.map(normalizeInvoice);
}

export function saveInvoice(invoice) {
  const normalized = normalizeInvoice(invoice);
  const current = getInvoices();
  const next = [normalized, ...current];
  setCollection(DB_COLLECTIONS.INVOICES, next);
  addLog({
    action: "create",
    entity: "invoice",
    summary: `Created invoice ${normalized.invoiceId} for ${normalized.parentName}`,
  });
  return normalized;
}

export function updateInvoice(id, updates) {
  const current = getInvoices();
  let updated = null;

  const next = current.map((inv) => {
    if (String(inv.id) !== String(id) && inv.invoiceId !== String(id)) return inv;
    updated = normalizeInvoice({ ...inv, ...updates, id: inv.id });
    return updated;
  });

  setCollection(DB_COLLECTIONS.INVOICES, next);
  return updated;
}