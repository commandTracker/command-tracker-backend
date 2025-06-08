import express from "express";

import editController from "../controllers/editController.js";

import validateEditRequest from "./middleware/validation/editValidation.js";

const router = express.Router();

router.post("/", validateEditRequest, editController);

export default router;
