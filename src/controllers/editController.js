import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import transVideoAndUpload from "../services/transVideoService.js";
import { publishToQueue } from "../utils/rabbitmqService.js";

const editController = async (req, res, next) => {
  const { videoId, trimStart, trimEnd, email, selectedCharacter } = req.body;

  try {
    const message = await transVideoAndUpload({
      videoId,
      trimStart,
      trimEnd,
      email,
      selectedCharacter,
    });

    const queue = "analyze_queue";

    await publishToQueue(queue, message);

    res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.SUCCESS.VIDEO_REQUEST,
      email,
    });
  } catch (err) {
    next(err);
  }
};

export default editController;
