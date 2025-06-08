/* eslint-disable no-unused-vars */
import amqp from "amqplib";
import createError from "http-errors";

import { HTTP_STATUS, MESSAGES } from "./constants.js";
import config from "./env.js";

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(config.rabbitmqUrl);
    channel = await connection.createChannel();

    connection.on("error", () => {
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      setTimeout(connectRabbitMQ, 5000);
    });
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
