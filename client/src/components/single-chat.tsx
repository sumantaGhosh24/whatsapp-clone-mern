import {ChangeEvent, useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import io from "socket.io-client";
import {FaArrowLeft} from "react-icons/fa";

import {ChatState} from "../context/chat-provider";
import UpdateGroupChatModal from "./update-group-chat-modal";
import ScrollableChat from "./scrollable-chat";
import Modal from "./modal";
import {getSender, getSenderFull} from "../config/index";

const ENDPOINT = "http://localhost:8080";

var socket: any, selectedChatCompare: any;

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: any;
}

const SingleChat = ({fetchAgain, setFetchAgain}: SingleChatProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {selectedChat, setSelectedChat, user, notification, setNotification} =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(
        `http://localhost:8080/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);

      socket.emit("join chat", selectedChat._id);
    } catch (error: any) {
      toast.error(`Fetch messages error : ${error.message}`, {
        toastId: "fetch-message-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event: any) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const {data} = await axios.post(
          "http://localhost:8080/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error: any) {
        toast.error(`Send message error : ${error.message}`, {
          toastId: "send-message-error",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between bg-green-700 text-white w-full p-5">
            <button
              onClick={() => setSelectedChat("")}
              className="w-fit bg-white text-black px-4 py-4 rounded-full hover:bg-gray-200 transition-colors my-5"
            >
              <FaArrowLeft />
            </button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <h3 className="text-xl font-bold capitalize">
                    {getSender(user, selectedChat.users)}
                  </h3>
                  <Modal
                    trigger={
                      <img
                        src={getSenderFull(user, selectedChat.users).pic}
                        className="h-12 w-12 rounded-full cursor-pointer"
                      />
                    }
                  >
                    <div className="mt-10 text-black w-[80%] mx-auto space-y-5">
                      <img
                        src={getSenderFull(user, selectedChat.users).pic}
                        alt={getSenderFull(user, selectedChat.users).name}
                        className="h-[300px] rounded"
                      />
                      <h3 className="text-2xl font-bold capitalize">
                        {getSenderFull(user, selectedChat.users).name}
                      </h3>
                      <p className="text-xl font-medium">
                        <span className="font-bold">Email: </span>
                        {getSenderFull(user, selectedChat.users).email}
                      </p>
                      <p className="text-xl font-medium">
                        <span className="font-bold">Created At: </span>
                        {new Date(
                          getSenderFull(user, selectedChat.users).createdAt
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xl font-medium">
                        <span className="font-bold">Updated At: </span>
                        {new Date(
                          getSenderFull(user, selectedChat.users).updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </Modal>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold capitalize">
                    {selectedChat.chatName}
                  </h3>
                  <Modal
                    title="Manage"
                    buttonStyle="bg-white hover:bg-gray-200 text-black"
                  >
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </Modal>
                </>
              ))}
          </div>
          <div>
            {loading ? (
              <span className="text-2xl font-bold">Loading...</span>
            ) : (
              <div className="overflow-y-scroll no-scrollbar h-[75vh] mt-1.5">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className="flex items-center gap-1.5 absolute bottom-0 left-0 w-full p-3">
              {isTyping ? (
                <span className="bg-green-700 text-white rounded-full p-3">
                  Typing...
                </span>
              ) : (
                <></>
              )}
              <input
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
                placeholder="Enter your message"
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-2xl font-bold">
          <p>Click on a user to start chatting</p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
