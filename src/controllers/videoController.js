import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import { getYoutubeVideo, saveVideoToGcs } from "../services/videoService.js";

const uploadVideoRequests = async (req, res, next) => {
  const { youtubeUrl } = req.body;

  try {
    const videoStream = await getYoutubeVideo(youtubeUrl);
    const signedUrl = await saveVideoToGcs(videoStream, req.videoId);

    res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.SUCCESS.VIDEO_LOAD,
      download_url: signedUrl,
    });
  } catch (error) {
    next(error);
  }
};

export default uploadVideoRequests;
