import ffmpeg from "fluent-ffmpeg";
import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import env from "../config/env.js";
import { bucket } from "../config/gcs.js";

const transVideoAndUpload = async ({
  videoId,
  trimStart,
  trimEnd,
  email,
  selectedCharacter,
}) => {
  const originalVideo = `${env.ORIGINAL_PREFIX}/${videoId}.mp4`;
  const outputFileName = `${email}${Date.now()}.mp4`;

  try {
    const stream = bucket.file(originalVideo).createReadStream();

    await new Promise((resolve, reject) => {
      const ffmpegProcess = ffmpeg(stream)
        .seekInput(trimStart)
        .duration(trimEnd - trimStart)
        .format("webm")
        .on("error", () => {
          reject(
            createError.InternalServerError(MESSAGES.ERROR.FAILED_EDIT_VIDEO)
          );
        });

      const writeStream = bucket
        .file(`${env.EDITED_PREFIX}/${outputFileName}`)
        .createWriteStream({
          metadata: { contentType: "video/webm" },
        });

      ffmpegProcess.pipe(writeStream, { end: true });

      writeStream.on("finish", () => {
        resolve(ffmpegProcess);
      });
      writeStream.on("error", () => {
        reject(
          createError.InternalServerError(MESSAGES.ERROR.FAILED_SAVE_VIDEO)
        );
      });
    });

    return {
      email,
      file_name: outputFileName,
      selected_character: selectedCharacter,
    };
  } catch (err) {
    throw err;
  }
};

export default transVideoAndUpload;
