import PropTypes from "prop-types";
import { Phone, Video } from "lucide-react";
import { getProfileAvatar } from "../../utils/profileAvatar";

export default function MessageHeader({ selectedUser }) {
  if (!selectedUser) {
    return (
      <div className="flex justify-between py-2 px-12 border border-gray-200 h-16 items-center">
        <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  const lastMessage = selectedUser.messages?.[selectedUser.messages.length - 1];
  const lastSeen = lastMessage ? `${lastMessage.date} at ${lastMessage.time}` : "No messages yet";

  return (
    <div className="flex justify-between py-2 px-12 border border-gray-200 h-16">
      <div className="py-2 px-3 flex items-center gap-2">
        <img src={selectedUser.img || getProfileAvatar(selectedUser.name, selectedUser.role)} alt="profile" className="block w-8 h-8 rounded-full" />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium">{selectedUser.name}</p>
          <p className="text-sm font-light text-gray-400">Last seen {lastSeen}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Video className="rounded bg-green-100 text-green-800 w-8 h-8 p-2 cursor-pointer" />
        <Phone className="rounded bg-purple-100 text-pink-900 w-8 h-8 p-2 cursor-pointer" />
      </div>
    </div>
  );
}

MessageHeader.propTypes = {
  selectedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    img: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        time: PropTypes.string,
      }),
    ),
  }),
};

MessageHeader.defaultProps = {
  selectedUser: null,
};
