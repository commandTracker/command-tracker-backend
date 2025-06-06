import ytdl from "@distube/ytdl-core";

import { HTTP_STATUS, MESSAGES } from "../../config/constants.js";
import env from "../../config/env.js";
import { storage, bucket } from "../../config/gcs.js";
import generateSignedUrl from "../../utils/generateSignedUrl.js";

const serveExistingVideo = async (req, res, next) => {
  const { youtubeUrl } = req.body;
  const videoId = ytdl.getURLVideoID(youtubeUrl);
  const fileName = `${env.ORIGINAL_PREFIX}/${videoId}.mp4`;
  const file = bucket.file(fileName);
  const [exists] = await file.exists();

  if (exists) {
    const signedUrl = await generateSignedUrl(storage, fileName);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.SUCCESS.VIDEO_LOAD,
      download_url: signedUrl,
    });
  } else {
    req.videoId = videoId;

    next();
  }
};

export default serveExistingVideo;
