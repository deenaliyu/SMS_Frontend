import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import HeroSection from "../../../components/HeroSection";
import { CalendarDays, Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";

const EVENTS = [
  {
    id: 1,
    month: "JUN",
    day: "15",
    title: "Parent-Teacher Conference",
    time: "9:00 AM – 12:00 PM",
    location: "Main School Hall",
    description:
      "Meet with your child's teachers to discuss academic progress, set goals, and strengthen the home-school partnership. All parents are encouraged to attend.",
    category: "Academic",
  },
  {
    id: 2,
    month: "JUN",
    day: "22",
    title: "Science Fair Exhibition",
    time: "10:00 AM – 3:00 PM",
    location: "Science Block & Courtyard",
    description:
      "Students showcase innovative projects across biology, chemistry, physics, and technology. Public viewing open to parents and invited guests.",
    category: "Academic",
  },
  {
    id: 3,
    month: "JUL",
    day: "05",
    title: "Inter-House Sports Day",
    time: "8:00 AM – 5:00 PM",
    location: "School Sports Field",
    description:
      "Annual athletics competition across four houses — Blue, Green, Red, and Yellow. Events include track, field, and team sports with prizes for top performers.",
    category: "Sports",
  },
  {
    id: 4,
    month: "JUL",
    day: "19",
    title: "Cultural Day Festival",
    time: "11:00 AM – 4:00 PM",
    location: "School Auditorium",
    description:
      "A celebration of Nigeria's rich cultural heritage through music, dance, traditional attire, and food. All students participate in cultural presentations.",
    category: "Culture",
  },
  {
    id: 5,
    month: "AUG",
    day: "09",
    title: "End-of-Term Prize Giving",
    time: "10:00 AM – 1:00 PM",
    location: "Main Auditorium",
    description:
      "Recognising outstanding academic and extracurricular achievements. Top students receive certificates, trophies, and scholarship announcements.",
    category: "Academic",
  },
];

const CATEGORY_COLORS = {
  Academic: "bg-blue-100 text-blue-700",
  Sports: "bg-green-100 text-green-700",
  Culture: "bg-purple-100 text-purple-700",
};

export default function NewsEvents() {
  const [query, setQuery] = useState("");

  const filtered = EVENTS.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="News & Events"
        text="Stay up-to-date with the latest happenings, announcements, and exciting events from our school community."
        image="https://picsum.photos/seed/news-hero/1600/600"
      />

      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-12">
        {/* Search */}
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          <span className="text-sm text-gray-400">({filtered.length} events)</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No events match your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Date block */}
                  <div className="sm:w-28 bg-green-600 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-0 px-6 py-4 sm:py-6 flex-shrink-0">
                    <p className="text-green-200 text-xs font-bold uppercase tracking-widest sm:mb-1">{event.month}</p>
                    <p className="text-white text-3xl sm:text-4xl font-black leading-none">{event.day}</p>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${CATEGORY_COLORS[event.category] || "bg-gray-100 text-gray-600"}`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-green-500" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-green-500" /> {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}