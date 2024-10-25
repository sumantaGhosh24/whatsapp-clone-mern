import {ChatState} from "../context/chat-provider";
import SingleChat from "./single-chat";

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: any;
}

const ChatBox = ({fetchAgain, setFetchAgain}: ChatBoxProps) => {
  const {selectedChat} = ChatState();

  return (
    <div className={`${selectedChat ? "flex" : "none"} w-[70%] p-5 relative`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
