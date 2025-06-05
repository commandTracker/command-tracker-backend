import express from "express";

import * as emailController from "../controllers/emailController.js";

const router = express.Router();

router.get("/edit/submit", emailController.notifySubmissionSuccess);

export default router;
