import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import NotificationBadge from "react-notification-badge";
import {Effect} from "react-notification-badge";
import {toast} from "react-toastify";
import {FaBell, FaSignOutAlt} from "react-icons/fa";

import {ChatState} from "../context/chat-provider";
import {getSender} from "../config/index";
import UserListItem from "./user-list-item";
import Modal from "./modal";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something.", {toastId: "search-error"});

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
      toast.error(`Search error : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    setLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post(
        `http://localhost:8080/api/chat`,
        {userId},
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error: any) {
      toast.error(`Chat access error : ${error.message}`);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="bg-green-800">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Modal
            title="Search User"
            buttonStyle="bg-white text-black hover:bg-gray-200"
          >
            <div className="space-x-1">
              <input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[60%] px-4 py-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
              />
              <button
                onClick={handleSearch}
                className="w-fit bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
              >
                Go
              </button>
            </div>
            {loading ? (
              <span className="text-white font-bold text-xl">Loading...</span>
            ) : (
              searchResult?.map(
                (user: {
                  _id: string;
                  name: string;
                  pic: string;
                  email: string;
                }) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                )
              )
            )}
            {loadingChat && (
              <span className="text-white font-bold text-xl">Loading...</span>
            )}
          </Modal>
        </div>
        <div>
          <h2 className="text-center text-white font-bold text-2xl">
            Whatsapp Clone
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <Modal
            trigger={
              <button className="text-white">
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <FaBell size={36} className="mr-1.5" />
              </button>
            }
          >
            <div>
              {!notification.length && (
                <span className="bg-green-600 hover:bg-green-700 transition-colors p-1.5 text-white w-[80%] block rounded cursor-pointer">
                  No New Messages
                </span>
              )}
              {notification.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat ? (
                    <span className="bg-green-600 hover:bg-green-700 transition-colors p-1.5 text-white w-[80%] block rounded cursor-pointer">
                      New Message in ${notif.chat.chatName}
                    </span>
                  ) : (
                    <span className="bg-green-600 hover:bg-green-700 transition-colors p-1.5 text-white w-[80%] block rounded cursor-pointer">
                      New Message from ${getSender(user, notif.chat.users)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Modal>
          <button onClick={() => setOpen(!open)}>
            <img
              alt={user.name}
              src={user.pic}
              className="h-8 w-8 rounded-full"
            />
          </button>
          {open && (
            <div className="fixed top-24 right-5 bg-white rounded-md shadow-md shadow-black p-5 z-50">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={user.pic}
                  alt={user.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold capitalize">{user.name}</h3>
                  <p>Email: {user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-fit px-4 py-2 rounded-md transition-colors bg-red-700 hover:bg-red-800 text-white flex items-center gap-1.5"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
