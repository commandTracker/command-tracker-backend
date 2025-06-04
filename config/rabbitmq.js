import amqp from "amqplib";

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
      connection = null;
      channel = null;

      setTimeout(connectRabbitMQ, 5000);
    });
  } catch {
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = () => {
  if (!channel) {
    return null;
  }
  return channel;
};

export { connectRabbitMQ, getChannel };
