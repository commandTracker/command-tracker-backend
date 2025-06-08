import { Router } from "express";

import uploadVideoRequests from "../controllers/videoController.js";

import serveExistingVideo from "./middleware/serveExistingVideo.js";
import validateUploadUrl from "./middleware/validation/uploadValidation.js";

const router = Router();

router.post("/", validateUploadUrl, serveExistingVideo, uploadVideoRequests);

export default router;
