import fs from "fs";

import ffmpeg from "fluent-ffmpeg";
import createError from "http-errors";
import tmp from "tmp";

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
  const fileName = `${email}${Date.now()}`;

  const inputTmpPath = tmp.tmpNameSync({ postfix: ".mp4" });
  const outputTmpPath = tmp.tmpNameSync({ postfix: ".mp4" });

  await new Promise((resolve, reject) => {
    const readStream = bucket.file(originalVideo).createReadStream();
    const inputWriteStream = fs.createWriteStream(inputTmpPath);

    readStream.pipe(inputWriteStream);
    inputWriteStream.on("finish", resolve);
    inputWriteStream.on("error", () => {
      reject(createError.InternalServerError(MESSAGES.ERROR.FAILED_READ_VIDEO));
    });
    readStream.on("error", () => {
      reject(createError.InternalServerError(MESSAGES.ERROR.FAILED_READ_VIDEO));
    });
  });

  await new Promise((resolve, reject) => {
    ffmpeg(inputTmpPath)
      .setStartTime(trimStart)
      .setDuration(trimEnd - trimStart)
      .output(outputTmpPath)
      .on("end", resolve)
      .on("error", () =>
        reject(
          createError.InternalServerError(MESSAGES.ERROR.FAILED_EDIT_VIDEO)
        )
      )
      .run();
  });

  const writeStream = bucket
    .file(`${env.EDITED_PREFIX}/${fileName}`)
    .createWriteStream({
      resumable: false,
      metadata: { contentType: "video/mp4" },
    });

  await new Promise((resolve, reject) => {
    fs.createReadStream(outputTmpPath)
      .pipe(writeStream)
      .on("finish", resolve)
      .on("error", () =>
        reject(
          createError.InternalServerError(MESSAGES.ERROR.FAILED_SAVE_VIDEO)
        )
      );
  });

  await fs.promises.unlink(inputTmpPath);
  await fs.promises.unlink(outputTmpPath);

  return {
    email,
    file_name: fileName,
    selected_character: selectedCharacter,
  };
};

export default transVideoAndUpload;
