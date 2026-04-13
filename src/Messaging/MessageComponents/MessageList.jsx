import PropTypes from "prop-types";
import { CirclePlus, Search } from "lucide-react";
import { getProfileAvatar } from "../../utils/profileAvatar";

const MessageList = ({ users, setSelectedUser, selectedUserId, searchTerm, onSearchTermChange }) => {
  return (
    <div className="py-5 pl-5 pr-3 border border-gray-200 w-80 h-screen flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Messaging</h1>

      <div className="flex gap-4 items-center">
        <p className="text-lg font-medium">PERSONAL MESSAGES</p>
        <Search className="w-6 h-6 text-green-500" />
        <CirclePlus className="w-6 h-6 text-green-500" />
      </div>

      <div className="relative w-full mx-auto">
        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search students, teachers, parents"
          className="w-full p-1 rounded border border-gray-400 focus:outline-none"
        />
        <Search className="w-5 h-5 text-gray-400 absolute top-2 right-3" />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
        {users.map((user) => {
          const isSelected = selectedUserId === user.id;

          return (
            <button
              className={`py-2 px-3 flex items-center gap-2 cursor-pointer text-left ${isSelected ? "bg-green-100" : ""}`}
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
            >
              <img src={user.img || getProfileAvatar(user.name, user.role)} alt="profile" className="block w-10 h-10 rounded-full" />
              <p className="font-medium truncate">{user.name}</p>
            </button>
          );
        })}

        {users.length === 0 && <p className="text-sm text-gray-500 px-2">No saved contact found.</p>}
      </div>
    </div>
  );
};

MessageList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      img: PropTypes.string,
    }),
  ).isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  selectedUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
};

MessageList.defaultProps = {
  selectedUserId: null,
};

export default MessageList;
