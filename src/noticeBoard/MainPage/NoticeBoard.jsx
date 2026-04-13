import { CalendarDays, Eye, Heart, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";

export default function NoticeBoard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [notices, setNotices] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [noticeResponse, eventResponse] = await Promise.all([
          smsApi.listNotices(),
          smsApi.listEvents()
        ]);

        if (!active) {
          return;
        }

        setNotices(Array.isArray(noticeResponse) ? noticeResponse : []);
        setUpcomingEvents(
          (Array.isArray(eventResponse) ? eventResponse : []).slice(0, 4).map((event, index) => {
            const eventDate = event.date ? new Date(event.date) : null;

            return {
              id: event.id || index + 1,
              month: eventDate ? eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase() : "TBD",
              day: eventDate ? String(eventDate.getDate()).padStart(2, "0") : "--",
              title: event.title || "Untitled Event",
              venue: event.location || "School Venue"
            };
          })
        );
      } catch {
        if (active) {
          setNotices([]);
          setUpcomingEvents([]);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredNotices = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return notices;

    return notices.filter(
      (item) =>
        String(item.title || "").toLowerCase().includes(text) ||
        String(item.category || "").toLowerCase().includes(text) ||
        String(item.noticeBy || item.author || "").toLowerCase().includes(text)
    );
  }, [query, notices]);

  return (
    <Layout activeTab="Notice Board">
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">School Communication Hub</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Notice Board</h1>
            <p className="text-sm text-gray-600 mt-1">Publish official announcements and keep the school community informed.</p>
          </div>

          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => navigate("/notice-board/new")}
          >
            <Plus className="w-4 h-4" />
            New Notice
          </button>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="relative w-full md:w-96 mb-5">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notices"
                className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-4">
              {filteredNotices.map((item) => (
                <article key={item.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          {item.category || "Notice"}
                        </span>
                        <span>{item.date || item.createdAt?.slice(0, 10) || ""}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{item.moreAbout || item.summary}</p>
                      <p className="text-xs text-gray-500 mt-2">By {item.noticeBy || item.author || "School Admin"}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {item.views || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {item.likes || 0}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              {filteredNotices.length === 0 && <p className="text-sm text-gray-500">No notices found.</p>}
            </div>
          </div>

          <aside className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 inline-flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              Upcoming Events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 border border-gray-200 rounded-md p-3">
                  <div className="w-14 text-center rounded bg-green-100 text-green-700 py-1">
                    <p className="text-xs font-semibold">{event.month}</p>
                    <p className="text-lg font-bold leading-tight">{event.day}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.venue}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && <p className="text-sm text-gray-500">No scheduled event saved yet.</p>}
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
}
