import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

import {ChatState} from "../context/chat-provider";
import GroupChatModal from "./group-chat-modal";
import ChatLoading from "./chat-loading";
import {getSender} from "../config/index";
import Modal from "./modal";

interface MyChatsProps {
  fetchAgain: any;
}

const MyChats = ({fetchAgain}: MyChatsProps) => {
  const [loggedUser, setLoggedUser] = useState();

  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get("http://localhost:8080/api/chat", config);

      setChats(data);
    } catch (error: any) {
      toast.error(`Fetch chats error : ${error.message}`);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") || "null"));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div className="w-[30%] h-[92vh] bg-green-700 space-y-4 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-white">My Chats</p>
        <Modal
          title="New Group Chat"
          buttonStyle="bg-white hover:bg-gray-200 text-black"
        >
          <GroupChatModal />
        </Modal>
      </div>
      <div>
        {chats ? (
          <div>
            {chats?.map((chat) => (
              <button
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`w-full rounded p-3 my-1.5 text-left ${
                  selectedChat === chat
                    ? "bg-[#38B2AC] text-white"
                    : "bg-[#E8E8E8] text-black"
                }`}
              >
                <p className="text-xl font-bold capitalize">
                  {!chat.isGroupChat
                    ? getSender(loggedUser as any, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs font-medium mt-2">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
