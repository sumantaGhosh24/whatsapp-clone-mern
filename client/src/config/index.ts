export const isSameSenderMargin = (
  messages: {sender: {_id: string}}[],
  m: {sender: {_id: string}},
  i: number,
  userId: string
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (
  messages: {sender: {_id: string}}[],
  m: {sender: {_id: string}},
  i: number,
  userId: string
) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (
  messages: {sender: {_id: string}}[],
  i: number,
  userId: string
) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (
  messages: {sender: {_id: string}}[],
  m: {sender: {_id: string}},
  i: number
) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (
  loggedUser: {_id: string},
  users: {name: string; _id: string}[]
) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (
  loggedUser: {_id: string},
  users: {_id: string}[]
): any => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
