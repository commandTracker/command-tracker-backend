import { PassThrough } from "stream";

import ffmpeg from "fluent-ffmpeg";
import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import { bucket } from "../config/gcs.js";

const transVideoAndUpload = ({ videoId, start, end, side, email }) => {
  return new Promise((resolve, reject) => {
    const readStream = bucket.file(videoId).createReadStream();
    const fileName = `${email}${Date.now()}`;
    const message = {
      email,
      file_name: fileName,
      selected_character: side,
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
      .on("error", () => {
        readStream.destroy();
        writeStream.destroy();

        const error = createError.InternalServerError(
          MESSAGES.ERROR.FAILED_READ_VIDEO
        );

        reject(error);
      })
      .on("end", () => ffmpegStream.end())
      .pipe(ffmpegStream);

    ffmpegStream
      .pipe(writeStream)
      .on("finish", () => resolve(message))
      .on("error", () => {
        const error = createError.InternalServerError(
          MESSAGES.ERROR.FAILED_SAVE_VIDEO
        );
        reject(error);
      });
  });
};

export default transVideoAndUpload;
