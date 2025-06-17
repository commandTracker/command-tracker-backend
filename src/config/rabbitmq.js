import amqp from "amqplib";
import createError from "http-errors";

import { HTTP_STATUS, MESSAGES } from "./constants.js";
import env from "./env.js";

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(env.rabbitmqUrl);
    channel = await connection.createChannel();

    connection.on("error", () => {
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      setTimeout(connectRabbitMQ, 5000);
    });

    const { analyzeQueue, emailQueue } = env;

    await channel.assertQueue(analyzeQueue, { durable: true });
    await channel.assertQueue(emailQueue, { durable: true });
  } catch {
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = () => {
  if (!channel) {
    throw createError(HTTP_STATUS.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR);
  }
  return channel;
};

export { connectRabbitMQ, getChannel };
