import amqp from "amqplib";
import createError from "http-errors";

import { MESSAGES, HTTP_STATUS } from "../../config/constants.js";
import config from "../../config/env.js";
import { sendEmail } from "../services/emailService.js";

const publishToQueue = async (queue, message) => {
  try {
    if (!queue || !message) {
      throw createError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.ERROR.MISSING_REQUIRED_FIELD
      );
    }

    const connection = await amqp.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    const success = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );

    if (!success) {
      throw createError(
        HTTP_STATUS.SERVER_ERROR,
        MESSAGES.ERROR.FAILED_PUBLISH_MESSAGE
      );
    }
  } catch (err) {
    throw err;
  }
};

const consumeEmailQueue = async () => {
  const queue = "email_queue";
  try {
    const connection = await amqp.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg) => {
      if (!msg) {
        return;
      }
      const { to, subject, downloadLink } = JSON.parse(msg.content.toString());
      try {
        await sendEmail({ to, subject, downloadLink });
        channel.ack(msg);
      } catch {
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    throw createError(HTTP_STATUS.SERVER_ERROR, err.message);
  }
};

export { publishToQueue, consumeEmailQueue };
