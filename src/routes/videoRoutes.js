import { Router } from "express";

import uploadVideoRequests from "../controllers/videoController.js";

import validateUploadUrl from "./middleware/validation/uploadValidation.js";

const router = Router();

router.post("/", validateUploadUrl, uploadVideoRequests);

export default router;
