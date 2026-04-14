// ── NoticeBoard ───────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, Megaphone, FileText, Pin, Trash2, Eye } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { getNotices, saveNotice, deleteNotice } from "../utils/noticesStore";
import {
  PageHeader, SearchBar, Badge, Table, THead, Th, TBody, Tr, Td,
  Spinner, EmptyState, Btn, ModalShell,
} from "../components/ui/index.jsx";

const CATEGORY_ICONS = { General: Megaphone, Academic: FileText, Event: BellRing, Emergency: BellRing };

function categoryIcon(category) {
  const Icon = CATEGORY_ICONS[category] || FileText;
  return <Icon className="w-4 h-4" />;
}

export function NoticeBoard() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.resolve(getNotices())
      .then((res) => { if (active) setNotices(Array.isArray(res) ? res : []); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ["all", ...new Set(notices.map((n) => n.category).filter(Boolean))], [notices]);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return notices.filter((n) => {
      const catMatch = categoryFilter === "all" || n.category === categoryFilter;
      const textMatch = !text || [n.title, n.moreAbout, n.noticeBy].some((v) => String(v || "").toLowerCase().includes(text));
      return catMatch && textMatch;
    });
  }, [notices, search, categoryFilter]);

  function handleDelete(id) {
    if (!window.confirm("Delete this notice?")) return;
    deleteNotice(id);
    setNotices((p) => p.filter((n) => n.id !== id));
  }

  return (
    <Layout activeTab="NoticeBoard">
      <PageHeader
        title="Notice Board"
        subtitle="School-wide announcements and notices"
        action={<Btn onClick={() => navigate("/notice-board/new")}>+ New Notice</Btn>}
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          ["Total", notices.length, "bg-gray-100 text-gray-700"],
          ["General", notices.filter((n) => n.category === "General").length, "bg-blue-50 text-blue-700"],
          ["Academic", notices.filter((n) => n.category === "Academic").length, "bg-green-50 text-green-700"],
          ["Event", notices.filter((n) => n.category === "Event").length, "bg-purple-50 text-purple-700"],
          ["Emergency", notices.filter((n) => n.category === "Emergency").length, "bg-red-50 text-red-600"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium ${cls}`}>
            {label}: <span className="font-bold">{val}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices…" />
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button key={cat} type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer transition-colors capitalize ${categoryFilter === cat ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BellRing} title="No notices" description="Create a new notice to get started." action={<Btn onClick={() => navigate("/notice-board/new")}>New Notice</Btn>} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <THead>
              <Th>#</Th><Th>Title</Th><Th>Category</Th><Th>Posted By</Th>
              <Th>Date</Th><Th>Target</Th><Th center>Priority</Th><Th center>Actions</Th>
            </THead>
            <TBody>
              {filtered.map((notice, i) => (
                <Tr key={notice.id}>
                  <Td muted>{i + 1}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{categoryIcon(notice.category)}</span>
                      <span className="font-medium text-gray-900">{notice.title}</span>
                      {notice.pinned && <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                    </div>
                  </Td>
                  <Td><Badge label={notice.category || "General"} /></Td>
                  <Td muted>{notice.noticeBy}</Td>
                  <Td muted>{notice.date}</Td>
                  <Td muted>{notice.audience || "All"}</Td>
                  <Td center><Badge label={notice.priority || "Normal"} /></Td>
                  <Td center>
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setViewModal(notice)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(notice.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      )}

      {viewModal && (
        <ModalShell title="Notice Details" onClose={() => setViewModal(null)} size="md">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">{viewModal.title}</p>
                <p className="text-sm text-gray-400 mt-0.5">{viewModal.date} · Posted by {viewModal.noticeBy}</p>
              </div>
              <Badge label={viewModal.category || "General"} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[["Audience", viewModal.audience || "All"], ["Priority", viewModal.priority || "Normal"], ["Category", viewModal.category || "General"]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                  <p className="font-semibold text-gray-800">{val}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewModal.moreAbout}</p>
            </div>
          </div>
        </ModalShell>
      )}
    </Layout>
  );
}

// ── NewItem (create notice form) ──────────────────────────────────────────────
import { useState as useState2 } from "react";
import { PageHeader as PH2, FormField as FF2, Btn as Btn2, SuccessModal } from "../components/ui/index.jsx";

const AUDIENCES = ["All", "Students Only", "Parents Only", "Teachers Only", "Staff Only", "Admin Only"];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"];
const CATEGORIES = ["General", "Academic", "Event", "Emergency"];

const INIT = { title: "", category: "General", audience: "All", priority: "Normal", noticeBy: "", date: "", moreAbout: "", pinned: false };

export function NewItem() {
  const navigate = useNavigate();
  const [form, setForm2] = useState2(INIT);
  const [error, setError2] = useState2("");
  const [isSaving, setIsSaving2] = useState2(false);
  const [showSuccess, setShowSuccess2] = useState2(false);

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  function handleChange(field, value) {
    setForm2((p) => ({ ...p, [field]: value }));
    if (error) setError2("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.moreAbout.trim() || !form.noticeBy.trim() || !form.date) {
      setError2("Title, content, posted by, and date are all required."); return;
    }
    setIsSaving2(true);
    try {
      saveNotice({ ...form, id: Date.now() });
      setShowSuccess2(true);
      setForm2(INIT);
    } catch (err) {
      setError2(err.message || "Unable to save notice.");
    } finally {
      setIsSaving2(false);
    }
  }

  return (
    <Layout activeTab="NoticeBoard">
      <PH2
        title="New Notice"
        breadcrumbs={[{ label: "Notice Board", onClick: () => navigate("/notice-board") }, { label: "New Notice" }]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FF2 label="Notice Title" required>
                <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter notice title" className={inputCls} />
              </FF2>
            </div>
            <FF2 label="Category" required>
              <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FF2>
            <FF2 label="Audience" required>
              <select value={form.audience} onChange={(e) => handleChange("audience", e.target.value)} className={inputCls}>
                {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </FF2>
            <FF2 label="Priority">
              <select value={form.priority} onChange={(e) => handleChange("priority", e.target.value)} className={inputCls}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </FF2>
            <FF2 label="Posted By" required>
              <input value={form.noticeBy} onChange={(e) => handleChange("noticeBy", e.target.value)} placeholder="e.g. School Admin" className={inputCls} />
            </FF2>
            <FF2 label="Date" required>
              <input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} className={inputCls} />
            </FF2>
            <FF2 label="Pin Notice">
              <div className="flex items-center gap-3 pt-1">
                <button type="button"
                  onClick={() => handleChange("pinned", !form.pinned)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.pinned ? "bg-green-500" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.pinned ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-gray-600">{form.pinned ? "Pinned to top" : "Not pinned"}</span>
              </div>
            </FF2>
            <div className="sm:col-span-2">
              <FF2 label="Notice Content" required>
                <textarea
                  value={form.moreAbout}
                  onChange={(e) => handleChange("moreAbout", e.target.value)}
                  placeholder="Write the full notice content here…"
                  rows={5}
                  className={inputCls + " resize-none"}
                />
              </FF2>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <Btn2 variant="secondary" type="button" onClick={() => navigate("/notice-board")}>Cancel</Btn2>
            <Btn2 type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Publish Notice"}</Btn2>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Notice Published!"
          message="The notice has been saved and is now visible on the notice board."
          buttonLabel="Back to Notice Board"
          onClose={() => { setShowSuccess2(false); navigate("/notice-board"); }}
        />
      )}
    </Layout>
  );
}