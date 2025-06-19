import { HTTP_STATUS, MESSAGES } from "../config/constants.js";
import trimVideo from "../services/trimVideo.js";
import { saveVideoToGcs } from "../services/videoService.js";
import { publishToQueue } from "../utils/rabbitmqService.js";

const editController = async (req, res, next) => {
  const { videoId, trimStart, trimEnd, email, selectedCharacter } = req.body;

  try {
    const trimedStream = await trimVideo({
      videoId,
      trimStart,
      trimEnd,
      email,
    });
    const outputFileName = `${email}${Date.now()}`;

    await saveVideoToGcs(trimedStream, outputFileName);

    const message = {
      email,
      file_name: outputFileName,
      selected_character: selectedCharacter,
    };

    await publishToQueue(message);

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
