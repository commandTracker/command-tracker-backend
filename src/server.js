import app from "./app.js";
import env from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { consumeEmailQueue } from "./utils/rabbitmqService.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    await consumeEmailQueue();

    const { port } = env;

    app.listen(port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();
