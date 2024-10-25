import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import {IReqAuth} from "../types";

export const protect = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return;

        req.user = user;

        next();
      } catch (error) {
        return res.status(401).json({message: "Not authorized."});
      }
    }

    if (!token) {
      return res.status(401).json({message: "Not authorized."});
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};
