import { Router } from "express";
import { uploadVideoRequests } from "../controllers/videoController.js";

const router = Router();

router.post("/", uploadVideoRequests);

export default router;
