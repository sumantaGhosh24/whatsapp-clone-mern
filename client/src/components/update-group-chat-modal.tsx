import {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";

import {ChatState} from "../context/chat-provider";
import UserBadgeItem from "./user-badge-item";
import UserListItem from "./user-list-item";

interface UpdateGroupChatModalProps {
  fetchMessages: any;
  fetchAgain: boolean;
  setFetchAgain: any;
}

const UpdateGroupChatModal = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}: UpdateGroupChatModalProps) => {
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const {selectedChat, setSelectedChat, user} = ChatState();

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(
        `http://localhost:8080/api/user?search=${search}`,
        config
      );

      setSearchResult(data);
    } catch (error: any) {
      toast.error(`Search error : ${error.message}`, {toastId: "search-error"});
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can rename group.", {
        toastId: "rename-error",
      });

      return;
    }

    if (!groupChatName) return;

    setRenameLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.put(
        `http://localhost:8080/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
    } catch (error: any) {
      toast.error(`Rename error : ${error.message}`, {toastId: "rename-error"});
    } finally {
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1: {_id: string}) => {
    if (selectedChat.users.find((u: {_id: string}) => u._id === user1._id)) {
      toast.error("User already in group.", {toastId: "add-user-error"});

      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone.", {toastId: "add-user-error"});

      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.put(
        `http://localhost:8080/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
    } catch (error: any) {
      toast.error(`Add user error : ${error.message}`, {
        toastId: "add-user-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (user1: {_id: string}) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone.", {
        toastId: "remove-user-error",
      });

      return;
    }

    if (selectedChat.groupAdmin._id === user1._id) {
      toast.error("Admin not leave group.", {
        toastId: "remove-user-error",
      });

      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.put(
        `http://localhost:8080/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id
        ? setSelectedChat(undefined)
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setGroupChatName("");
    } catch (error: any) {
      toast.error(`Remove user error : ${error.message}`, {
        toastId: "remove-user-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4 text-black mt-10">
        <h3 className="text-2xl font-bold capitalize">
          {selectedChat.chatName}
        </h3>
        <div className="flex items-center flex-wrap gap-3">
          {selectedChat.users.map((u: any) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              admin={selectedChat.groupAdmin}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <input
            placeholder="Enter group name"
            value={groupChatName}
            onChange={(e: any) => setGroupChatName(e.target.value)}
            className="w-[90%] px-4 py-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
          />
          <button
            disabled={renameLoading}
            onClick={handleRename}
            className="w-fit bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
          >
            Update
          </button>
        </div>
        <div>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            placeholder="Add user to group"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div>
          {loading ? (
            <span className="text-2xl font-bold">Loading...</span>
          ) : (
            searchResult?.map((user: any) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </div>
        <button
          onClick={() => handleRemove(user)}
          className="w-fit bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors"
        >
          Leave Group
        </button>
      </div>
    </>
  );
};

export default UpdateGroupChatModal;
