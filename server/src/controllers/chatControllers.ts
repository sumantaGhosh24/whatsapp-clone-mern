import {Request, Response} from "express";

import Chat from "../models/chatModel";
import User from "../models/userModel";
import {IReqAuth} from "../types";

const accessChat = async (req: IReqAuth, res: Response) => {
  try {
    const {userId} = req.body;

    if (!userId) {
      return res.status(400).json({message: "Invalid user id."});
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {users: {$elemMatch: {$eq: req?.user?._id}}},
        {users: {$elemMatch: {$eq: userId}}},
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req?.user?._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
        "users",
        "-password"
      );
      return res.json(FullChat);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const fetchChats = async (req: IReqAuth, res: Response) => {
  try {
    Chat.find({users: {$elemMatch: {$eq: req?.user?._id}}})
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({updatedAt: -1})
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        return res.send(results);
      });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const createGroupChat = async (req: IReqAuth, res: Response) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({message: "Please fill all the fields."});
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).json({
        message: "More than 2 users are required to form a group chat.",
      });
    }

    users.push(req?.user);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req?.user,
    });

    const fullGroupChat = await Chat.findOne({_id: groupChat._id})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.json(fullGroupChat);
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const renameGroup = async (req: Request, res: Response) => {
  try {
    const {chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(400).json({message: "Chat not found."});
    } else {
      return res.json(updatedChat);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const removeFromGroup = async (req: Request, res: Response) => {
  try {
    const {chatId, userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {users: userId},
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(400).json({message: "Chat not found."});
    } else {
      return res.json(removed);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const addToGroup = async (req: Request, res: Response) => {
  try {
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {users: userId},
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(400).json({message: "Chat not found."});
    } else {
      return res.json(added);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
