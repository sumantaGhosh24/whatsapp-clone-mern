import {Request, Response} from "express";

import generateToken from "../config/generateToke";
import User from "../models/userModel";
import {IReqAuth} from "../types";

const allUsers = async (req: IReqAuth, res: Response) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
          ],
        }
      : {};

    const users = await User.find(keyword).find({_id: {$ne: req?.user?._id}});
    res.send(users);
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const {name, email, password, pic} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({message: "Please fill all fields."});
    }

    const userExists = await User.findOne({email});

    if (userExists) {
      return res.status(400).json({message: "User already exists."});
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({message: "User not found."});
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

const authUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({message: "Invalid login credentials."});
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export {allUsers, registerUser, authUser};
