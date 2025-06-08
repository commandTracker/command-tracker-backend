import createError from "http-errors";

import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import transVideoAndUpload from "../services/transVideoService.js";
import { publishToQueue } from "../utils/rabbitmqService.js";

const editController = async (req, res, next) => {
  const { videoId, trim, email, selectedCharacter } = req.body;
  const [start, end] = trim.map(Number);

  try {
    const message = await transVideoAndUpload({
      videoId,
      start,
      end,
      email,
      selectedCharacter,
    });

    const queue = "analyze_queue";

    await publishToQueue(queue, message);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.SUCCESS.VIDEO_REQUEST,
      email,
    });
  } catch (err) {
    return next(
      createError(HTTP_STATUS.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
    );
  }
};

export default editController;
