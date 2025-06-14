import { pipeline } from "stream/promises";

import ytdl from "@nuclearplayer/ytdl-core";
import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import env from "../config/env.js";
import { storage, bucket } from "../config/gcs.js";
import generateSignedUrl from "../utils/generateSignedUrl.js";

const getYoutubeVideo = async (youtubeUrl) => {
  const videoStream = ytdl(youtubeUrl, { quality: "highestvideo" });

  return videoStream;
};

const saveVideoToGcs = async (videoStream, videoId) => {
  const fileName = `${env.ORIGINAL_PREFIX}/${videoId}`;
  const file = bucket.file(fileName);

  try {
    const writeStream = file.createWriteStream({ contentType: "video/webm" });

    await pipeline(videoStream, writeStream);
  } catch {
    throw new createError.InternalServerError(MESSAGES.ERROR.FAILED_SAVE_VIDEO);
  }

  return await generateSignedUrl(storage, fileName);
};

export { getYoutubeVideo, saveVideoToGcs };
