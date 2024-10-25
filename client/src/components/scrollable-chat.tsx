import ScrollableFeed from "react-scrollable-feed";

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/index";
import {ChatState} from "../context/chat-provider";

interface ScrollableChatProps {
  messages: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      pic: string;
      name: string;
    };
  }[];
}

const ScrollableChat = ({messages}: ScrollableChatProps) => {
  const {user} = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex gap-1.5" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div>
                <img
                  src={m.sender.pic}
                  alt={m.sender.name}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
