import ytdl from "@distube/ytdl-core";

import env from "../config/env.js";
import { storage, bucket } from "../config/gcs.js";
import generateSignedUrl from "../utils/generateSignedUrl.js";

const getYoutubeVideo = async (youtubeUrl) => {
  const videoStream = ytdl(youtubeUrl, { quality: "highest" });

  return videoStream;
};

const saveVideoToGcs = async (videoStream, videoId) => {
  const fileName = `${env.ORIGINAL_PREFIX}/${videoId}.mp4`;
  const file = bucket.file(fileName);

  await new Promise((resolve, reject) => {
    videoStream
      .pipe(file.createWriteStream({ contentType: "video/mp4" }))
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });

  return await generateSignedUrl(storage, fileName);
};

export { getYoutubeVideo, saveVideoToGcs };
