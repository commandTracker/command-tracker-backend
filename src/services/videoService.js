import ytdl from "@distube/ytdl-core";
import { Storage } from "@google-cloud/storage";
import env from "../config/env.js";

const getYoutubeVideo = async (youtubeUrl) => {
  try {
    const videoStream = ytdl(youtubeUrl, { quality: "highest" });

    return videoStream;
  } catch (error) {
    throw error;
  }
};

const saveVideoToGcs = async (videoStream, fileOutputName) => {
  try {
    const storage = new Storage({
      projectId: env.googleProjectId,
      keyFilename: env.keyFileName,
      metadata: {
        contentType: "video/mp4",
      },
    });
    const bucket = storage.bucket(env.bucketName);
    const file = bucket.file(fileOutputName);

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
  } catch (error) {
    throw error;
  }
};

export { getYoutubeVideo, saveVideoToGcs };
