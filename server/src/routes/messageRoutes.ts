import express from "express";

import {protect} from "../middleware/authMiddleware";
import {allMessages, sendMessage} from "../controllers/messageControllers";

const router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);

export default router;
