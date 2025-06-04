import { getChannel } from "../../config/rabbitmq.js";
import { sendEmail } from "../services/emailService.js";

const publishToQueue = async (queue, message) => {
  const channel = await getChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

const consumeEmailQueue = async () => {
  const channel = await getChannel();
  const queue = "email_queue";

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { to, subject, html } = JSON.parse(msg.content.toString());
      try {
        await sendEmail({ to, subject, html });
        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false);
      }
    }
  });
};

export { publishToQueue, consumeEmailQueue };
