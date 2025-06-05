/* eslint-disable no-unused-vars */
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
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch {
    setTimeout(connectRabbitMQ, 5000);
  }
};

export default connectRabbitMQ;
