// ── ParentsDashboard ──────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Grid3X3, List, Pencil, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi.js";
import { getProfileAvatar } from "../utils/profileAvatar";
import {
  PageHeader, SearchBar, StatCard, Badge, Table, THead, Th, TBody, Tr, Td,
  Pagination, Spinner, EmptyState, Btn, ModalShell, FormField,
} from "../components/ui/index.jsx";

const INIT_EDIT = { name: "", gender: "", mobile: "", email: "", students: "" };

export function ParentsDashboard() {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingParent, setEditingParent] = useState(null);
  const [editForm, setEditForm] = useState(INIT_EDIT);
  const [editError, setEditError] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    let active = true;
    smsApi.listParents()
      .then((res) => { if (active) setParents(Array.isArray(res) ? res : []); })
      .catch((err) => { if (active) setErrorMessage(err.message || "Unable to load parents."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return parents;
    return parents.filter((p) =>
      [p.name, p.parentId, p.email].some((v) => String(v || "").toLowerCase().includes(text))
    );
  }, [parents, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function openEdit(parent) {
    setEditingParent(parent);
    setEditForm({ name: parent.name || "", gender: parent.gender || "", mobile: parent.mobile || "", email: parent.email || "", students: String(parent.students || "") });
    setEditError("");
  }

  async function handleEditSubmit() {
    if (!editForm.name.trim() || !editForm.mobile.trim() || !editForm.email.trim()) {
      setEditError("Name, mobile and email are required."); return;
    }
    if (!/^\d{11}$/.test(editForm.mobile.trim())) { setEditError("Mobile number must be 11 digits."); return; }
    try {
      const updated = await smsApi.updateParent(editingParent.id, { ...editingParent, ...editForm, mobileNumber: editForm.mobile, students: Number(editForm.students) || 0 });
      setParents((p) => p.map((e) => e.id === updated.id ? updated : e));
      setEditingParent(null);
    } catch (err) {
      setEditError(err.message || "Unable to update parent.");
    }
  }

  async function handleDelete(parent) {
    if (!window.confirm(`Delete parent ${parent.name}?`)) return;
    try {
      await smsApi.deleteParent(parent.id);
      setParents((p) => p.filter((e) => e.id !== parent.id));
    } catch (err) {
      setErrorMessage(err.message || "Unable to delete parent.");
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400";

  return (
    <Layout activeTab="Parents">
      <PageHeader
        title="Parents"
        subtitle="Manage parent and guardian records"
        action={
          <div className="flex gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button type="button" onClick={() => setView("table")} className={`p-2 cursor-pointer ${view === "table" ? "bg-green-50 text-green-600" : "text-gray-400"}`}><List className="w-4 h-4" /></button>
              <button type="button" onClick={() => setView("grid")} className={`p-2 cursor-pointer ${view === "grid" ? "bg-green-50 text-green-600" : "text-gray-400"}`}><Grid3X3 className="w-4 h-4" /></button>
            </div>
            <Btn onClick={() => navigate("/parents/new")}>+ Add Parent</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Users} label="Total Parents" value={parents.length} colorIndex={2} />
        <StatCard icon={Users} label="Students Linked" value={parents.reduce((s, p) => s + (Number(p.students) || 0), 0)} colorIndex={0} />
        <StatCard icon={Users} label="Male Guardians" value={parents.filter((p) => String(p.gender || "").toLowerCase() === "male").length} colorIndex={1} />
        <StatCard icon={Users} label="Female Guardians" value={parents.filter((p) => String(p.gender || "").toLowerCase() === "female").length} colorIndex={3} />
      </div>

      <div className="mb-4 max-w-xs">
        <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search parents…" />
      </div>

      {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errorMessage}</div>}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No parents found" description="Add a parent or adjust your search." action={<Btn onClick={() => navigate("/parents/new")}>Add Parent</Btn>} />
      ) : view === "table" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <THead>
              <Th>#</Th><Th>Parent ID</Th><Th>Name</Th><Th>Gender</Th>
              <Th>Mobile</Th><Th>Email</Th><Th>Wards</Th><Th center>Actions</Th>
            </THead>
            <TBody>
              {paged.map((parent, i) => (
                <Tr key={parent.id} onClick={() => navigate("/parents/profile", { state: { parent } })}>
                  <Td muted>{(page - 1) * PER_PAGE + i + 1}</Td>
                  <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{parent.parentId || "—"}</span></Td>
                  <Td><span className="font-medium text-gray-900">{parent.name}</span></Td>
                  <Td muted>{parent.gender}</Td>
                  <Td muted>{parent.mobile}</Td>
                  <Td muted>{parent.email}</Td>
                  <Td muted>{parent.students}</Td>
                  <Td center>
                    <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => navigate("/parents/profile", { state: { parent } })} className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"><ExternalLink className="w-3 h-3" />View</button>
                      <button type="button" onClick={() => openEdit(parent)} className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold hover:underline cursor-pointer"><Pencil className="w-3 h-3" />Edit</button>
                      <button type="button" onClick={() => handleDelete(parent)} className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold hover:underline cursor-pointer"><Trash2 className="w-3 h-3" />Delete</button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          <Pagination currentPage={page} totalPages={totalPages} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((parent) => (
            <div key={parent.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
              <button type="button" className="w-full text-center mb-3" onClick={() => navigate("/parents/profile", { state: { parent } })}>
                <img src={getProfileAvatar(parent.name, "Parent")} alt={parent.name} className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover group-hover:scale-105 transition-transform" />
                <p className="font-bold text-gray-900 text-sm leading-tight">{parent.name}</p>
                <p className="text-green-600 text-xs mt-0.5 font-medium">{parent.students} Ward{parent.students !== 1 ? "s" : ""}</p>
              </button>
              <div className="flex items-center justify-center gap-3">
                <button type="button" onClick={() => openEdit(parent)} className="text-amber-500 hover:text-amber-600 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => handleDelete(parent)} className="text-red-500 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingParent && (
        <ModalShell title="Edit Parent" onClose={() => setEditingParent(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name" required><input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} /></FormField>
            <FormField label="Gender"><select value={editForm.gender} onChange={(e) => setEditForm((p) => ({ ...p, gender: e.target.value }))} className={inputCls}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></FormField>
            <FormField label="Mobile" required><input value={editForm.mobile} onChange={(e) => setEditForm((p) => ({ ...p, mobile: e.target.value }))} placeholder="11 digits" className={inputCls} /></FormField>
            <FormField label="Email" required><input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className={inputCls} /></FormField>
            <div className="sm:col-span-2"><FormField label="No. of Wards"><input type="number" min="0" value={editForm.students} onChange={(e) => setEditForm((p) => ({ ...p, students: e.target.value }))} className={inputCls} /></FormField></div>
          </div>
          {editError && <p className="mt-3 text-sm text-red-600">{editError}</p>}
          <div className="flex justify-end gap-3 mt-5">
            <Btn variant="secondary" onClick={() => setEditingParent(null)}>Cancel</Btn>
            <Btn onClick={handleEditSubmit}>Save Changes</Btn>
          </div>
        </ModalShell>
      )}
    </Layout>
  );
}

// ── AddNewParent ──────────────────────────────────────────────────────────────
import { useState as useState2 } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { getParentDraft, saveParentDraft } from "../utils/parentDraft";
import { PageHeader as PH2, FormField as FF2, Btn as Btn2 } from "../components/ui/index.jsx";

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Alhaji", "Alhaja", "Chief"];
const GENDERS = ["Male", "Female", "Other"];

function getInitialBasic() {
  const d = getParentDraft();
  return { title: d.title || "Mr", firstName: d.firstName || "", middleName: d.middleName || "", lastName: d.lastName || "", dateOfBirth: d.dateOfBirth || "", gender: d.gender || "", mobileNumber: d.mobileNumber || "", email: d.email || "", educationalQualification: d.educationalQualification || "", occupation: d.occupation || "", annualIncome: d.annualIncome || "" };
}

const inputCls2 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

export function AddNewParent() {
  const navigate = useNavigate();
  const [form, setForm2] = useState2(getInitialBasic);
  const [error, setError2] = useState2("");

  function handleChange(field, value) {
    setForm2((p) => ({ ...p, [field]: value }));
    if (error) setError2("");
  }

  function handleNext() {
    if (!form.firstName || !form.lastName || !form.gender || !form.mobileNumber || !form.email) { setError2("Please complete all required fields."); return; }
    if (!/^\d{11}$/.test(form.mobileNumber)) { setError2("Mobile number must be exactly 11 digits."); return; }
    saveParentDraft(form);
    navigate("/parents/new/address");
  }

  return (
    <Layout activeTab="Parents">
      <PH2 title="Add New Parent" subtitle="Step 1 of 4 — Basic Information"
        breadcrumbs={[{ label: "Parents", onClick: () => navigate("/parents") }, { label: "Add New" }, { label: "Basic Details" }]} />

      {/* Step bar */}
      <div className="flex items-center gap-2 mb-6">
        {["Basic Info", "Address", "Login", "Wards"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-200 text-gray-500"}`}>{i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${i === 0 ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
            {i < 3 && <div className="w-8 h-0.5 bg-gray-200 rounded" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FF2 label="Title" required>
            <select value={form.title} onChange={(e) => handleChange("title", e.target.value)} className={inputCls2}>
              {TITLES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FF2>
          <FF2 label="First Name" required><input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="First name" className={inputCls2} /></FF2>
          <FF2 label="Middle Name"><input value={form.middleName} onChange={(e) => handleChange("middleName", e.target.value)} placeholder="Middle name (optional)" className={inputCls2} /></FF2>
          <FF2 label="Last Name" required><input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last name" className={inputCls2} /></FF2>
          <FF2 label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} className={inputCls2} /></FF2>
          <FF2 label="Gender" required>
            <select value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} className={inputCls2}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </FF2>
          <FF2 label="Mobile Number" required><input value={form.mobileNumber} onChange={(e) => handleChange("mobileNumber", e.target.value)} placeholder="080XXXXXXXX" className={inputCls2} /></FF2>
          <FF2 label="Email Address" required><input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="parent@example.com" className={inputCls2} /></FF2>
          <FF2 label="Education"><input value={form.educationalQualification} onChange={(e) => handleChange("educationalQualification", e.target.value)} placeholder="e.g. B.Sc, M.Sc" className={inputCls2} /></FF2>
          <FF2 label="Occupation"><input value={form.occupation} onChange={(e) => handleChange("occupation", e.target.value)} placeholder="Occupation" className={inputCls2} /></FF2>
          <div className="sm:col-span-2"><FF2 label="Annual Income"><input value={form.annualIncome} onChange={(e) => handleChange("annualIncome", e.target.value)} placeholder="e.g. ₦1,200,000" className={inputCls2} /></FF2></div>
        </div>
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn2 variant="secondary" onClick={() => navigate("/parents")}>← Cancel</Btn2>
          <Btn2 onClick={handleNext}>Next: Address →</Btn2>
        </div>
      </div>
    </Layout>
  );
}

// ── ResidentialAddress ────────────────────────────────────────────────────────
import { useState as useState3 } from "react";
import { getParentDraft as getDraft3, saveParentDraft as saveDraft3 } from "../utils/parentDraft";
import { PageHeader as PH3, FormField as FF3, Btn as Btn3 } from "../components/ui/index.jsx";

const STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
const LGAS = ["Bebeji","Bichi","Bagwai","Dawakin Kudu","Fagge","Gwale","Kano Municipal","Nasarawa","Tarauni","Ungogo","Wudil","Other"];

function getInitialAddr() {
  const d = getDraft3();
  return { state: d.state || "", lga: d.lga || "", address: d.address || "" };
}

const inputCls3 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

export function ResidentialAddress() {
  const navigate = useNavigate();
  const [form, setForm3] = useState3(getInitialAddr);
  const [error, setError3] = useState3("");

  function handleChange(field, value) { setForm3((p) => ({ ...p, [field]: value })); if (error) setError3(""); }

  function handleNext() {
    if (!form.state || !form.lga || !form.address.trim()) { setError3("State, LGA and address are required."); return; }
    saveDraft3(form);
    navigate("/parents/new/login");
  }

  return (
    <Layout activeTab="Parents">
      <PH3 title="Add New Parent" subtitle="Step 2 of 4 — Residential Address"
        breadcrumbs={[{ label: "Parents", onClick: () => navigate("/parents") }, { label: "Add New" }, { label: "Address" }]} />

      <div className="flex items-center gap-2 mb-6">
        {["Basic Info", "Address", "Login", "Wards"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>{i < 1 ? "✓" : i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${i === 1 ? "text-gray-900" : i < 1 ? "text-green-600" : "text-gray-400"}`}>{s}</span>
            {i < 3 && <div className={`w-8 h-0.5 rounded ${i < 1 ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FF3 label="State" required>
            <select value={form.state} onChange={(e) => handleChange("state", e.target.value)} className={inputCls3}>
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FF3>
          <FF3 label="LGA" required>
            <select value={form.lga} onChange={(e) => handleChange("lga", e.target.value)} className={inputCls3}>
              <option value="">Select LGA</option>
              {LGAS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </FF3>
          <div className="sm:col-span-2">
            <FF3 label="Home Address" required>
              <textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} rows={3} placeholder="Full residential address" className={inputCls3 + " resize-none"} />
            </FF3>
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn3 variant="secondary" onClick={() => navigate("/parents/new")}>← Previous</Btn3>
          <Btn3 onClick={handleNext}>Next: Login →</Btn3>
        </div>
      </div>
    </Layout>
  );
}

// ── ParentPass (login details) ────────────────────────────────────────────────
import { useState as useState4 } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getParentDraft as getDraft4, saveParentDraft as saveDraft4 } from "../utils/parentDraft";
import { PageHeader as PH4, FormField as FF4, Btn as Btn4 } from "../components/ui/index.jsx";

function getInitialLogin() {
  const d = getDraft4();
  return { username: d.username || "", email: d.email || "", password: d.password || "", repeatPassword: d.repeatPassword || "" };
}

const inputCls4 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

export function ParentPass() {
  const navigate = useNavigate();
  const [form, setForm4] = useState4(getInitialLogin);
  const [showPwd, setShowPwd4] = useState4({ password: false, repeatPassword: false });
  const [error, setError4] = useState4("");

  function handleChange(field, value) { setForm4((p) => ({ ...p, [field]: value })); if (error) setError4(""); }

  function handleNext() {
    if (!form.username || !form.email || !form.password || !form.repeatPassword) { setError4("Please complete all login details."); return; }
    if (form.password !== form.repeatPassword) { setError4("Passwords do not match."); return; }
    saveDraft4(form);
    navigate("/parents/new/link");
  }

  return (
    <Layout activeTab="Parents">
      <PH4 title="Add New Parent" subtitle="Step 3 of 4 — Login Details"
        breadcrumbs={[{ label: "Parents", onClick: () => navigate("/parents") }, { label: "Add New" }, { label: "Login" }]} />

      <div className="flex items-center gap-2 mb-6">
        {["Basic Info", "Address", "Login", "Wards"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>{i < 2 ? "✓" : i === 2 ? "3" : "4"}</div>
            <span className={`text-xs font-medium hidden sm:block ${i === 2 ? "text-gray-900" : i < 2 ? "text-green-600" : "text-gray-400"}`}>{s}</span>
            {i < 3 && <div className={`w-8 h-0.5 rounded ${i < 2 ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FF4 label="Username" required><input value={form.username} onChange={(e) => handleChange("username", e.target.value)} placeholder="Choose a username" className={inputCls4} /></FF4>
          <FF4 label="Email Address" required><input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="parent@example.com" className={inputCls4} /></FF4>
          {["password", "repeatPassword"].map((field) => (
            <FF4 key={field} label={field === "password" ? "Password" : "Repeat Password"} required>
              <div className="relative">
                <input
                  type={showPwd[field] ? "text" : "password"}
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={field === "password" ? "Create password" : "Repeat password"}
                  className={inputCls4 + " pr-11"}
                />
                <button type="button" onClick={() => setShowPwd4((p) => ({ ...p, [field]: !p[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  {showPwd[field] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </FF4>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn4 variant="secondary" onClick={() => navigate("/parents/new/address")}>← Previous</Btn4>
          <Btn4 onClick={handleNext}>Next: Ward Details →</Btn4>
        </div>
      </div>
    </Layout>
  );
}

// ── ParentsProfile ────────────────────────────────────────────────────────────
import { useState as useState5 } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, User, ChevronRight as CR } from "lucide-react";
import { getProfileAvatar as getAvatar5 } from "../utils/profileAvatar";
import { PageHeader as PH5, Btn as Btn5 } from "../components/ui/index.jsx";

function InfoCard5({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-green-50"><Icon className="w-4 h-4 text-green-600" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
          <p className="text-sm text-gray-800 font-medium break-words">{value || "—"}</p>
        </div>
      </div>
    </div>
  );
}

export function ParentsProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab5] = useState5("overview");
  const parent = location.state?.parent || null;

  if (!parent) {
    return (
      <Layout activeTab="Parents">
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Parent not found.</p>
          <Btn5 onClick={() => navigate("/parents")}>← Back to Parents</Btn5>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="Parents">
      <PH5 title="Parent Profile"
        breadcrumbs={[{ label: "Parents", onClick: () => navigate("/parents") }, { label: parent.name }]} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-green-600 to-green-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
            <img src={getAvatar5(parent.name, "Parent")} alt={parent.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md" />
            <div className="mb-1 flex-1">
              <p className="font-bold text-gray-900 text-xl">{parent.name}</p>
              <p className="text-sm text-gray-500">{parent.students} Student{parent.students !== 1 ? "s" : ""} / Ward{parent.students !== 1 ? "s" : ""}</p>
            </div>
            <Btn5 size="sm" onClick={() => navigate("/messaging", { state: { contactName: parent.name } })}>Send Message</Btn5>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-6">
            {[["overview", "Profile Overview"], ["child", "Children / Wards"], ["payment", "Payment History"]].map(([key, label]) => (
              <button key={key} type="button" onClick={() => setTab5(key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${tab === key ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <InfoCard5 icon={Mail} label="Email" value={parent.email} />
              <InfoCard5 icon={Phone} label="Phone" value={parent.mobile} />
              <InfoCard5 icon={MapPin} label="Address" value={parent.address} />
              <InfoCard5 icon={Calendar} label="Date of Birth" value={parent.dateOfBirth} />
              <InfoCard5 icon={User} label="Gender" value={parent.gender} />
              <InfoCard5 icon={User} label="Parent ID" value={parent.parentId} />
            </div>
          )}

          {tab === "child" && (
            <div>
              <p className="text-sm text-gray-700 font-semibold mb-2">Linked Student IDs</p>
              {parent.linkedStudentIds?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parent.linkedStudentIds.map((id) => (
                    <span key={id} className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 text-xs font-mono rounded-xl">{id}</span>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 italic">No students linked yet.</p>}
              <p className="text-sm text-gray-500 mt-3">Total Wards: <span className="font-bold text-gray-800">{parent.students || 0}</span></p>
            </div>
          )}

          {tab === "payment" && (
            <p className="text-sm text-gray-500 italic">Payment history will be displayed here when available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}