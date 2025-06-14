import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import env from "../config/env.js";
import { storage } from "../config/gcs.js";
import { getYoutubeVideo, saveVideoToGcs } from "../services/videoService.js";
import generateSignedUrl from "../utils/generateSignedUrl.js";

const uploadVideoRequests = async (req, res, next) => {
  const { youtubeUrl } = req.body;

  try {
    const videoStream = await getYoutubeVideo(youtubeUrl);
    const fileName = `${env.ORIGINAL_PREFIX}/${req.videoId}`;

    await saveVideoToGcs(videoStream, fileName);

    const signedUrl = await generateSignedUrl(storage, fileName);

    res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.SUCCESS.VIDEO_LOAD,
      download_url: signedUrl,
      video_id: req.videoId,
    });
  } catch (error) {
    next(error);
  }
};

export default uploadVideoRequests;
