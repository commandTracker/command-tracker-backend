import ffmpeg from "fluent-ffmpeg";
import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import env from "../config/env.js";
import { bucket } from "../config/gcs.js";

const trimVideo = async ({ videoId, trimStart, trimEnd }) => {
  const originalVideo = `${env.ORIGINAL_PREFIX}/${videoId}`;

  try {
    const stream = bucket.file(originalVideo).createReadStream();
    const trimedStream = ffmpeg(stream)
      .setStartTime(trimStart)
      .duration(trimEnd - trimStart)
      .format("webm")
      .on("error", () => {
        throw createError.InternalServerError(MESSAGES.ERROR.FAILED_EDIT_VIDEO);
      });

    return trimedStream;
  } catch (err) {
    throw err;
  }
};

export default trimVideo;
