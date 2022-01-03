import express from "express";
import { typeLists, matchList } from "../controllers/typeListsController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, typeLists);
router.route("/matchlist").get(protect, matchList);

export default router;
