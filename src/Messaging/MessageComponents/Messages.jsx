import PropTypes from "prop-types";
import { ArrowBigDownDashIcon, AtSign, File, Image, Mic, Send, Smile, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const EMOJIS = ["??", "??", "??", "??", "??", "??", "??", "??", "??", "?"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
}

const Messages = ({ userMessages, selectedUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const groupedMessages = useMemo(() => {
    const grouped = {};

    userMessages.forEach((message) => {
      if (!grouped[message.date]) {
        grouped[message.date] = [];
      }

      grouped[message.date].push(message);
    });

    return Object.entries(grouped);
  }, [userMessages]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const converted = await Promise.all(
      files.map(async (file) => ({
        id: `att-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        url: await readFileAsDataUrl(file),
        kind: file.type.startsWith("image/") ? "image" : "file",
      })),
    );

    setPendingAttachments((prev) => [...prev, ...converted]);
    event.target.value = "";
  };

  const handleSend = () => {
    const text = newMessage.trim();

    if (!text && pendingAttachments.length === 0) {
      return;
    }

    onSendMessage({
      text,
      attachments: pendingAttachments,
    });

    setNewMessage("");
    setPendingAttachments([]);
    setShowEmojiPicker(false);
  };

  const handleRemoveAttachment = (attachmentId) => {
    setPendingAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="overflow-y-auto px-12 pb-12 w-full" style={{ height: "calc(100vh - 10rem)" }}>
          {groupedMessages.map(([day, messages]) => (
            <div className="flex flex-col w-full" key={day}>
              <div className="flex items-center w-full gap-1 my-10">
                <span className="h-px flex-1 bg-gray-300"></span>
                <span className="text-gray-600 text-sm font-normal whitespace-nowrap">{day}</span>
                <span className="h-px flex-1 bg-gray-300"></span>
              </div>

              {messages.map((msg, index) => {
                const isFirstSender = index === 0 || messages[index - 1].sender !== msg.sender;
                const isUser = msg.sender === "user";
                const alignment = isUser ? "self-start" : "self-end";
                const color = isUser ? "bg-blue-500 text-gray-100" : "bg-blue-200 text-blue-900";

                return (
                  <div key={msg.id || `${msg.time}-${index}`} className="flex flex-col">
                    {isFirstSender ? (
                      <div className={`${alignment} flex flex-col gap-1`}>
                        {!isUser && (
                          <div className="flex gap-2 items-center ml-auto self-end">
                            <p className="text-xs">You</p>
                            <p className="text-xs text-gray-400">{msg.time}</p>
                          </div>
                        )}

                        <div className={`${color} max-w-sm w-max p-3 rounded-2xl my-1`}>
                          <div className="flex flex-col gap-2 text-sm">
                            <p className="font-medium">{isUser ? selectedUser.name : "You"}</p>
                            {msg.text && <p className="text-base font-normal whitespace-pre-wrap">{msg.text}</p>}

                            {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                              <div className="flex flex-col gap-2">
                                {msg.attachments.map((attachment) => (
                                  <div key={attachment.id} className="bg-white/20 rounded p-2">
                                    {attachment.kind === "image" ? (
                                      <img src={attachment.url} alt={attachment.name} className="max-w-[220px] rounded" />
                                    ) : (
                                      <a
                                        href={attachment.url}
                                        download={attachment.name}
                                        className="underline text-sm"
                                      >
                                        {attachment.name}
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <p className="self-end text-xs font-normal">{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${color} ${alignment} max-w-sm w-max p-3 rounded-2xl my-1`}>
                        <div className="flex flex-col gap-2 text-sm">
                          <p className="font-medium">{isUser ? selectedUser.name : "You"}</p>
                          {msg.text && <p className="text-base font-normal whitespace-pre-wrap">{msg.text}</p>}
                          <p className="self-end text-xs font-normal">{msg.time}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-auto mb-10 mx-auto w-9/12">
        {pendingAttachments.length > 0 && (
          <div className="mb-2 p-2 border border-gray-200 rounded flex flex-wrap gap-2 bg-white">
            {pendingAttachments.map((attachment) => (
              <div key={attachment.id} className="relative border rounded p-1">
                {attachment.kind === "image" ? (
                  <img src={attachment.url} alt={attachment.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-xs text-center p-1">
                    {attachment.name}
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute -top-14 left-0 bg-white border rounded px-2 py-1 shadow flex gap-2 z-10">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="text-lg"
                onClick={() => setNewMessage((prev) => `${prev}${emoji}`)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
          className="w-full py-2 pl-10 pr-40 rounded border border-green-500 focus:outline-none"
        />

        <Mic className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-3 text-gray-500">
          <ArrowBigDownDashIcon className="w-5 h-5 cursor-pointer hover:text-green-500" />
          <AtSign className="w-5 h-5 cursor-pointer hover:text-green-500" />

          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <Image className="w-5 h-5 cursor-pointer hover:text-green-500" onClick={() => imageInputRef.current?.click()} />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <File className="w-5 h-5 cursor-pointer hover:text-green-500" onClick={() => fileInputRef.current?.click()} />

          <Smile
            className="w-5 h-5 cursor-pointer hover:text-green-500"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />

          <Send
            className="w-7 h-7 p-1 bg-green-500 text-white rounded-full cursor-pointer hover:text-green-500 hover:bg-white"
            onClick={handleSend}
          />
        </div>
      </div>
    </>
  );
};

Messages.propTypes = {
  userMessages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      text: PropTypes.string,
      sender: PropTypes.string,
      time: PropTypes.string,
      date: PropTypes.string,
      attachments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          kind: PropTypes.string,
          url: PropTypes.string,
          name: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  selectedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSendMessage: PropTypes.func.isRequired,
};

export default Messages;
