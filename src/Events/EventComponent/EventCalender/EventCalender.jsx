import { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, List, Search } from "lucide-react";
import CalendarGrid from "./CalenderGrid";
import EventGrid from "./EventGrid";
import { smsApi } from "../../../services/smsApi";

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateEvents = Array.isArray(location.state?.events) ? location.state.events : null;

    if (stateEvents) {
      setEvents(stateEvents);
      return;
    }

    let active = true;

    async function loadEvents() {
      try {
        const response = await smsApi.listEvents();
        if (active) {
          setEvents(Array.isArray(response) ? response : []);
        }
      } catch {
        if (active) {
          setEvents([]);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, [location.state]);

  const handleDateSelect = (selectedDate) => {
    setCurrentDate(selectedDate);
  };

  return (
    <Layout activeTab="Events">
      <div className="flex flex-col min-h-screen">
        <div className="p-3 bg-white border border-gray-100">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Event</h1>
            <p className="text-xs">School event calendar</p>
          </div>
        </div>

        <div className="p-3 border border-gray-100 rounded bg-white">
          <div>
            <h1 className="text-lg font-bold">Event List</h1>
            <div className="flex items-center justify-between mt-1">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-5 pr-10 py-1 rounded border border-gray-300 focus:outline-none"
                />
                <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>

              <div className="flex items-center">
                <div className="hover:bg-green-700 bg-green-600 cursor-pointer text-black p-2 rounded">
                  <List className="h-5 w-5" onClick={() => navigate("/events")} />
                </div>
                <div className="bg-white px-6 py-2 cursor-pointer">
                  <Calendar className="text-gray-500 hover:text-gray-600" />
                </div>
                <div
                  className="py-2 px-7 hover:bg-green-700 bg-green-600 cursor-pointer font-medium rounded-md"
                  onClick={() => navigate("/events/add")}
                >
                  Add Event
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex bg-white">
            <CalendarGrid
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onDateSelect={handleDateSelect}
            />

            <div className="flex-1 ml-5">
              <EventGrid events={events} currentDate={currentDate} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
