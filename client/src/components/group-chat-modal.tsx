import {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";

import {ChatState} from "../context/chat-provider";
import UserBadgeItem from "./user-badge-item";
import UserListItem from "./user-list-item";

const GroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const {user, chats, setChats} = ChatState();

  const handleGroup = (userToAdd: any) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added.", {toastId: "group-error"});

      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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

  const handleDelete = (delUser: {_id: string}) => {
    setSelectedUsers(
      selectedUsers.filter((sel: {_id: string}) => sel._id !== delUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the fields.", {toastId: "group-error"});

      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post(
        `http://localhost:8080/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u: {_id: string}) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);

      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);

      toast.success("New group chat created.", {toastId: "group-success"});
    } catch (error: any) {
      toast.error(`Create group error : ${error.message}`, {
        toastId: "group-error",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Create Group Chat</h3>
        <div>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            placeholder="Enter chat name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            placeholder="Add multiple user to create group"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-3">
            {selectedUsers.map((u: {_id: string; name: string}) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>
          {loading ? (
            <div className="text-xl font-bold">Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map(
                (user: {
                  _id: string;
                  name: string;
                  pic: string;
                  email: string;
                }) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                )
              )
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="w-fit bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors disabled:bg-green-300"
        >
          Create Chat
        </button>
      </div>
    </>
  );
};

export default GroupChatModal;
