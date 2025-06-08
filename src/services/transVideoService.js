import { PassThrough } from "stream";

import { Storage } from "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";

import config from "../config/env.js";

const storage = new Storage();
const bucketName = config.gcs_bucket;
const bucket = storage.bucket(bucketName);

const transVideoAndUpload = ({ videoSrc, start, end, side, email }) => {
  return new Promise((resolve, reject) => {
    const readStream = bucket.file(videoSrc).createReadStream();
    const fileName = `${email}${Date.now()}`;
    const message = {
      email,
      side,
      fileName,
    };
    const writeStream = bucket.file(fileName).createWriteStream({
      resumable: false,
      metadata: { contentType: "video/mp4" },
    });

    const ffmpegStream = new PassThrough();

    ffmpeg(readStream)
      .inputFormat("mp4")
      .setStartTime(start)
      .setDuration(end - start)
      .format("mp4")
      .on("error", (err) => {
        readStream.destroy();
        writeStream.destroy();
        reject(err);
      })
      .on("end", () => ffmpegStream.end())
      .pipe(ffmpegStream);

    ffmpegStream
      .pipe(writeStream)
      .on("finish", () => resolve(message))
      .on("error", reject);
  });
};

export default transVideoAndUpload;
