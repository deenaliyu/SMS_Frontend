// ── MainEvent (list view) ─────────────────────────────────────────────────────
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, List, SquarePen } from "lucide-react";
import {
  SearchBar, Table, THead, Th, TBody, Tr, Td,
  Pagination, EmptyState, Btn,
} from "../../components/ui/index.jsx";
import { CalendarDays } from "lucide-react";

export function MainEvent({ events }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const filtered = events.filter((e) =>
    [e.title, e.location, e.organizer].some((v) =>
      String(v || "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search events…" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button type="button" className="p-2 bg-green-50 text-green-600 cursor-pointer"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => navigate("/events/calendar")} className="p-2 text-gray-400 hover:bg-gray-50 cursor-pointer"><Calendar className="w-4 h-4" /></button>
          </div>
          <Btn onClick={() => navigate("/events/add")}>+ Add Event</Btn>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <THead>
            <Th>#</Th><Th>Title</Th><Th>Date</Th><Th>Time</Th>
            <Th>Location</Th><Th>Organizer</Th><Th>Description</Th><Th center>Action</Th>
          </THead>
          <TBody>
            {paged.length === 0 ? (
              <tr><td colSpan={8}><EmptyState icon={CalendarDays} title="No events found" description="Add an event or adjust your search." /></td></tr>
            ) : paged.map((ev, i) => (
              <Tr key={ev.id}>
                <Td muted>{(page - 1) * PER_PAGE + i + 1}</Td>
                <Td><span className="font-medium text-gray-900">{ev.title}</span></Td>
                <Td muted>{ev.date}</Td>
                <Td muted>{ev.time}</Td>
                <Td muted>{ev.location}</Td>
                <Td muted>{ev.organizer}</Td>
                <Td muted><span className="line-clamp-1 max-w-[140px] block">{ev.description}</span></Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 cursor-pointer"><SquarePen className="w-4 h-4" /></button>
                    <button type="button" className="text-xs font-semibold text-green-700 border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50 cursor-pointer">View</button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>
    </>
  );
}

MainEvent.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string, date: PropTypes.string, time: PropTypes.string,
    location: PropTypes.string, description: PropTypes.string, organizer: PropTypes.string,
  })).isRequired,
};

// ── EventModal ────────────────────────────────────────────────────────────────
import { SuccessModal } from "../../components/ui/index.jsx";

export function EventModal({ setShowModal }) {
  const navigate = useNavigate();
  return (
    <SuccessModal
      title="Event Added!"
      message="New event added successfully. Notifications will be sent to parents, teachers, and students."
      buttonLabel="Back to Event List"
      onClose={() => { setShowModal(false); navigate("/events"); }}
    />
  );
}

EventModal.propTypes = { setShowModal: PropTypes.func.isRequired };

// ── AddEvent ──────────────────────────────────────────────────────────────────
import { useState as useState2 } from "react";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { PageHeader, FormField, Btn as BtnAdd } from "../../components/ui/index.jsx";

const INITIAL_EVENT = { title: "", date: "", time: "", location: "", description: "", organizer: "" };

export function AddEvent() {
  const navigate = useNavigate();
  const [form, setForm2] = useState2(INITIAL_EVENT);
  const [isSubmitting, setIsSubmitting2] = useState2(false);
  const [error, setError2] = useState2("");
  const [showModal, setShowModal2] = useState2(false);

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white placeholder:text-gray-400";

  function handleChange2(e) {
    const { name, value } = e.target;
    setForm2((p) => ({ ...p, [name]: value }));
    if (error) setError2("");
  }

  async function handleSubmit2(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.description || !form.organizer) {
      setError2("Please fill all required fields."); return;
    }
    setIsSubmitting2(true);
    try {
      await smsApi.createEvent({ ...form, id: Date.now() });
      setShowModal2(true);
      setForm2(INITIAL_EVENT);
    } catch (err) {
      setError2(err.message || "Unable to add event.");
    } finally {
      setIsSubmitting2(false);
    }
  }

  return (
    <Layout activeTab="Events">
      <PageHeader
        title="Add Event"
        breadcrumbs={[{ label: "Events", onClick: () => navigate("/events") }, { label: "Add Event" }]}
      />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSubmit2} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Event Title" required>
              <input name="title" value={form.title} onChange={handleChange2} placeholder="Event title" className={inputCls} />
            </FormField>
            <FormField label="Organizer" required>
              <input name="organizer" value={form.organizer} onChange={handleChange2} placeholder="School Admin" className={inputCls} />
            </FormField>
            <FormField label="Date" required>
              <input type="date" name="date" value={form.date} onChange={handleChange2} className={inputCls} />
            </FormField>
            <FormField label="Time" required>
              <input type="time" name="time" value={form.time} onChange={handleChange2} className={inputCls} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Location">
                <input name="location" value={form.location} onChange={handleChange2} placeholder="Venue / location" className={inputCls} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Description" required>
                <textarea name="description" value={form.description} onChange={handleChange2} placeholder="Event description" rows={4} className={inputCls + " resize-none"} />
              </FormField>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <BtnAdd variant="secondary" type="button" onClick={() => navigate("/events")}>Cancel</BtnAdd>
            <BtnAdd type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add Event"}
            </BtnAdd>
          </div>
        </form>
      </div>
      {showModal && <EventModal setShowModal={setShowModal2} />}
    </Layout>
  );
}

// ── EventPage wrapper ─────────────────────────────────────────────────────────
import { useEffect, useState as useState3 } from "react";
import { PageHeader as PH } from "../../components/ui/index.jsx";

export function EventPage() {
  const navigate = useNavigate();
  const [events, setEvents3] = useState3([]);

  useEffect(() => {
    let active = true;
    smsApi.listEvents().then((res) => { if (active) setEvents3(Array.isArray(res) ? res : []); }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <Layout activeTab="Events">
      <PH title="Events" subtitle="School event schedule and management" />
      <MainEvent events={events} />
    </Layout>
  );
}