import cors from "cors";
import express from "express";
import createError from "http-errors";

import { HTTP_STATUS, MESSAGES } from "../config/constants.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next(createError(HTTP_STATUS.NOT_FOUND, MESSAGES.ERROR.NOT_FOUND_PAGE));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || MESSAGES.ERROR.SERVER_ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
