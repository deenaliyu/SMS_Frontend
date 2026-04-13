import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import MessageList from "../MessageComponents/MessageList";
import StartConversation from "../MessageComponents/StartConversation";
import MessageHeader from "../MessageComponents/MessageHeader";
import Messages from "../MessageComponents/Messages";
import { smsApi } from "../../services/smsApi";

function formatThread(thread, index) {
  return {
    id: thread.id || `thread-${index + 1}`,
    name: thread.name || "Unnamed Contact",
    img: thread.img || "",
    role: thread.role || "",
    messages: Array.isArray(thread.messages) ? thread.messages : []
  };
}

function toMessageEntry(payload, sender) {
  const createdAt = new Date().toISOString();

  return {
    id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: payload.text || "",
    attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    sender,
    time: new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: "Today",
    createdAt
  };
}

export default function MessagePage() {
  const location = useLocation();
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    async function loadThreads() {
      try {
        const [threadResponse, teacherResponse, parentResponse, studentResponse] = await Promise.all([
          smsApi.listMessageThreads(),
          smsApi.listTeachers(),
          smsApi.listParents(),
          smsApi.listStudents()
        ]);

        if (!active) {
          return;
        }

        const remoteThreads = (Array.isArray(threadResponse) ? threadResponse : []).map(formatThread);
        const contacts = [
          ...(Array.isArray(teacherResponse) ? teacherResponse : []).map((entry) => ({ name: entry.name, role: "Teacher" })),
          ...(Array.isArray(parentResponse) ? parentResponse : []).map((entry) => ({ name: entry.name, role: "Parent" })),
          ...(Array.isArray(studentResponse) ? studentResponse : []).map((entry) => ({ name: entry.name, role: "Student" }))
        ];

        const map = new Map(remoteThreads.map((thread) => [thread.name.toLowerCase(), thread]));

        contacts.forEach((contact, index) => {
          const key = String(contact.name || "").toLowerCase();
          if (!key || map.has(key)) {
            return;
          }

          map.set(key, {
            id: `contact-${index}-${key}`,
            name: contact.name,
            img: "",
            role: contact.role,
            messages: []
          });
        });

        setThreads(Array.from(map.values()));
      } catch {
        if (active) {
          setThreads([]);
        }
      }
    }

    loadThreads();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const contactName = location.state?.contactName;

    if (!contactName) {
      return;
    }

    const selected = threads.find((thread) => thread.name.toLowerCase() === String(contactName).toLowerCase());

    if (selected) {
      setSelectedThreadId(selected.id);
    }
  }, [location.state, threads]);

  const filteredThreads = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    if (!text) {
      return threads;
    }

    return threads.filter((thread) => String(thread.name || "").toLowerCase().includes(text));
  }, [searchTerm, threads]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const handleSendMessage = async (payload) => {
    if (!selectedThread) {
      return;
    }

    const nextMessage = toMessageEntry(payload, "me");
    const nextThread = {
      ...selectedThread,
      messages: [...(selectedThread.messages || []), nextMessage]
    };

    const request = {
      ...nextThread,
      role: selectedThread.role || "",
      img: selectedThread.img || ""
    };

    try {
      const savedThread = selectedThread.id.startsWith("contact-")
        ? await smsApi.createMessageThread(request)
        : await smsApi.updateMessageThread(selectedThread.id, request);

      setThreads((prev) =>
        prev.map((thread) => (thread.id === selectedThread.id ? formatThread(savedThread, 0) : thread))
      );

      if (selectedThread.id.startsWith("contact-")) {
        setSelectedThreadId(savedThread.id);
        setThreads((prev) =>
          prev.map((thread) => (thread.id === selectedThread.id ? formatThread(savedThread, 0) : thread))
        );
      }
    } catch {
      // Keep UI responsive even if sync fails.
      setThreads((prev) =>
        prev.map((thread) => (thread.id === selectedThread.id ? nextThread : thread))
      );
    }
  };

  return (
    <Layout activeTab="Messaging">
      <div className="flex min-h-screen bg-white">
        <MessageList
          users={filteredThreads}
          setSelectedUser={setSelectedThreadId}
          selectedUserId={selectedThreadId}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />

        <div className="flex-1 flex flex-col h-screen">
          <MessageHeader selectedUser={selectedThread} />

          <div className="border border-gray-200 flex-1 flex flex-col">
            {selectedThread ? (
              <Messages
                userMessages={selectedThread.messages}
                selectedUser={selectedThread}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <StartConversation />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
