import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import { getYoutubeVideo, saveVideoToGcs } from "../services/videoService.js";

const uploadVideoRequests = async (req, res, next) => {
  const youtubeUrl = req.body.youtubeUrl;

  try {
    const videoStream = await getYoutubeVideo(youtubeUrl);
    const outputFileName = new Date().toISOString() + "video.mp4";
    const signedUrl = await saveVideoToGcs(videoStream, outputFileName);

    res.json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.SUCCESS.VIDEO_LOAD,
      download_url: signedUrl,
    });
  } catch (err) {
    next(err);
  }
};

export { uploadVideoRequests };
