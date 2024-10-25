import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface ChatContextType {
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
  user: any;
  setUser: (user: any) => void;
  notification: any[];
  setNotification: (notification: any[]) => void;
  chats: any[];
  setChats: (chats: any[]) => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({children}: ChatProviderProps) => {
  const [selectedChat, setSelectedChat] = useState<any>();
  const [user, setUser] = useState<any>();
  const [notification, setNotification] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    setUser(userInfo);

    if (!userInfo) navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used withing a ChatProvider");
  }
  return context;
};

export default ChatProvider;
