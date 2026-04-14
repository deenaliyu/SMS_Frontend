// ── MessageList ───────────────────────────────────────────────────────────────
import PropTypes from "prop-types";
import { Search, Plus } from "lucide-react";
import { getProfileAvatar } from "../utils/profileAvatar";

export function MessageList({ users, setSelectedUser, selectedUserId, searchTerm, onSearchTermChange }) {
  return (
    <div className="flex flex-col w-72 flex-shrink-0 bg-white border-r border-gray-100 h-screen">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-gray-900 text-lg">Messages</h1>
          <button type="button" className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-100 cursor-pointer transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-gray-50"
          />
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto py-2">
        {users.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8 px-4">No contacts found.</p>
        )}
        {users.map((user) => {
          const isSelected = selectedUserId === user.id;
          const lastMsg = user.messages?.[user.messages.length - 1];
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => setSelectedUser(user.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${isSelected ? "bg-green-50 border-r-2 border-green-500" : "hover:bg-gray-50"}`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.img || getProfileAvatar(user.name, user.role || "User")}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${isSelected ? "font-bold text-green-800" : "font-semibold text-gray-800"}`}>{user.name}</p>
                  {lastMsg && <p className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{lastMsg.time}</p>}
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {lastMsg?.text || (user.role ? `${user.role}` : "No messages yet")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

MessageList.propTypes = {
  users: PropTypes.array.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  selectedUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
};

// ── MessageHeader ─────────────────────────────────────────────────────────────
import { Phone, Video } from "lucide-react";
import { getProfileAvatar as getAvatar2 } from "../utils/profileAvatar";

export function MessageHeader({ selectedUser }) {
  if (!selectedUser) {
    return (
      <div className="h-16 border-b border-gray-100 flex items-center px-5">
        <p className="text-sm text-gray-400">Select a conversation to start messaging</p>
      </div>
    );
  }
  const lastMsg = selectedUser.messages?.[selectedUser.messages.length - 1];
  return (
    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5 bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.img || getAvatar2(selectedUser.name, selectedUser.role || "User")}
            alt={selectedUser.name}
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{selectedUser.name}</p>
          <p className="text-xs text-gray-400">{lastMsg ? `Last seen ${lastMsg.date} at ${lastMsg.time}` : "Active now"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-100 cursor-pointer transition-colors">
          <Video className="w-4 h-4" />
        </button>
        <button type="button" className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-100 cursor-pointer transition-colors">
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

MessageHeader.propTypes = {
  selectedUser: PropTypes.shape({ name: PropTypes.string, img: PropTypes.string, messages: PropTypes.array }),
};
MessageHeader.defaultProps = { selectedUser: null };

// ── StartConversation placeholder ─────────────────────────────────────────────
import { MessageCircle } from "lucide-react";

export function StartConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-8">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-gray-300" />
      </div>
      <p className="font-semibold text-gray-600">Start a conversation</p>
      <p className="text-xs text-center text-gray-400 max-w-xs">Select a contact from the list to send a message or start a new conversation.</p>
    </div>
  );
}

// ── Messages (chat bubbles) ───────────────────────────────────────────────────
import { useMemo, useRef, useState as useState2 } from "react";
import { Send, Smile, Image, Mic, File, X, ArrowUp } from "lucide-react";

const EMOJIS = ["😊", "😂", "❤️", "👍", "🙏", "😢", "🎉", "🔥", "👏", "😮"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Unable to read file."));
    r.readAsDataURL(file);
  });
}

export function Messages({ userMessages, selectedUser, onSendMessage }) {
  const [text2, setText2] = useState2("");
  const [attachments2, setAttachments2] = useState2([]);
  const [showEmoji2, setShowEmoji2] = useState2(false);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const grouped = useMemo(() => {
    const map = {};
    userMessages.forEach((m) => { if (!map[m.date]) map[m.date] = []; map[m.date].push(m); });
    return Object.entries(map);
  }, [userMessages]);

  async function handleFileChange2(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const converted = await Promise.all(files.map(async (f) => ({
      id: `att-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: f.name, mimeType: f.type, size: f.size,
      url: await readFileAsDataUrl(f), kind: f.type.startsWith("image/") ? "image" : "file",
    })));
    setAttachments2((p) => [...p, ...converted]);
    e.target.value = "";
  }

  function handleSend2() {
    const t = text2.trim();
    if (!t && !attachments2.length) return;
    onSendMessage({ text: t, attachments: attachments2 });
    setText2(""); setAttachments2([]); setShowEmoji2(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1" style={{ minHeight: 0 }}>
        {grouped.map(([day, msgs]) => (
          <div key={day}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 px-2">{day}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {msgs.map((msg, idx) => {
              const isMe = msg.sender !== "user";
              return (
                <div key={msg.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-green-600 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>
                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                    {Array.isArray(msg.attachments) && msg.attachments.map((att) => (
                      <div key={att.id} className="mt-2">
                        {att.kind === "image"
                          ? <img src={att.url} alt={att.name} className="max-w-[200px] rounded-lg" />
                          : <a href={att.url} download={att.name} className="underline text-xs">{att.name}</a>
                        }
                      </div>
                    ))}
                    <p className={`text-[10px] mt-1 ${isMe ? "text-green-200" : "text-gray-400"} text-right`}>{msg.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {userMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gray-400">No messages yet. Say hello! 👋</p>
          </div>
        )}
      </div>

      {/* Pending attachments */}
      {attachments2.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap gap-2">
          {attachments2.map((att) => (
            <div key={att.id} className="relative border border-gray-200 rounded-xl overflow-hidden">
              {att.kind === "image"
                ? <img src={att.url} alt={att.name} className="w-14 h-14 object-cover" />
                : <div className="w-14 h-14 flex items-center justify-center text-[9px] text-center text-gray-500 p-1 bg-gray-50">{att.name}</div>
              }
              <button type="button" onClick={() => setAttachments2((p) => p.filter((a) => a.id !== att.id))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji2 && (
        <div className="mx-5 mb-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex flex-wrap gap-2 shadow-md">
          {EMOJIS.map((em) => (
            <button key={em} type="button" onClick={() => setText2((p) => p + em)} className="text-lg hover:scale-125 transition-transform cursor-pointer">{em}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-5 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2">
          <Mic className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend2(); } }}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <input type="file" accept="image/*" multiple ref={imgRef} className="hidden" onChange={handleFileChange2} />
            <button type="button" onClick={() => imgRef.current?.click()} className="text-gray-400 hover:text-green-600 cursor-pointer"><Image className="w-4 h-4" /></button>
            <input type="file" multiple ref={fileRef} className="hidden" onChange={handleFileChange2} />
            <button type="button" onClick={() => fileRef.current?.click()} className="text-gray-400 hover:text-green-600 cursor-pointer"><File className="w-4 h-4" /></button>
            <button type="button" onClick={() => setShowEmoji2((p) => !p)} className="text-gray-400 hover:text-green-600 cursor-pointer"><Smile className="w-4 h-4" /></button>
            <button
              type="button"
              onClick={handleSend2}
              className="w-7 h-7 bg-green-600 rounded-xl flex items-center justify-center text-white hover:bg-green-700 cursor-pointer transition-colors flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Messages.propTypes = {
  userMessages: PropTypes.array.isRequired,
  selectedUser: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  onSendMessage: PropTypes.func.isRequired,
};