import express from "express";

import notifySubmissionSuccess from "../controllers/emailController.js";

const router = express.Router();

router.get("/edit/submit", notifySubmissionSuccess);

export default router;
