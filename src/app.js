import express from "express";

import { HTTP_STATUS, MESSAGES } from "./config/constants.js";
import env from "./config/env.js";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${env.API_PREFIX}/video`, videoRoutes);

app.use((req, res, next) => {
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json({ message: MESSAGES.ERROR.NOT_FOUND_PAGE });
});

app.use((err, req, res, next) => {
  res.status(err.status || HTTP_STATUS.SERVER_ERROR).json({
    message: err.message || MESSAGES.ERROR.SERVER_ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
