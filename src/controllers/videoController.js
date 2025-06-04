import { getYoutubeVideo, saveVideoToGcs } from "../services/videoService.js";

const uploadVideoRequests = async (req, res, next) => {
  const youtubeUrl = req.query.youtubeUrl;

  try {
    const videoStream = await getYoutubeVideo(youtubeUrl);

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export { uploadVideoRequests };
