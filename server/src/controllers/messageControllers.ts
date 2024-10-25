import {Request, Response} from "express";

import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import User from "../models/userModel";
import {IReqAuth} from "../types";

const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({chat: req.params.chatId})
      .populate("sender", "name pic email")
      .populate("chat");

    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const sendMessage = async (req: IReqAuth, res: Response) => {
  try {
    const {content, chatId} = req.body;

    if (!content || !chatId) {
      return res.status(400).json({message: "Invalid request."});
    }

    var newMessage = {
      sender: req?.user?._id,
      content: content,
      chat: chatId,
    };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});

    return res.json(message);
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export {allMessages, sendMessage};
