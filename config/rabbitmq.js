import amqp from "amqplib";
import config from "../config/env.js";

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(config.rabbitmqUrl);
    channel = await connection.createChannel();

    connection.on("error", (err) => {
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      connection = null;
      channel = null;

      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (err) {
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
