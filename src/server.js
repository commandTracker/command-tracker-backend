import app from "./app.js";
import config from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { consumeEmailQueue } from "./utils/rabbitmqService.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    await consumeEmailQueue();

    const { port } = config;

    app.listen(port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();
