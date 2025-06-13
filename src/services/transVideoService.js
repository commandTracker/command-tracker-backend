import { unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

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
  const originalVideoName = `${videoId}.mp4`;
  const originalVideoPath = `${env.ORIGINAL_PREFIX}/${originalVideoName}`;
  const tempFilePath = path.join(tmpdir(), originalVideoName);
  const outputFileName = `${email}${Date.now()}.mp4`;
  const outputTempPath = path.join(tmpdir(), outputFileName);

  try {
    await bucket
      .file(originalVideoPath)
      .download({ destination: tempFilePath });
  } catch {
    throw createError.InternalServerError(MESSAGES.ERROR.FAILED_READ_VIDEO);
  }

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .seekInput(trimStart)
        .duration(trimEnd - trimStart)
        .format("mp4")
        .on("error", () => {
          reject(
            createError.InternalServerError(MESSAGES.ERROR.FAILED_EDIT_VIDEO)
          );
        })
        .on("end", () => {
          resolve();
        })
        .save(outputTempPath);
    });

    try {
      await bucket.upload(outputTempPath, {
        destination: `${env.EDITED_PREFIX}/${outputFileName}`,
      });
    } catch {
      throw createError.InternalServerError(MESSAGES.ERROR.FAILED_SAVE_VIDEO);
    }

    return {
      email,
      file_name: outputFileName,
      selected_character: selectedCharacter,
    };
  } catch (err) {
    throw err;
  } finally {
    await unlink(tempFilePath);
    await unlink(outputTempPath);
  }
};

export default transVideoAndUpload;
