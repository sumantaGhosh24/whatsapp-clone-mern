import {useState} from "react";

import ChatBox from "../components/chat-box";
import MyChats from "../components/my-chats";
import SideDrawer from "../components/side-drawer";
import {ChatState} from "../context/chat-provider";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const {user} = ChatState();

  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer />}
      <div className="flex flex-wrap">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chat;
