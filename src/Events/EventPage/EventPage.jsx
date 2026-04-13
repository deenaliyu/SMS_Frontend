import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import MainEvent from "../EventComponent/MainEvent/MainEvent";
import { smsApi } from "../../services/smsApi";

export default function EventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <Layout activeTab="Events">
      <MainEvent events={events} />
    </Layout>
  );
}
