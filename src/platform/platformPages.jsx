// ── SchoolPage ────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Globe, Upload } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi";
import { getSchoolProfile, saveSchoolProfile } from "../utils/schoolProfileStore";
import {
  PageHeader, FormField, Btn, Spinner,
} from "../components/ui/index.jsx";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white placeholder:text-gray-400";

export function SchoolPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolName: "", motto: "", email: "", phone: "", website: "",
    address: "", state: "", lga: "", country: "Nigeria",
    principalName: "", foundedYear: "", description: "", logoUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const local = getSchoolProfile();
    if (local && local.schoolName) { if (active) { setForm((p) => ({ ...p, ...local })); setIsLoading(false); } return; }
    smsApi.getSchoolProfile()
      .then((res) => { if (active && res) setForm((p) => ({ ...p, ...res })); })
      .catch(() => {})
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setSaved(false); if (error) setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.schoolName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("School name, email and phone are required."); return;
    }
    setIsSaving(true); setError("");
    try {
      await smsApi.updateSchoolProfile(form);
      saveSchoolProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="Platform">
      <PageHeader title="School Profile" subtitle="Manage your school's information and settings"
        breadcrumbs={[{ label: "Platform", onClick: () => navigate("/platform") }, { label: "School Profile" }]} />

      {isLoading ? <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div> : (
        <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
          {/* Logo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">School Logo</h3>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {form.logoUrl
                  ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  : <Building2 className="w-8 h-8 text-gray-300" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Upload school logo</p>
                <p className="text-xs text-gray-400 mb-2">PNG or JPG, recommended 200×200px</p>
                <FormField label="">
                  <input name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="Paste image URL…" className={inputCls} />
                </FormField>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormField label="School Name" required>
                  <input name="schoolName" value={form.schoolName} onChange={handleChange} placeholder="Full school name" className={inputCls} />
                </FormField>
              </div>
              <FormField label="Motto">
                <input name="motto" value={form.motto} onChange={handleChange} placeholder="School motto" className={inputCls} />
              </FormField>
              <FormField label="Founded Year">
                <input name="foundedYear" value={form.foundedYear} onChange={handleChange} placeholder="e.g. 1995" className={inputCls} />
              </FormField>
              <FormField label="Principal / Head">
                <input name="principalName" value={form.principalName} onChange={handleChange} placeholder="Principal's name" className={inputCls} />
              </FormField>
              <FormField label="Country">
                <input name="country" value={form.country} onChange={handleChange} className={inputCls} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Description">
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the school…" className={inputCls + " resize-none"} />
                </FormField>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email" required>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="school@example.com" className={inputCls + " pl-10"} /></div>
              </FormField>
              <FormField label="Phone" required>
                <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input name="phone" value={form.phone} onChange={handleChange} placeholder="080XXXXXXXX" className={inputCls + " pl-10"} /></div>
              </FormField>
              <FormField label="Website">
                <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input name="website" value={form.website} onChange={handleChange} placeholder="https://yourschool.edu.ng" className={inputCls + " pl-10"} /></div>
              </FormField>
              <FormField label="State">
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputCls} />
              </FormField>
              <FormField label="LGA">
                <input name="lga" value={form.lga} onChange={handleChange} placeholder="LGA" className={inputCls} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Address">
                  <div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="School address" className={inputCls + " pl-10 resize-none"} /></div>
                </FormField>
              </div>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
          {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">School profile saved successfully.</div>}

          <div className="flex justify-end gap-3">
            <Btn variant="secondary" type="button" onClick={() => navigate("/platform")}>Discard</Btn>
            <Btn type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save Profile"}</Btn>
          </div>
        </form>
      )}
    </Layout>
  );
}

// ── SubjectsPage ──────────────────────────────────────────────────────────────
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { smsApi as smsApi2 } from "../services/smsApi";
import { getSubjects, saveSubject, updateSubject, deleteSubject } from "../utils/subjectsStore";
import { PageHeader as PH2, SearchBar, Badge as Badge2, Table as T2, THead as TH2, Th as Th2, TBody as TB2, Tr as Tr2, Td as Td2, Spinner as Spin2, EmptyState as EE2, ModalShell as MS2, FormField as FF2, Btn as Btn2 } from "../components/ui/index.jsx";
import { BookOpen } from "lucide-react";

export function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects2] = useState2([]);
  const [isLoading2, setIsLoading2] = useState2(true);
  const [search2, setSearch2] = useState2("");
  const [editModal, setEditModal2] = useState2(null); // null | "new" | subject obj
  const [formSubject, setFormSubject2] = useState2({ name: "", code: "", department: "", level: "" });
  const [formError2, setFormError2] = useState2("");
  const [isSaving2, setIsSaving2] = useState2(false);

  useEffect2(() => {
    let active = true;
    const local = getSubjects();
    if (local.length > 0) { if (active) { setSubjects2(local); setIsLoading2(false); } return; }
    smsApi2.listSubjects()
      .then((res) => { if (active) setSubjects2(Array.isArray(res) ? res : []); })
      .catch(() => {})
      .finally(() => { if (active) setIsLoading2(false); });
    return () => { active = false; };
  }, []);

  const filtered2 = useMemo2(() => {
    const t = search2.trim().toLowerCase();
    return subjects.filter((s) => !t || [s.name, s.code, s.department].some((v) => String(v || "").toLowerCase().includes(t)));
  }, [subjects, search2]);

  function openNew() { setFormSubject2({ name: "", code: "", department: "", level: "" }); setFormError2(""); setEditModal2("new"); }
  function openEdit(sub) { setFormSubject2({ name: sub.name, code: sub.code || "", department: sub.department || "", level: sub.level || "" }); setFormError2(""); setEditModal2(sub); }

  async function handleSave2() {
    if (!formSubject.name.trim()) { setFormError2("Subject name is required."); return; }
    setIsSaving2(true); setFormError2("");
    try {
      if (editModal === "new") {
        const newSub = saveSubject({ ...formSubject, id: Date.now() });
        setSubjects2((p) => [...p, newSub]);
      } else {
        const updated = updateSubject(editModal.id, formSubject);
        setSubjects2((p) => p.map((s) => s.id === updated.id ? updated : s));
      }
      setEditModal2(null);
    } catch (err) {
      setFormError2(err.message || "Unable to save subject.");
    } finally {
      setIsSaving2(false);
    }
  }

  function handleDelete2(id) {
    if (!window.confirm("Delete this subject?")) return;
    deleteSubject(id);
    setSubjects2((p) => p.filter((s) => s.id !== id));
  }

  const inputCls2 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  return (
    <Layout activeTab="Platform">
      <PH2 title="Subjects" subtitle="Manage school subjects and curriculum"
        breadcrumbs={[{ label: "Platform", onClick: () => navigate("/platform") }, { label: "Subjects" }]}
        action={<Btn2 onClick={openNew}><Plus className="w-4 h-4 mr-1" />Add Subject</Btn2>}
      />

      <div className="mb-4 max-w-xs"><SearchBar value={search2} onChange={(e) => setSearch2(e.target.value)} placeholder="Search subjects…" /></div>

      {isLoading2 ? <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spin2 /></div>
        : filtered2.length === 0 ? <EE2 icon={BookOpen} title="No subjects found" description="Add a subject to get started." action={<Btn2 onClick={openNew}>Add Subject</Btn2>} />
        : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <T2>
              <TH2><Th2>#</Th2><Th2>Subject Name</Th2><Th2>Code</Th2><Th2>Department</Th2><Th2>Level</Th2><Th2 center>Actions</Th2></TH2>
              <TB2>
                {filtered2.map((sub, i) => (
                  <Tr2 key={sub.id}>
                    <Td2 muted>{i + 1}</Td2>
                    <Td2><span className="font-medium text-gray-900">{sub.name}</span></Td2>
                    <Td2><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{sub.code || "—"}</span></Td2>
                    <Td2 muted>{sub.department || "—"}</Td2>
                    <Td2><Badge2 label={sub.level || "All"} /></Td2>
                    <Td2 center>
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => openEdit(sub)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDelete2(sub.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </Td2>
                  </Tr2>
                ))}
              </TB2>
            </T2>
          </div>
        )}

      {editModal && (
        <MS2 title={editModal === "new" ? "Add Subject" : "Edit Subject"} onClose={() => setEditModal2(null)} size="sm">
          <div className="space-y-3">
            <FF2 label="Subject Name" required><input value={formSubject.name} onChange={(e) => setFormSubject2((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Mathematics" className={inputCls2} /></FF2>
            <FF2 label="Subject Code"><input value={formSubject.code} onChange={(e) => setFormSubject2((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. MTH101" className={inputCls2} /></FF2>
            <FF2 label="Department"><input value={formSubject.department} onChange={(e) => setFormSubject2((p) => ({ ...p, department: e.target.value }))} placeholder="e.g. Sciences" className={inputCls2} /></FF2>
            <FF2 label="Level">
              <select value={formSubject.level} onChange={(e) => setFormSubject2((p) => ({ ...p, level: e.target.value }))} className={inputCls2}>
                <option value="">All Levels</option>
                {["JSS","SSS","Both"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </FF2>
            {formError2 && <p className="text-sm text-red-600">{formError2}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Btn2 variant="secondary" onClick={() => setEditModal2(null)}>Cancel</Btn2>
              <Btn2 onClick={handleSave2} disabled={isSaving2}>{isSaving2 ? "Saving…" : "Save"}</Btn2>
            </div>
          </div>
        </MS2>
      )}
    </Layout>
  );
}

// ── CmsPage ───────────────────────────────────────────────────────────────────
import { useEffect as useEffect3, useMemo as useMemo3, useState as useState3 } from "react";
import { FileText, Eye as EyeIcon, Pencil as PencilIcon, Trash2 as Trash2Icon } from "lucide-react";
import { getCmsPages, saveCmsPage, updateCmsPage, deleteCmsPage } from "../utils/cmsStore";
import { PageHeader as PH3, SearchBar as SB3, Badge as Badge3, Table as T3, THead as TH3, Th as Th3, TBody as TB3, Tr as Tr3, Td as Td3, Spinner as Spin3, EmptyState as EE3, ModalShell as MS3, FormField as FF3, Btn as Btn3 } from "../components/ui/index.jsx";

export function CmsPage() {
  const navigate = useNavigate();
  const [pages3, setPages3] = useState3([]);
  const [isLoading3, setIsLoading3] = useState3(true);
  const [search3, setSearch3] = useState3("");
  const [modal3, setModal3] = useState3(null); // null | "new" | "view" | page obj
  const [viewPage3, setViewPage3] = useState3(null);
  const [formCms, setFormCms3] = useState3({ title: "", slug: "", status: "Draft", content: "" });
  const [formErr3, setFormErr3] = useState3("");
  const [isSaving3, setIsSaving3] = useState3(false);

  useEffect3(() => {
    let active = true;
    const local = getCmsPages();
    if (local.length > 0) { if (active) { setPages3(local); setIsLoading3(false); } return; }
    setIsLoading3(false);
    return () => { active = false; };
  }, []);

  const filtered3 = useMemo3(() => {
    const t = search3.trim().toLowerCase();
    return pages3.filter((p) => !t || [p.title, p.slug, p.status].some((v) => String(v || "").toLowerCase().includes(t)));
  }, [pages3, search3]);

  function openNew3() { setFormCms3({ title: "", slug: "", status: "Draft", content: "" }); setFormErr3(""); setModal3("new"); }
  function openEdit3(page) { setFormCms3({ title: page.title, slug: page.slug || "", status: page.status || "Draft", content: page.content || "" }); setFormErr3(""); setModal3(page); }
  function openView3(page) { setViewPage3(page); setModal3("view"); }

  async function handleSaveCms() {
    if (!formCms.title.trim() || !formCms.slug.trim()) { setFormErr3("Title and slug are required."); return; }
    setIsSaving3(true); setFormErr3("");
    try {
      if (modal3 === "new") {
        const p = saveCmsPage({ ...formCms, id: Date.now(), updatedAt: new Date().toLocaleDateString("en-NG") });
        setPages3((prev) => [...prev, p]);
      } else {
        const p = updateCmsPage(modal3.id, { ...formCms, updatedAt: new Date().toLocaleDateString("en-NG") });
        setPages3((prev) => prev.map((pg) => pg.id === p.id ? p : pg));
      }
      setModal3(null);
    } catch (err) {
      setFormErr3(err.message || "Unable to save page.");
    } finally {
      setIsSaving3(false);
    }
  }

  function handleDeleteCms(id) {
    if (!window.confirm("Delete this page?")) return;
    deleteCmsPage(id);
    setPages3((p) => p.filter((pg) => pg.id !== id));
  }

  const inputCls3 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  return (
    <Layout activeTab="Platform">
      <PH3 title="CMS Pages" subtitle="Manage website pages and content"
        breadcrumbs={[{ label: "Platform", onClick: () => navigate("/platform") }, { label: "CMS Pages" }]}
        action={<Btn3 onClick={openNew3}><Plus className="w-4 h-4 mr-1" />New Page</Btn3>}
      />

      <div className="mb-4 max-w-xs"><SB3 value={search3} onChange={(e) => setSearch3(e.target.value)} placeholder="Search pages…" /></div>

      {isLoading3 ? <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spin3 /></div>
        : filtered3.length === 0 ? <EE3 icon={FileText} title="No pages found" description="Create a new page to populate the website CMS." action={<Btn3 onClick={openNew3}>New Page</Btn3>} />
        : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <T3>
              <TH3><Th3>#</Th3><Th3>Title</Th3><Th3>Slug</Th3><Th3 center>Status</Th3><Th3>Last Updated</Th3><Th3 center>Actions</Th3></TH3>
              <TB3>
                {filtered3.map((page, i) => (
                  <Tr3 key={page.id}>
                    <Td3 muted>{i + 1}</Td3>
                    <Td3><span className="font-medium text-gray-900">{page.title}</span></Td3>
                    <Td3><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">/{page.slug}</span></Td3>
                    <Td3 center><Badge3 label={page.status || "Draft"} /></Td3>
                    <Td3 muted>{page.updatedAt || "—"}</Td3>
                    <Td3 center>
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => openView3(page)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 cursor-pointer"><EyeIcon className="w-4 h-4" /></button>
                        <button type="button" onClick={() => openEdit3(page)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 cursor-pointer"><PencilIcon className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDeleteCms(page.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"><Trash2Icon className="w-4 h-4" /></button>
                      </div>
                    </Td3>
                  </Tr3>
                ))}
              </TB3>
            </T3>
          </div>
        )}

      {/* View modal */}
      {modal3 === "view" && viewPage3 && (
        <MS3 title={viewPage3.title} onClose={() => setModal3(null)} size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">/{viewPage3.slug}</span>
              <Badge3 label={viewPage3.status || "Draft"} />
              <span className="text-xs text-gray-400">Updated {viewPage3.updatedAt}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewPage3.content || "No content."}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Btn3 variant="secondary" onClick={() => setModal3(null)}>Close</Btn3>
              <Btn3 onClick={() => openEdit3(viewPage3)}>Edit Page</Btn3>
            </div>
          </div>
        </MS3>
      )}

      {/* Edit / New modal */}
      {modal3 && modal3 !== "view" && (
        <MS3 title={modal3 === "new" ? "New CMS Page" : "Edit Page"} onClose={() => setModal3(null)}>
          <div className="space-y-4">
            <FF3 label="Page Title" required><input value={formCms.title} onChange={(e) => setFormCms3((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. About Us" className={inputCls3} /></FF3>
            <FF3 label="Slug" required><div className="flex items-center"><span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500">/</span><input value={formCms.slug} onChange={(e) => setFormCms3((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="about-us" className={inputCls3 + " rounded-l-none"} /></div></FF3>
            <FF3 label="Status"><select value={formCms.status} onChange={(e) => setFormCms3((p) => ({ ...p, status: e.target.value }))} className={inputCls3}>{["Draft","Published","Archived"].map((s) => <option key={s}>{s}</option>)}</select></FF3>
            <FF3 label="Content"><textarea value={formCms.content} onChange={(e) => setFormCms3((p) => ({ ...p, content: e.target.value }))} rows={5} placeholder="Page content…" className={inputCls3 + " resize-none"} /></FF3>
            {formErr3 && <p className="text-sm text-red-600">{formErr3}</p>}
            <div className="flex justify-end gap-3">
              <Btn3 variant="secondary" onClick={() => setModal3(null)}>Cancel</Btn3>
              <Btn3 onClick={handleSaveCms} disabled={isSaving3}>{isSaving3 ? "Saving…" : "Save Page"}</Btn3>
            </div>
          </div>
        </MS3>
      )}
    </Layout>
  );
}