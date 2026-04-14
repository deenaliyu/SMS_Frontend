// ── CalenderGrid ──────────────────────────────────────────────────────────────
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function eventColor(idx) {
  const palette = [
    "bg-green-100 text-green-800 border-green-300",
    "bg-blue-100 text-blue-800 border-blue-300",
    "bg-purple-100 text-purple-800 border-purple-300",
    "bg-amber-100 text-amber-800 border-amber-300",
    "bg-red-100 text-red-800 border-red-300",
  ];
  return palette[idx % palette.length];
}

export function CalenderGrid({ year, month, events, onPrev, onNext, onSelectDay, selectedDay }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // map "YYYY-MM-DD" → events[]
  const eventsMap = {};
  events.forEach((ev) => {
    const key = ev.date;
    if (!key) return;
    if (!eventsMap[key]) eventsMap[key] = [];
    eventsMap[key].push(ev);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // pad to full 6-row grid
  while (cells.length % 7 !== 0) cells.push(null);

  function formatKey(day) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button type="button" onClick={onPrev}
          className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h2 className="font-bold text-gray-900">{MONTH_NAMES[month]} {year}</h2>
        <button type="button" onClick={onNext}
          className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Day name row */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="min-h-[80px] bg-gray-50/50" />;

          const key = formatKey(day);
          const dayEvents = eventsMap[key] || [];
          const isToday = isCurrentMonth && today.getDate() === day;
          const isSelected = selectedDay === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              className={`min-h-[80px] p-2 text-left cursor-pointer transition-colors hover:bg-green-50/50 flex flex-col gap-1 ${isSelected ? "bg-green-50 ring-2 ring-inset ring-green-400" : ""}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mx-auto mb-1 ${isToday ? "bg-green-600 text-white" : "text-gray-700"}`}>
                {day}
              </span>
              {dayEvents.slice(0, 2).map((ev, i) => (
                <div key={ev.id || i} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium truncate ${eventColor(i)}`}>
                  {ev.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[10px] text-gray-400 font-medium pl-1">+{dayEvents.length - 2} more</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

CalenderGrid.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  events: PropTypes.array.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSelectDay: PropTypes.func.isRequired,
  selectedDay: PropTypes.string,
};
CalenderGrid.defaultProps = { selectedDay: null };

// ── EventGrid (right-panel event list for selected day) ───────────────────────
import { CalendarDays, Clock, MapPin } from "lucide-react";

export function EventGrid({ events, selectedDay }) {
  const filtered = selectedDay
    ? events.filter((ev) => ev.date === selectedDay)
    : events;

  const label = selectedDay
    ? (() => {
        const [y, m, d] = selectedDay.split("-");
        const dt = new Date(Number(y), Number(m) - 1, Number(d));
        return dt.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      })()
    : "All Upcoming Events";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <CalendarDays className="w-10 h-10 mb-2 text-gray-200" />
            <p className="text-xs font-medium">No events {selectedDay ? "on this day" : "scheduled"}</p>
          </div>
        ) : filtered.map((ev, i) => (
          <div key={ev.id || i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
            <div className={`inline-block w-2 h-2 rounded-full mr-2 ${["bg-green-500","bg-blue-500","bg-purple-500","bg-amber-500","bg-red-500"][i % 5]}`} />
            <span className="font-semibold text-gray-900 text-sm">{ev.title}</span>
            <div className="mt-2 space-y-1">
              {ev.time && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />{ev.time}
                </div>
              )}
              {ev.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />{ev.location}
                </div>
              )}
              {ev.description && (
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{ev.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

EventGrid.propTypes = {
  events: PropTypes.array.isRequired,
  selectedDay: PropTypes.string,
};
EventGrid.defaultProps = { selectedDay: null };

// ── EventCalender (page wrapper) ──────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Plus } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { PageHeader } from "../../components/ui/index.jsx";

export function EventCalender() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let active = true;
    smsApi.listEvents()
      .then((res) => { if (active) setEvents(Array.isArray(res) ? res : []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  return (
    <Layout activeTab="Events">
      <PageHeader
        title="Event Calendar"
        breadcrumbs={[{ label: "Events", onClick: () => navigate("/events") }, { label: "Calendar" }]}
        action={
          <div className="flex gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button type="button" onClick={() => navigate("/events")} className="p-2 text-gray-400 hover:bg-gray-50 cursor-pointer"><List className="w-4 h-4" /></button>
              <button type="button" className="p-2 bg-green-50 text-green-600 cursor-pointer">
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
            <button type="button" onClick={() => navigate("/events/add")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar takes 2 cols */}
        <div className="lg:col-span-2">
          <CalenderGrid
            year={year}
            month={month}
            events={events}
            onPrev={prevMonth}
            onNext={nextMonth}
            onSelectDay={(day) => setSelectedDay((d) => (d === day ? null : day))}
            selectedDay={selectedDay}
          />
        </div>

        {/* Event list takes 1 col */}
        <div className="min-h-[400px]">
          <EventGrid events={events} selectedDay={selectedDay} />
        </div>
      </div>
    </Layout>
  );
}