import { pipeline } from "stream/promises";

import ytdl from "@distube/ytdl-core";
import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import { bucket } from "../config/gcs.js";

const getYoutubeVideo = async (youtubeUrl) => {
  const videoStream = ytdl(youtubeUrl, { quality: "highestvideo" });

  return videoStream;
};

const saveVideoToGcs = async (videoStream, fileName) => {
  try {
    const writeStream = bucket.file(fileName).createWriteStream({
      metadata: { contentType: "video/webm" },
    });

    writeStream.on("error", () => {
      throw createError.InternalServerError(MESSAGES.ERROR.FAILED_SAVE_VIDEO);
    });

    await pipeline(videoStream, writeStream);
  } catch (error) {
    throw error;
  }
};

export { getYoutubeVideo, saveVideoToGcs };
