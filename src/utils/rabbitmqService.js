import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";
import env from "../config/env.js";
import { getChannel } from "../config/rabbitmq.js";
import { sendEmail } from "../services/emailService.js";

const publishToQueue = async (message) => {
  try {
    const channel = getChannel();
    const success = channel.sendToQueue(
      env.analyzeQueue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );

    if (!success) {
      throw createError.InternalServerError(
        MESSAGES.ERROR.FAILED_PUBLISH_MESSAGE
      );
    }
  } catch (err) {
    throw err;
  }
};

const consumeEmailQueue = async () => {
  try {
    const channel = getChannel();

    channel.consume(env.emailQueue, async (msg) => {
      if (!msg) {
        return;
      }

      const { email, message, url } = JSON.parse(msg.content.toString());

      try {
        await sendEmail({ email, message, url });
        channel.ack(msg);
      } catch {
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    throw createError.InternalServerError(MESSAGES.ERROR.SERVER_ERROR);
  }
};

export { publishToQueue, consumeEmailQueue };
