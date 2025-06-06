import amqp from "amqplib";

import config from "../../config/env.js";
import { sendEmail } from "../services/emailService.js";

const publishToQueue = async (queue, message) => {
  const connection = await amqp.connect(config.rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

const consumeEmailQueue = async () => {
  const queue = "email_queue";
  const connection = await amqp.connect(config.rabbitmqUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { to, subject, downloadLink } = JSON.parse(msg.content.toString());
      try {
        await sendEmail({ to, subject, downloadLink });
        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false);
      }
    }
  });
};

export { publishToQueue, consumeEmailQueue };
