import express from "express";

import {protect} from "../middleware/authMiddleware";
import {allUsers, authUser, registerUser} from "../controllers/userControllers";

const router = express.Router();

router.get("/", protect, allUsers);
router.post("/", registerUser);
router.post("/login", authUser);

export default router;
