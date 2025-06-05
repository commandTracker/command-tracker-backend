import config from "../config/env.js";
import connectRabbitMQ from "../config/rabbitmq.js";

import app from "./app.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    const { port } = config;

    app.listen(port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();
